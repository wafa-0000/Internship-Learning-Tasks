import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { db, auth } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
// Import theme constants
import { SIZES } from '../../utils/constants/theme';

const { width } = Dimensions.get('window');

const Purchase = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('ZAR');
  const [goldData, setGoldData] = useState({ grams: 0, value: 0 });
  const [livePrice, setLivePrice] = useState(0);
  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0, 500]);

  const currencies = [
    { label: 'ZAR - South African Rand', value: 'ZAR' },
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'SAR - Saudi Riyal', value: 'SAR' },
    { label: 'AED - UAE Dirham', value: 'AED' },
    { label: 'QAR - Qatari Riyal', value: 'QAR' },
    { label: 'MYR - Malaysian Ringgit', value: 'MYR' },
    { label: 'CHF - Swiss Franc', value: 'CHF' },
  ];

  const fetchLivePrice = async (currency: string) => {
    try {
      const response = await axios.get(`https://www.goldapi.io/api/XAU/${currency}`, {
        headers: { 'x-access-token': 'goldapi-78b121301dd5abf4decea585bb95a892-io' }
      });
      setLivePrice(response.data.price);
    } catch (e) {
      console.error("API Error:", e);
    }
  };

  useEffect(() => {
    fetchLivePrice(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsubGold = onSnapshot(doc(db, "gold_holdings", uid), (doc) => {
      if (doc.exists()) setGoldData(doc.data() as any);
    });
    return () => { unsubGold(); };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Left Aligned Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buy Gold</Text>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('Transactions')}>
            <MaterialCommunityIcons name="history" size={24} color="#F3E932" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.label}>TOTAL GOLD HOLDINGS</Text>
          <Text style={styles.goldText}>{goldData.grams || 0} <Text style={styles.grams}>grams</Text></Text>
        </View>

        <View style={styles.valueSection}>
          <View>
            <Text style={styles.label}>VALUE</Text>
            <Text style={styles.valueAmount}>{selectedCurrency} {(goldData.grams * livePrice).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.customDropdown} onPress={() => setModalVisible(true)}>
            <Text style={styles.selectedTextStyle}>{selectedCurrency}</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.dropdownMenu}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {currencies.map((item) => (
                  <TouchableOpacity key={item.value} style={styles.dropdownItem} onPress={() => { setSelectedCurrency(item.value); setModalVisible(false); }}>
                    <Text style={[styles.itemText, selectedCurrency === item.value && { color: '#F3E932' }]}>{item.label}</Text>
                    {selectedCurrency === item.value && <View style={styles.activeDot} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>

        <View style={styles.priceCard}>
          <Text style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 15 }}>Gold Price History</Text>
          <LineChart
            data={{ labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], datasets: [{ data: graphData }] }}
            width={width - 80}
            height={180}
            chartConfig={{
              backgroundColor: '#1E1E1E', backgroundGradientFrom: '#1E1E1E', backgroundGradientTo: '#1E1E1E',
              color: (opacity = 1) => `rgba(243, 233, 50, ${opacity})`,
            }}
            bezier
            style={{ borderRadius: 10 }}
          />
        </View>

        <TouchableOpacity 
          style={styles.buyBtn} 
          onPress={() => navigation.navigate('BuyGold', { currencyCode: selectedCurrency, pricePerGram: livePrice })}
        >
          <MaterialCommunityIcons name="cart-outline" size={24} color="black" />
          <Text style={styles.buyBtnText}>Buy Gold</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.transactionCard} onPress={() => navigation.navigate('Transactions')}>
           <View style={styles.transactionIconBox}>
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#F3E932" />
           </View>
           <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>View All Transactions</Text>
              <Text style={styles.transactionSub}>Complete transaction history</Text>
           </View>
           <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { padding: SIZES.padding,paddingBottom: 40 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', // Items vertically centered
    marginBottom: 16 
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 15 },
  backBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12 },
  historyBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12, marginLeft: 'auto' }, // Push to right
  mainCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: SIZES.borderRadius },
  label: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold' },
  goldText: { color: '#F3E932', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  grams: { fontSize: 16, color: '#F3E932' },
  valueSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25 },
  valueAmount: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  customDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, gap: 8 },
  selectedTextStyle: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 160, paddingRight: 20 },
  dropdownMenu: { width: 220, maxHeight: 300, backgroundColor: '#1C1C1E', borderRadius: 15, padding: 5 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  itemText: { color: '#FFF', fontSize: 14 },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F3E932' },
  priceCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 25, marginTop: 15, alignItems: 'center' },
  buyBtn: { backgroundColor: '#F3E932', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 10 },
  buyBtnText: { color: 'black', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  transactionIconBox: { width: 45, height: 45, backgroundColor: '#2A2A2A', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  transactionSub: { color: '#888', fontSize: 12, marginTop: 3 },
});

export default Purchase;