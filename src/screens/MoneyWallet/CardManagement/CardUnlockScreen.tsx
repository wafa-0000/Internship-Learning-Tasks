import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const CardUnlockScreen = ({ navigation, route }: any) => {
  const [accessKey, setAccessKey] = useState('');
  const { action } = route.params || {};
 const handleUnlock = () => {
    if (accessKey === '1234') {
      if (action === 'freeze') {
        navigation.navigate('CardDetailsScreen', { updatedStatus: 'frozen' });
      } else if (action === 'delete') {
        navigation.navigate('CardDetailsScreen', { updatedStatus: 'deleted' });
      } else {
        navigation.navigate('CardDetailsScreen');
      }
    } else {
      Alert.alert("Security Check", "Incorrect PIN. Please try again.");
    }
  };
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.mainContent}>
        <View style={styles.lockIconContainer}>
          <MaterialCommunityIcons name="lock-outline" size={50} color="#FCEB46" />
        </View>
        <Text style={styles.title}>Enter Access Key</Text>
        <Text style={styles.subtitle}>Enter your 4-digit access key to view card details</Text>
        <TextInput
          style={styles.input} 
          placeholder="AUR-XXXX"
          placeholderTextColor="#444"
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry={true}
          value={accessKey}
          onChangeText={setAccessKey}
          textAlign="center"
        />
        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
          <Text style={styles.unlockButtonText}>Unlock Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNav}>
        <MaterialCommunityIcons name="view-grid-outline" size={24} color="#555" />
        <MaterialCommunityIcons name="wallet-outline" size={24} color="#555" />
        <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="#555" />
        <MaterialCommunityIcons name="account-outline" size={24} color="#555" />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0C0C0C' },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  lockIconContainer: { marginBottom: 30, padding: 20, borderRadius: 20, backgroundColor: '#141414' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#7E7E7E', fontSize: 14, textAlign: 'center', marginBottom: 40, lineHeight: 20 },
  input: {
    backgroundColor: '#141414', width: '100%', padding: 20, borderRadius: 15,
    color: '#FFF', fontSize: 22, borderWidth: 1, borderColor: '#222', marginBottom: 25, letterSpacing: 5
  },
  unlockButton: { backgroundColor: '#FCEB46', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  unlockButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { width: '100%', padding: 18, alignItems: 'center' },
  cancelButtonText: { color: '#7E7E7E', fontSize: 16 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 30, opacity: 0.5 }
});

export default CardUnlockScreen;