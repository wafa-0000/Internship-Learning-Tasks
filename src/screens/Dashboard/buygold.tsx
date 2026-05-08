import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BuyGold = ({ navigation }: any) => {
  const [amount, setAmount] = useState('10');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const pricePerGram = 68.5;
  const numericAmount = parseFloat(amount) || 0;
  const total = numericAmount * pricePerGram;
  const processingFee = total * 0.10;

  const handleContinue = () => {
    if (selectedPayment === 'card') {
      navigation.navigate('CardPayment');
    } else if (selectedPayment === 'wallet') {
      navigation.navigate('BalanceScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Buy Gold</Text>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.label}>CURRENT PRICE</Text>
            <Text style={styles.priceText}>ZAR {pricePerGram}</Text>
          </View>

          <Text style={styles.sectionLabel}>Amount</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#606063"
            />
            <View style={styles.currencyBox}>
              <Text style={{color: '#FFF'}}>ZAR</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#FFF" />
            </View>
          </View>
          <Text style={styles.gramsText}>You will get: {numericAmount}grams</Text>

          <Text style={styles.sectionLabel}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentCard, selectedPayment === 'card' && styles.selectedCard]} 
            onPress={() => setSelectedPayment('card')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#FFF" />
              <View style={{marginLeft: 15}}>
                <Text style={styles.paymentTitle}>Pay with Bank/Card</Text>
                <Text style={styles.paymentSub}>Instant payment</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedPayment === 'card' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={24} 
              color={selectedPayment === 'card' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentCard, selectedPayment === 'wallet' && styles.selectedCard]} 
            onPress={() => setSelectedPayment('wallet')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFF" />
              <View style={{marginLeft: 15}}>
                <Text style={styles.paymentTitle}>Money Wallet</Text>
                <Text style={styles.paymentSub}>Use app balance</Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedPayment === 'wallet' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={24} 
              color={selectedPayment === 'wallet' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.row}>
              <Text style={styles.rowText}>Amount</Text>
              <Text style={styles.rowText}>{numericAmount}g</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Price per gram</Text>
              <Text style={styles.rowText}>ZAR {pricePerGram}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Processing fee</Text>
              <Text style={styles.rowText}>10%</Text>
            </View>
            <View style={[styles.row, {marginTop: 10, borderTopWidth: 1, borderColor: '#333', paddingTop: 10}]}>
              <Text style={{color: '#FFF', fontWeight: 'bold'}}>Total</Text>
              <Text style={{color: '#F3E932', fontWeight: 'bold', fontSize: 18}}>
                ZAR {(total + processingFee).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.btnText}>Continue to Payment</Text>
        </TouchableOpacity>
        
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
  currencyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 8, borderRadius: 8 },
  gramsText: { color: '#F3E932', fontSize: 12, marginTop: 10, marginBottom: 20 },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'transparent' },
  selectedCard: { borderColor: '#F3E932' },
  paymentTitle: { color: '#FFF', fontWeight: 'bold' },
  paymentSub: { color: '#606063', fontSize: 12 },
  summaryCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginTop: 10 },
  summaryTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  rowText: { color: '#8E8E93', fontSize: 14 },
  continueBtn: { backgroundColor: '#F3E932', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default BuyGold;