import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView as RNSafeAreaView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { db, auth } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import axios from 'axios';
import { SIZES } from '../../utils/constants/theme';

const CURRENCIES = [
  { code: 'ZAR', rate: 1 },
  { code: 'USD', rate: 0.054 },
  { code: 'GBP', rate: 0.043 },
  { code: 'SAR', rate: 0.2 },
  { code: 'AED', rate: 0.2 },
  { code: 'QAR', rate: 0.2 },
  { code: 'MYR', rate: 0.25 },
  { code: 'CHF', rate: 0.049 },
];

const GoldVault = ({ navigation }: any) => {
  const screenDimensions = Dimensions.get('window');
  const screenWidth = screenDimensions.width;
  const screenHeight = screenDimensions.height;

  const isSmallScreen = screenHeight < 700;
  const isMediumScreen = screenHeight >= 700 && screenHeight < 850;
  const isTablet = screenWidth > 600;

  const [userData, setUserData] = useState<any>(null);
  const [goldData, setGoldData] = useState({ grams: 0 });
  const [livePrice, setLivePrice] = useState(68.5);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [showModal, setShowModal] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fontSizes = {
    verifiedText: isSmallScreen ? 9 : 11,
    userName: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
    label: isSmallScreen ? 10 : 11,
    amount: isSmallScreen ? 28 : isMediumScreen ? 32 : 36,
    grams: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
    value: isSmallScreen ? 20 : isMediumScreen ? 23 : 26,
    buttonText: isSmallScreen ? 13 : 14,
    sectionTitle: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
  };

  const spacing = {
    padding: isSmallScreen ? 14 : isMediumScreen ? 16 : 20,
    cardPadding: isSmallScreen ? 16 : isMediumScreen ? 20 : 25,
    gap: isSmallScreen ? 8 : 12,
    marginBottom: isSmallScreen ? 12 : isMediumScreen ? 16 : 20,
  };

  const avatarSize = isSmallScreen ? 40 : isMediumScreen ? 45 : 50;
  const chartHeight = isSmallScreen ? 140 : isMediumScreen ? 160 : 180;
  const chartWidth = screenWidth - (spacing.padding * 2 + 40);

  const fetchGoldPrice = async () => {
    setPriceLoading(true);
    try {
      const response = await axios.get(
        `https://www.goldapi.io/api/XAU/${selectedCurrency.code}`,
        {
          headers: { 'x-access-token': 'goldapi-78b121301dd5abf4decea585bb95a892-io' },
          timeout: 5000,
        }
      );
      if (response.data && response.data.price) {
        setLivePrice(response.data.price);
        setError(null);
      }
    } catch (error) {
      setError('Failed to fetch gold price');
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, [selectedCurrency]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const unsubUser = onSnapshot(doc(db, 'users', uid), (docSnap) => { if (docSnap.exists()) setUserData(docSnap.data()); });
    const unsubGold = onSnapshot(doc(db, 'gold_holdings', uid), (docSnap) => { if (docSnap.exists()) setGoldData(docSnap.data() as any); });
    return () => { unsubUser(); unsubGold(); };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGoldPrice();
    setRefreshing(false);
  };

  const calculatedValue = (goldData.grams * livePrice * selectedCurrency.rate).toFixed(2);
  const chartData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ data: [1950, 2600, 1300, 650, 1500, 1800] }] };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Back Button Header */}
      <View style={styles.navHeader}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Gold Vault</Text>
        <View style={{ width: 24 }} /> */}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.padding }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F3E932" />}
      >
        {error && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={[styles.header, { marginBottom: spacing.marginBottom }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: userData?.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData?.fullName || 'User') }}
              style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
            />
            <View style={{ marginLeft: isSmallScreen ? 8 : 12 }}>
              <Text style={[styles.verifiedText, { fontSize: fontSizes.verifiedText }]}>VERIFIED</Text>
              <Text style={[styles.userName, { fontSize: fontSizes.userName }]}>{userData?.fullName || 'User'}</Text>
            </View>
          </View>
          <View style={styles.chartBox}>
            <MaterialCommunityIcons name="chart-line" size={18} color="#F3E932" />
          </View>
        </View>

        <View style={[styles.goldCard, { padding: spacing.cardPadding, marginBottom: spacing.marginBottom }]}>
          <View style={styles.cardContent}>
            <View>
              <Text style={[styles.label, { fontSize: fontSizes.label }]}>TOTAL GOLD HOLDINGS</Text>
              <Text style={[styles.amount, { fontSize: fontSizes.amount }]}>
                {goldData.grams || 0} <Text style={[styles.grams, { fontSize: fontSizes.grams }]}>grams</Text>
              </Text>
            </View>
          </View>
          <Text style={[styles.label, { fontSize: fontSizes.label, marginBottom: 8 }]}>VALUE</Text>
          <View style={[styles.valueRow, { gap: isSmallScreen ? 6 : 10, flexWrap: 'wrap' }]}>
            <Text style={[styles.value, { fontSize: fontSizes.value }]}>{selectedCurrency.code} {calculatedValue}</Text>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowModal(true)} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{selectedCurrency.code}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.priceSection, { padding: spacing.cardPadding, marginBottom: spacing.marginBottom }]}>
          <View style={styles.priceHeader}>
            <Text style={[styles.sectionTitle, { fontSize: fontSizes.sectionTitle, marginBottom: 10 }]}>Gold Price History</Text>
          </View>
          <LineChart
            data={chartData}
            width={Math.max(chartWidth, screenWidth - spacing.padding * 2)}
            height={chartHeight}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: '#1E1E1E',
              color: (opacity = 1) => `rgba(243, 233, 50, ${opacity})`,
            }}
            bezier
            style={{ borderRadius: 10 }}
          />
        </View>

        <View style={[styles.buttonRow, { gap: spacing.gap, marginBottom: spacing.marginBottom }]}>
          <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={() => navigation.navigate('Purchase')} activeOpacity={0.8}>
            <MaterialCommunityIcons name="plus-circle" size={18} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Buy Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sellButton]} onPress={() => navigation.navigate('SellGold')} activeOpacity={0.8}>
            <MaterialCommunityIcons name="minus-circle" size={18} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.buttonText}>Sell Gold</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: fontSizes.sectionTitle, marginBottom: 10 }]}>Transaction History</Text>
        <TouchableOpacity style={styles.transactionCard} onPress={() => navigation.navigate('Transactions')} activeOpacity={0.7}>
          <View style={styles.transactionIconBox}><MaterialCommunityIcons name="format-list-bulleted" size={20} color="#F3E932" /></View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.transactionTitle}>View All Transactions</Text>
            <Text style={[styles.transactionSub, { fontSize: fontSizes.label, marginTop: 2 }]}>Complete transaction history</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { width: isTablet ? '60%' : '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><MaterialCommunityIcons name="close" size={24} color="#FFF" /></TouchableOpacity>
            </View>
            <FlatList data={CURRENCIES} keyExtractor={(item) => item.code} renderItem={({ item }) => (
              <TouchableOpacity style={styles.currencyItem} onPress={() => { setSelectedCurrency(item); setShowModal(false); }}>
                <Text style={styles.currencyItemText}>{item.code}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  navHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'space-between' },
  backButton: { padding: 5 },
  navTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 80 },
  errorBanner: { backgroundColor: 'rgba(255, 107, 107, 0.15)', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  errorText: { color: '#FF6B6B', fontSize: 12, marginLeft: 8, flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { backgroundColor: '#1C1C1E' },
  verifiedText: { color: '#8E8E93', fontWeight: '600' },
  userName: { color: '#FFFFFF', fontWeight: '600' },
  chartBox: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 44, height: 44 },
  goldCard: { backgroundColor: '#1C1C1E', borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  cardContent: { marginBottom: 16 },
  label: { color: '#8E8E93', fontWeight: '600' },
  amount: { color: '#FFFFFF', fontWeight: '700' },
  grams: { color: '#F3E932' },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { color: '#FFFFFF', fontWeight: '600' },
  dropdownBtn: { flexDirection: 'row', backgroundColor: '#2A2A2A', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#3A3A3A' },
  dropdownText: { color: '#FFFFFF', marginRight: 6, fontWeight: '600' },
  priceSection: { backgroundColor: '#1C1C1E', borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A' },
  priceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#FFFFFF', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buyButton: { backgroundColor: '#F3E932' },
  sellButton: { backgroundColor: '#F3E932' },
  buttonText: { fontWeight: '700', color: '#000000' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#2A2A2A' },
  transactionIconBox: { width: 45, height: 45, backgroundColor: '#2A2A2A', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  transactionTitle: { color: '#FFFFFF', fontWeight: '600' },
  transactionSub: { color: '#8E8E93' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#1C1C1E', borderRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  modalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  currencyItem: { paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: '#2A2A2A' },
  currencyItemText: { color: '#FFFFFF', fontSize: 15 },
});

export default GoldVault;