import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SellGold = ({ navigation }: any) => {
  const [amount, setAmount] = useState('10');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pricePerGram = 68.5;
  const numericAmount = parseFloat(amount) || 0;
  const subTotal = numericAmount * pricePerGram;
  const processingFee = subTotal * 0.10; 
  const finalAmount = subTotal - processingFee;

  const handleContinue = () => {
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    setIsModalVisible(false);
    // Yahan hum 'hero' screen par reset kar rahe hain taake user 
    // transaction ke baad wapas piche na ja sake
    navigation.reset({
      index: 0,
      routes: [{ name: 'hero' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sell Gold</Text>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.label}>CURRENT SELLING PRICE</Text>
            <Text style={styles.priceText}>ZAR {pricePerGram} /g</Text>
          </View>

          <Text style={styles.sectionLabel}>Amount to Sell (grams)</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#606063"
            />
            <View style={styles.currencyBox}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>Grams</Text>
            </View>
          </View>
          <Text style={styles.gramsText}>Estimated Value: ZAR {subTotal.toFixed(2)}</Text>

          <Text style={styles.sectionLabel}>Receive Funds To</Text>
          
          <TouchableOpacity 
            style={[styles.paymentCard, selectedMethod === 'bank' && styles.selectedCard]} 
            onPress={() => setSelectedMethod('bank')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="bank-outline" size={24} color="#FFF" />
              <View style={{marginLeft: 15}}>
                <Text style={styles.paymentTitle}>Bank Account</Text>
                <Text style={styles.paymentSub}>Transfer to your local bank</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'bank' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={24} 
              color={selectedMethod === 'bank' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentCard, selectedMethod === 'wallet' && styles.selectedCard]} 
            onPress={() => setSelectedMethod('wallet')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFF" />
              <View style={{marginLeft: 15}}>
                <Text style={styles.paymentTitle}>App Wallet</Text>
                <Text style={styles.paymentSub}>Instant credit to app balance</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'wallet' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={24} 
              color={selectedMethod === 'wallet' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Sale Summary</Text>
            <View style={styles.row}>
              <Text style={styles.rowText}>Gold to Sell</Text>
              <Text style={styles.rowText}>{numericAmount}g</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Market Price</Text>
              <Text style={styles.rowText}>ZAR {pricePerGram}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Service Fee (10%)</Text>
              <Text style={[styles.rowText, {color: '#FF453A'}]}>- ZAR {processingFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.row, {marginTop: 10, borderTopWidth: 1, borderColor: '#333', paddingTop: 10}]}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>You will receive</Text>
              <Text style={{color: '#F3E932', fontWeight: 'bold', fontSize: 18}}>
                ZAR {finalAmount > 0 ? finalAmount.toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.btnText}>Confirm & Withdraw</Text>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Withdrawal</Text>
              <Text style={styles.modalText}>Are you sure you want to sell {numericAmount}g of gold?</Text>
              <Text style={styles.modalAmount}>You will receive: ZAR {finalAmount.toFixed(2)}</Text>
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                  <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  priceCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 20 },
  label: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold' },
  priceText: { color: '#F3E932', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  sectionLabel: { color: '#8E8E93', fontSize: 12, marginBottom: 10, marginTop: 10 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 15, alignItems: 'center', paddingHorizontal: 15, height: 60 },
  input: { flex: 1, color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  currencyBox: { backgroundColor: '#333', padding: 8, borderRadius: 8 },
  gramsText: { color: '#8E8E93', fontSize: 12, marginTop: 10, marginBottom: 20 },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'transparent' },
  selectedCard: { borderColor: '#F3E932' },
  paymentTitle: { color: '#FFF', fontWeight: 'bold' },
  paymentSub: { color: '#606063', fontSize: 12 },
  summaryCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginTop: 10 },
  summaryTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  rowText: { color: '#8E8E93', fontSize: 14 },
  continueBtn: { backgroundColor: '#F3E932', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1C1E', padding: 25, borderRadius: 20, width: '100%', alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalText: { color: '#8E8E93', textAlign: 'center', marginBottom: 10 },
  modalAmount: { color: '#F3E932', fontSize: 22, fontWeight: 'bold', marginBottom: 25 },
  modalButtonRow: { flexDirection: 'row', width: '100%', gap: 10 },
  cancelBtn: { flex: 1, padding: 15, backgroundColor: '#333', borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#FFF', fontWeight: 'bold' },
  confirmBtn: { flex: 1, padding: 15, backgroundColor: '#F3E932', borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#000', fontWeight: 'bold' }
});

export default SellGold;