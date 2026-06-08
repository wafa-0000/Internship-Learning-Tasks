import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { SIZES } from '../../utils/constants/theme';

const BuyGold = ({ navigation, route }: any) => {
  const { currencyCode = 'ZAR', pricePerGram = 68.5 } = route.params || {};

  const [amount, setAmount] = useState('10');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const numericAmount = parseFloat(amount) || 0;
  const total = numericAmount * pricePerGram;
  const processingFee = total * 0.10;
  const finalTotal = total + processingFee;

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const walletRef = doc(db, 'wallets', uid);
    const unsubscribe = onSnapshot(walletRef, (docSnap) => {
      if (docSnap.exists()) setWalletBalance(docSnap.data().moneyBalance || 0);
    });
    return () => unsubscribe();
  }, []);

  const handleContinue = async () => {
    if (numericAmount <= 0) { Alert.alert("Error", "Please enter a valid amount."); return; }
    setLoading(true);
    // Logic yahan handle karein
    setLoading(false);
    navigation.navigate('CardPayment');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Buy Gold</Text>
            </View>

            <View style={styles.priceCard}>
              <Text style={styles.label}>CURRENT PRICE</Text>
              <Text style={styles.priceText}>{currencyCode} {pricePerGram.toFixed(2)}</Text>
            </View>

            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholderTextColor="#606063" />
              <View style={styles.currencyBox}><Text style={{ color: '#FFF' }}>{currencyCode}</Text></View>
            </View>
            <Text style={styles.gramsText}>You will get: {numericAmount} grams</Text>

            <Text style={styles.sectionLabel}>Payment Method</Text>
            <TouchableOpacity style={[styles.paymentCard, selectedPayment === 'card' && styles.selectedCard]} onPress={() => setSelectedPayment('card')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="credit-card-outline" size={24} color="#FFF" />
                <View style={{ marginLeft: 15 }}><Text style={styles.paymentTitle}>Pay with Bank/Card</Text></View>
              </View>
              <MaterialCommunityIcons name={selectedPayment === 'card' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={24} color={selectedPayment === 'card' ? "#F3E932" : "#606063"} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.paymentCard, selectedPayment === 'wallet' && styles.selectedCard]} onPress={() => setSelectedPayment('wallet')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFF" />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.paymentTitle}>Money Wallet</Text>
                  <Text style={styles.paymentSub}>Balance: {currencyCode} {walletBalance.toFixed(2)}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name={selectedPayment === 'wallet' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={24} color={selectedPayment === 'wallet' ? "#F3E932" : "#606063"} />
            </TouchableOpacity>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.row}><Text style={styles.rowText}>Amount</Text><Text style={styles.rowText}>{numericAmount}g</Text></View>
              <View style={styles.row}><Text style={styles.rowText}>Price per gram</Text><Text style={styles.rowText}>{currencyCode} {pricePerGram.toFixed(2)}</Text></View>
              <View style={styles.row}><Text style={styles.rowText}>Processing fee</Text><Text style={styles.rowText}>10%</Text></View>
              <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, borderColor: '#333', paddingTop: 10 }]}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Total</Text>
                <Text style={{ color: '#F3E932', fontWeight: 'bold', fontSize: 18 }}>{currencyCode} {finalTotal.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                <Text style={styles.btnText}>{loading ? "Processing..." : "Continue to Payment"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { padding: SIZES.padding, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { padding: 10, backgroundColor: '#1C1C1E', borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  priceCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 2 },
  label: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold' },
  priceText: { color: '#F3E932', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  sectionLabel: { color: '#8E8E93', fontSize: 12, marginBottom: 10, marginTop: 10 },
  inputContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 15, alignItems: 'center', paddingHorizontal: 15, height: 60 },
  input: { flex: 1, color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  currencyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 8, borderRadius: 8 },
  gramsText: { color: '#F3E932', fontSize: 12, marginTop: 10, marginBottom: 2 },
  paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  selectedCard: { borderColor: '#F3E932' },
  paymentTitle: { color: '#FFF', fontWeight: 'bold' },
  paymentSub: { color: '#606063', fontSize: 12 },
  summaryCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, marginTop: 1, marginBottom: 9 },
  summaryTitle: { color: '#FFF', fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  rowText: { color: '#8E8E93', fontSize: 14 },
  buttonContainer: { padding: 10, paddingTop: 1, paddingBottom: 10 },
  continueBtn: { backgroundColor: '#F3E932', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default BuyGold;