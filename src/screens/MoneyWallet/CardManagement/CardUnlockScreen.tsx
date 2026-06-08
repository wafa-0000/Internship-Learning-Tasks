import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../../firebaseConfig';
import { SIZES } from '../../../utils/constants/theme'; 
import { doc, getDoc } from 'firebase/firestore';
const CardUnlockScreen = ({ navigation, route }: any) => {
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);
  const { cardId } = route.params || {};
  const handleUnlock = async () => {
    if (accessKey.length < 4) {
      Alert.alert("Error", "Please enter the last 4 digits of your Wallet ID.");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const walletId = userData.walletId;
        if (!walletId) {
          Alert.alert("Error", "Wallet ID not initialized. Please contact support.");
          return;
        }
        const lastFourDigits = String(walletId).slice(-4);
        if (accessKey === lastFourDigits) {
          navigation.replace('CardDetailsScreen', { cardId: cardId });
        } else {
          setAccessKey(''); 
          Alert.alert("Security Check", "Incorrect digits. Please try again.");
        }
      } else {
        Alert.alert("Error", "User record not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContent}>
            <View style={styles.lockIconContainer}>
              <MaterialCommunityIcons name="wallet-outline" size={40} color="#FCEB46" />
            </View>
            <Text style={styles.title}>Verify Access</Text>
            <Text style={styles.subtitle}>Enter the last 4 digits of your wallet ID to unlock</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="XXXX"
                placeholderTextColor="#555"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={!isPinVisible}
                value={accessKey}
                onChangeText={setAccessKey}
                textAlign="center"
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setIsPinVisible(!isPinVisible)}
              >
                <MaterialCommunityIcons 
                  name={isPinVisible ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="#FFF" 
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[styles.unlockButton, loading && { opacity: 0.6 }]} 
              onPress={handleUnlock} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.unlockButtonText}>Unlock</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0C0C' },
  keyboardView: { flex: 1 },
  scrollContent: { padding: SIZES.padding },
  innerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  lockIconContainer: { marginBottom: 20, padding: 20, borderRadius: 20, backgroundColor: '#1A1A1A' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#7E7E7E', fontSize: 14, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    width: '100%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    color: '#FFF',
    fontSize: 20,
    letterSpacing: 5,
  },
  eyeIcon: { padding: 10 },
  unlockButton: { backgroundColor: '#FCEB46', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  unlockButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { width: '100%', padding: 18, alignItems: 'center' },
  cancelButtonText: { color: '#7E7E7E', fontSize: 16 },
});
export default CardUnlockScreen;