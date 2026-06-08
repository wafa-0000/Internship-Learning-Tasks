import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet,  TouchableOpacity, 
  ScrollView, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
type RootStackParamList = {
  Verification: { email: string };
  Profile: undefined;
  SignIn: undefined;
};
const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true); 
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  useEffect(() => {
    const fetchSettings = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setIsBiometricEnabled(userDoc.data().isBiometricEnabled ?? false);
            setIs2FAEnabled(userDoc.data().is2FAEnabled ?? false);
          }
        } catch (error) {
          console.log("Error fetching settings:", error);
        }
      }
    };
    fetchSettings();
  }, []);
  const handleUpdatePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert("Error", "Please fill all password fields");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPass);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        
        Alert.alert("Success", "Password updated successfully");
        navigation.navigate('Verification', { email: user.email });
        setIsChangingPassword(false);
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleBiometricToggle = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      Alert.alert("Error", "Biometrics not supported or not set up on this device.");
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm identity",
    });
    if (result.success) {
      try {
        const newValue = !isBiometricEnabled;
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, "users", user.uid), { isBiometricEnabled: newValue });
          setIsBiometricEnabled(newValue);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update settings.");
      }
    }
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account permanently? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            const user = auth.currentUser;
            if (user) {
              try {
                setLoading(true);
                await deleteUser(user);
                navigation.navigate('SignIn' as any);
              } catch (error: any) {
                Alert.alert("Security Check", "Please re-authenticate by changing your password first to delete account.");
              } finally {
                setLoading(false);
              }
            }
          } 
        }
      ]
    );
  };
  const CustomToggle = ({ value, onToggle }: { value: boolean, onToggle: () => void }) => (
    <TouchableOpacity 
      onPress={onToggle}
      style={[styles.toggleTrack, { backgroundColor: value ? '#F3E932' : '#333' }]}
    >
      <View style={[styles.toggleThumb, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security & Privacy</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.shieldIconBg}>
                <MaterialCommunityIcons name="shield-outline" size={24} color="#00FF85" />
            </View>
            <View style={{marginLeft: 12}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.statusTitle}>Account Secured</Text>
                    <View style={styles.greenDot} />
                </View>
                <Text style={styles.statusDesc}>Your account has strong security settings enabled</Text>
                <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name="check" size={12} color="#00FF85" />
                        <Text style={styles.badgeText}>2FA Enabled</Text>
                    </View>
                    <View style={styles.badge}>
                        <MaterialCommunityIcons name="check" size={12} color="#00FF85" />
                        <Text style={styles.badgeText}>Biometric</Text>
                    </View>
                </View>
            </View>
          </View>
        </View>
        <Text style={styles.sectionHeader}><MaterialCommunityIcons name="lock-outline" color="#F3E932" size={16}/> Authentication</Text>
        <View style={styles.card}>
          {!isChangingPassword ? (
            <TouchableOpacity style={styles.itemRow} onPress={() => setIsChangingPassword(true)}>
              <View style={styles.iconBox}><MaterialCommunityIcons name="key-outline" size={20} color="#F3E932" /></View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.subLabel}>Last changed 30 days ago</Text>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder="Current Password" placeholderTextColor="#606063" secureTextEntry value={currentPass} onChangeText={setCurrentPass} />
              <TextInput style={styles.input} placeholder="New Password" placeholderTextColor="#606063" secureTextEntry value={newPass} onChangeText={setNewPass} />
              <TextInput style={styles.input} placeholder="Confirm New Password" placeholderTextColor="#606063" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword} disabled={loading}>
                  {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.updateButtonText}>Update Password</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsChangingPassword(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={[styles.itemRow, {marginTop: 24}]}>
            <View style={styles.iconBox}><MaterialCommunityIcons name="cellphone-lock" size={20} color="#F3E932" /></View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.label}>Two-Factor Authentication</Text>
              <Text style={styles.subLabel}>SMS verification code</Text>
            </View>
            <CustomToggle value={is2FAEnabled} onToggle={() => setIs2FAEnabled(!is2FAEnabled)} />
          </View>
          <View style={[styles.itemRow, {marginTop: 24}]}>
            <View style={styles.iconBox}><MaterialCommunityIcons name="fingerprint" size={20} color="#F3E932" /></View>
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={styles.label}>Biometric Authentication</Text>
              <Text style={styles.subLabel}>Face ID / Touch ID</Text>
            </View>
            <CustomToggle value={isBiometricEnabled} onToggle={handleBiometricToggle} />
          </View>
        </View>
        <Text style={styles.dangerHeader}><MaterialCommunityIcons name="alert-circle-outline" color="#FF453A" size={16}/> Danger Zone</Text>
        <TouchableOpacity style={styles.deleteCard} onPress={handleDeleteAccount}>
          <View style={[styles.iconBox, {backgroundColor: '#2A1414'}]}><MaterialCommunityIcons name="account-remove-outline" size={20} color="#FF453A" /></View>
          <View style={{marginLeft: 12}}>
            <Text style={styles.deleteTitle}>Delete Account</Text>
            <Text style={styles.subLabel}>Permanently delete your account</Text>
          </View>
        </TouchableOpacity>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 25 },
  backBtn: { backgroundColor: '#1C1C1E', padding: 8, borderRadius: 10 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  statusCard: { backgroundColor: '#07150E', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#0D2A1C', marginBottom: 25 },
  statusHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  shieldIconBg: { backgroundColor: '#0D2A1C', padding: 10, borderRadius: 12 },
  statusTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF85', marginLeft: 8 },
  statusDesc: { color: '#606063', fontSize: 12, marginTop: 4, width: '85%' },
  badgeRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D2A1C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#00FF85', fontSize: 10, marginLeft: 5, fontWeight: '600' },
  sectionHeader: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#121316', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#1C1C1E' },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12 },
  label: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  subLabel: { color: '#606063', fontSize: 12, marginTop: 2 },
  changeText: { color: '#F3E932', fontWeight: 'bold', fontSize: 14 },
  inputContainer: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#1C1C1E', paddingTop: 20 },
  input: { backgroundColor: '#0B0B0C', padding: 15, borderRadius: 12, color: '#FFF', marginBottom: 12, borderWidth: 1, borderColor: '#1C1C1E' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  updateButton: { flex: 1, backgroundColor: '#F3E932', padding: 15, borderRadius: 12, alignItems: 'center' },
  updateButtonText: { color: '#000', fontWeight: 'bold' },
  cancelButton: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  cancelButtonText: { color: '#FFF' },
  toggleTrack: { width: 45, height: 24, borderRadius: 12, padding: 3 },
  toggleThumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF' },
  dangerHeader: { color: '#FF453A', fontSize: 14, fontWeight: 'bold', marginBottom: 15, marginTop: 25 },
  deleteCard: { backgroundColor: '#121316', padding: 16, borderRadius: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
  deleteTitle: { color: '#FF453A', fontSize: 15, fontWeight: 'bold' },
});
export default SecurityScreen;