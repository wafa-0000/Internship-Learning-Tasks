import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, StatusBar, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Deposit = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalText, setModalText] = useState({ title: '', sub: '' });

  const quickAmounts = ['25', '50', '100', '250'];
  const paymentMethods = [
    { id: '1', methodCode: 'CARD', title: 'Debit/Credit Card', subTitle: 'Use saved or new card', icon: 'credit-card-outline' },
    { id: '2', methodCode: 'BANK', title: 'Bank Transfer', subTitle: '1-3 business days', icon: 'bank-outline' },
    { id: '3', methodCode: 'WALLET', title: 'Money Wallet', subTitle: 'Scan qr code', icon: 'qrcode' },
  ];

  const handleDeposit = async () => {
    const user = auth.currentUser;
    if (!user) { Alert.alert("Authentication Error", "User not logged in."); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert("Amount Required", "Please enter a valid amount."); return; }
    if (!selectedMethod) { Alert.alert("Method Required", "Please select a payment method."); return; }

    const depositAmount = parseFloat(amount);

    if (selectedMethod.methodCode === 'WALLET') {
      navigation.navigate('Receive', { targetAmount: depositAmount, type: 'wallet' });
      return;
    }

    if (selectedMethod.methodCode === 'CARD') {
      navigation.navigate('CardList', { depositAmount: depositAmount });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        amount: depositAmount,
        type: 'deposit',
        method: 'Bank Transfer',
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setModalText({ title: "Deposit Initiated", sub: `Your Bank Transfer request of ZAR ${depositAmount} is pending.` });
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Funds</Text>
        </View>

        {/* KeyboardAvoidingView wrapper */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currency}>ZAR</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#606063"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.quickSelectRow}>
              {quickAmounts.map((val) => (
                <TouchableOpacity key={val} style={[styles.quickBtn, amount === val && styles.activeQuickBtn]} onPress={() => setAmount(val)}>
                  <Text style={[styles.quickBtnText, amount === val && styles.activeQuickText]}>ZAR {val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 30 }]}>Payment Method</Text>
            {paymentMethods.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.paymentCard, selectedMethod?.id === item.id && styles.activeCard]} onPress={() => setSelectedMethod(item)}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.iconBg, selectedMethod?.id === item.id && {backgroundColor: '#000'}]}>
                     <MaterialCommunityIcons name={item.icon as any} size={24} color={selectedMethod?.id === item.id ? "#F3E932" : "#FFF"} />
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Text style={[styles.paymentTitle, selectedMethod?.id === item.id && { color: '#000' }]}>{item.title}</Text>
                    <Text style={[styles.paymentSubtitle, selectedMethod?.id === item.id && { color: 'rgba(0,0,0,0.5)' }]}>{item.subTitle}</Text>
                  </View>
                </View>
                <View style={[styles.radio, selectedMethod?.id === item.id && styles.activeRadio]}>
                    {selectedMethod?.id === item.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Button is now outside ScrollView but inside KeyboardAvoidingView */}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleDeposit} disabled={loading}>
            <Text style={styles.confirmBtnText}>{loading ? "Processing..." : "Confirm Deposit"}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconBox}><MaterialCommunityIcons name="clock-outline" size={30} color="#000" /></View>
            <Text style={styles.modalTitle}>{modalText.title}</Text>
            <Text style={styles.modalSub}>{modalText.sub}</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={() => { setModalVisible(false); navigation.navigate('Balance'); }}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  backBtn: { padding: 10, backgroundColor: '#1C1C1E', borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { paddingBottom: 20 }, // Changed paddingBottom
  label: { color: '#8E8E93', fontSize: 14, marginBottom: 10 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 15 },
  currency: { color: '#8E8E93', fontSize: 18, fontWeight: 'bold' },
  amountInput: { color: '#FFF', fontSize: 24, marginLeft: 10, flex: 1, fontWeight: 'bold' },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  quickBtn: { backgroundColor: '#1C1C1E', paddingVertical: 12, width: '22%', borderRadius: 12, alignItems: 'center' },
  activeQuickBtn: { backgroundColor: '#F3E932' },
  quickBtnText: { color: '#8E8E93', fontWeight: 'bold' },
  activeQuickText: { color: '#000' },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  activeCard: { backgroundColor: '#F3E932', borderColor: '#F3E932' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBg: { backgroundColor: '#2C2C2E', padding: 10, borderRadius: 12 },
  paymentTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  paymentSubtitle: { color: '#8E8E93', fontSize: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#444', justifyContent: 'center', alignItems: 'center' },
  activeRadio: { borderColor: '#000', backgroundColor: '#000' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#F3E932' },
  confirmBtn: { backgroundColor: '#F3E932', padding: 18, borderRadius: 15, alignItems: 'center', marginVertical: 20 },
  confirmBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalContent: { width: '85%', backgroundColor: '#111', padding: 30, borderRadius: 24, alignItems: 'center' },
  successIconBox: { backgroundColor: '#FFA500', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { color: '#8E8E93', textAlign: 'center', marginBottom: 30, fontSize: 14 },
  continueBtn: { backgroundColor: '#F3E932', width: '100%', padding: 16, borderRadius: 15, alignItems: 'center' },
  continueBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

export default Deposit;