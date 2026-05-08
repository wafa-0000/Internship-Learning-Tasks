import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
type RootStackParamList = {
  Verification: undefined;
  Profile: undefined; 
};
const SecurityScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const handleUpdatePassword = () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert("Error", "Please fill all password fields");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    navigation.navigate('Verification');
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account permanently?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            Alert.alert("Deleted", "Your account has been removed.");
            navigation.navigate('Profile');
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security & Privacy</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#4CD964" />
            <Text style={styles.statusTitle}> Account Secured</Text>
          </View>
          <Text style={styles.statusDesc}>Your account has strong security settings enabled</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>2FA Enabled</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>Biometric</Text></View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Authentication</Text>
        <View style={styles.card}>
          {!isChangingPassword ? (
            <View style={styles.passwordRow}>
              <View>
                <Text style={styles.label}>Password</Text>
                <Text style={styles.subLabel}>Last changed 30 days ago</Text>
              </View>
              <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput style={styles.input} placeholder="Current Password" placeholderTextColor="#606063" secureTextEntry value={currentPass} onChangeText={setCurrentPass} />
              <TextInput style={styles.input} placeholder="New Password" placeholderTextColor="#606063" secureTextEntry value={newPass} onChangeText={setNewPass} />
              <TextInput style={styles.input} placeholder="Confirm New Password" placeholderTextColor="#606063" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
                  <Text style={styles.updateButtonText}>Update Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsChangingPassword(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={styles.toggleRow}>
           <Text style={styles.toggleLabel}>Two-Factor Authentication</Text>
           <CustomToggle value={is2FAEnabled} onToggle={() => setIs2FAEnabled(!is2FAEnabled)} />
        </View>

        <View style={styles.toggleRow}>
           <Text style={styles.toggleLabel}>Biometric Authentication</Text>
           <CustomToggle value={isBiometricEnabled} onToggle={() => setIsBiometricEnabled(!isBiometricEnabled)} />
        </View>
        <Text style={[styles.sectionTitle, { color: '#FF453A', marginTop: 20 }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF453A" />
          <Text style={styles.deleteButtonText}> Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20,marginTop:25},
  headerTitle: { color: '#FFF', fontSize: 20,marginTop:25, fontWeight: 'bold', marginLeft: 15 },
  statusCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#2C2C2E' },
  statusTitle: { color: '#4CD964', fontSize: 16, fontWeight: 'bold' },
  statusDesc: { color: '#FFF', fontSize: 13, marginBottom: 15 },
  badgesRow: { flexDirection: 'row', gap: 10 },
  badge: { backgroundColor: '#2C2C2E', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  badgeText: { color: '#FFF', fontSize: 10 },
  sectionTitle: { color: '#606063', fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 15 },
  passwordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#FFF', fontSize: 16 },
  subLabel: { color: '#606063', fontSize: 12 },
  changeButton: { color: '#F3E932', fontWeight: 'bold' },
  input: { backgroundColor: '#0B0B0C', padding: 15, borderRadius: 10, color: '#FFF', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  updateButton: { flex: 1, backgroundColor: '#F3E932', padding: 15, borderRadius: 10, alignItems: 'center' },
  updateButtonText: { color: '#000', fontWeight: 'bold' },
  cancelButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  cancelButtonText: { color: '#FFF' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  toggleLabel: { color: '#FFF', fontSize: 16 },
  toggleTrack: { width: 50, height: 25, borderRadius: 15, padding: 3 },
  toggleThumb: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#FFF' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 15 },
  deleteButtonText: { color: '#FF453A', fontWeight: 'bold' },
});
export default SecurityScreen;