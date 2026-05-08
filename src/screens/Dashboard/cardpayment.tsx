import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const CardPayment = () => {
  const navigation = useNavigation();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handlePurchase = () => {
    if (cardNumber.trim() === '' || expiryDate.trim() === '' || cvv.trim() === '' || cardHolderName.trim() === '') {
      Alert.alert('Incomplete Details', 'Please fill in all the payment fields to continue.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const onConfirm = () => {
    setConfirmModalVisible(false);
    setTimeout(() => {
      setSuccessModalVisible(true);
    }, 500);
  };

  const onCancel = () => {
    setConfirmModalVisible(false);
  };

  const onFinish = () => {
    setSuccessModalVisible(false);
    navigation.navigate('GoldWallet' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Card Payment</Text>
          </View>
          <View style={styles.cardHeaderBox}>
            <MaterialCommunityIcons name="credit-card-outline" size={24} color="#F3E932" />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.cardTitle}>Credit/Debit Card</Text>
              <Text style={styles.cardDesc}>Instant payment</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="1234 5678 9012 3456" 
              placeholderTextColor="#606063"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Expiry Date</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="MM/YY" 
                  placeholderTextColor="#606063" 
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>CVV</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="123" 
                  placeholderTextColor="#606063" 
                  keyboardType="numeric"
                  secureTextEntry 
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="John Doe" 
              placeholderTextColor="#606063" 
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
          </View>
          <View style={styles.securityBox}>
            <MaterialCommunityIcons name="lock" size={16} color="#F3E932" />
            <Text style={styles.securityText}> Your payment information is encrypted and secure</Text>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handlePurchase}>
            <Text style={styles.btnText}>Confirm Purchase</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal transparent={true} visible={confirmModalVisible} animationType="fade" onRequestClose={() => setConfirmModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <MaterialCommunityIcons name="credit-card-outline" size={40} color="#F3E932" style={{marginBottom: 15}} />
              <Text style={styles.modalTitle}>Are you sure you want to continue?</Text>
              <Text style={styles.modalSub}>You're going to transfer gold to your account.</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                  <Text style={{color: '#FFF'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.continueBtn} onPress={onConfirm}>
                  <Text style={{color: '#000', fontWeight: 'bold'}}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent={true} visible={successModalVisible} animationType="fade" onRequestClose={() => setSuccessModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <MaterialCommunityIcons name="check-circle" size={50} color="#4CD964" style={{marginBottom: 15}} />
              <Text style={styles.modalTitle}>Payment Successful!</Text>
              <Text style={styles.modalSub}>Your gold has been added to your vault successfully.</Text>
              <TouchableOpacity style={styles.continueBtn} onPress={onFinish}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>Back to Vault</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  cardHeaderBox: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cardDesc: { color: '#F3E932', fontSize: 12, marginTop: 2 },
  formContainer: { gap: 15 },
  label: { color: '#8E8E93', fontSize: 12, marginBottom: 5 },
  input: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 15, color: '#FFF' },
  row: { flexDirection: 'row' },
  securityBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 25, justifyContent: 'center' },
  securityText: { color: '#F3E932', fontSize: 12, marginLeft: 5 }, 
  confirmBtn: { backgroundColor: '#F3E932', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalView: { backgroundColor: '#1C1C1E', padding: 30, borderRadius: 20, width: '90%', alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalSub: { color: '#8E8E93', fontSize: 14, marginBottom: 25, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#333' },
  continueBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#F3E932' }
});
export default CardPayment;