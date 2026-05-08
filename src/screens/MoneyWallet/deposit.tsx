import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, StatusBar 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Deposit = ({ navigation }:any) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const quickAmounts = ['25', '50', '100', '250'];
  const paymentMethods = [
    { id: '1', title: 'Debit/Credit Card', subTitle: 'Instant deposit', icon: 'credit-card-outline' },
    { id: '2', title: 'Bank Transfer', subTitle: '1-3 business days', icon: 'bank-outline' },
    { id: '3', title: 'Money Wallet', subTitle: 'Scan QR code', icon: 'qrcode' },
  ];
  return (
    <View style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Funds</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                <TouchableOpacity key={val} style={styles.quickBtn} onPress={() => setAmount(val)}>
                  <Text style={styles.quickBtnText}>${val}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { marginTop: 30 }]}>Payment Method</Text>
            {paymentMethods.map((item) => {
              const isSelected = selectedMethod?.id === item.id;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.paymentCard, isSelected && styles.activeCard]}
                  onPress={() => setSelectedMethod(item)}
                >
                  <View style={styles.paymentLeft}>
                    <MaterialCommunityIcons name={item.icon} size={24} color={isSelected ? "#000" : "#FFF"} />
                    <View style={{ marginLeft: 15 }}>
                      <Text style={[styles.paymentTitle, isSelected && { color: '#000' }]}>{item.title}</Text>
                      <Text style={[styles.paymentSubtitle, isSelected && { color: '#333' }]}>{item.subTitle}</Text>
                    </View>
                  </View>
                  <View style={[styles.radio, isSelected && styles.activeRadio]} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.confirmBtnText}>Confirm Deposit</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconBox}>
              <MaterialCommunityIcons name="check" size={40} color="#000" />
            </View>
            <Text style={styles.modalTitle}>Deposit Initiated</Text>
            <Text style={styles.modalSub}>Your funds will be available shortly</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={() => setModalVisible(false)}>
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
  backBtn: { padding: 10, backgroundColor: '#1C1C1E', borderRadius: 12,marginTop:25 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15,marginTop:25 },
  label: { color: '#8E8E93', fontSize: 14, marginBottom: 10 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 15 },
  currency: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  amountInput: { color: '#FFF', fontSize: 24, marginLeft: 10, flex: 1 },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  quickBtn: { backgroundColor: '#1C1C1E', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  quickBtnText: { color: '#FFF', fontWeight: 'bold' },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  activeCard: { backgroundColor: '#F3E932', borderColor: '#F3E932' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  paymentTitle: { color: '#FFF', fontWeight: 'bold' },
  paymentSubtitle: { color: '#8E8E93', fontSize: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#FFF' },
  activeRadio: { backgroundColor: '#000', borderColor: '#000' },
  confirmBtn: { backgroundColor: '#F3E932', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  confirmBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { width: '85%', backgroundColor: '#1C1C1E', padding: 30, borderRadius: 20, alignItems: 'center' },
  successIconBox: { backgroundColor: '#F3E932', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { color: '#8E8E93', textAlign: 'center', marginBottom: 20 },
  continueBtn: { backgroundColor: '#F3E932', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  continueBtnText: { color: '#000', fontWeight: 'bold' },
});

export default Deposit;