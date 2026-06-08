import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig'; 
import { SIZES } from '../../utils/constants/theme';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; // updateDoc add kiya
const { width } = Dimensions.get('window');
const BalanceScreen = ({ navigation }: any) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        if (!data.walletId) {
          const generatedId = "AUR-" + Math.floor(100000 + Math.random() * 900000);
          try {
            await updateDoc(userRef, { walletId: generatedId });
          } catch (error) {
            console.error("Error generating wallet ID:", error);
          }
        }
      } else {
        setUserData({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, []);
  const renderBalance = () => {
    if (!isBalanceVisible) return "*******";
    const balance = userData?.totalBalance ?? 0;
    return `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#F3E932" size="large" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Money Vault</Text>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('Transactions')}>
            <MaterialCommunityIcons name="history" size={24} color="#F3E932" />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceCard}>
          <View style={styles.cardTop}>
            <View style={styles.balanceTag}>
              <View style={styles.dot} />
              <Text style={styles.tagText}>TOTAL BALANCE</Text>
            </View>
            <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              <MaterialCommunityIcons
                name={isBalanceVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{renderBalance()}</Text>
          <View style={styles.statsRow}>
            <View style={styles.profitBadge}>
              <Text style={styles.profitText}>
                { (userData?.lastProfit ?? 0) >= 0 ? '+' : '' }${(userData?.lastProfit ?? 0).toFixed(2)}
              </Text>
            </View>
            <Text style={styles.timeText}>Last 24h</Text>
          </View>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.walletLabel}>WALLET ID</Text>
              <Text style={styles.walletId}>{userData?.walletId || "Generating..."}</Text>
            </View>
            <TouchableOpacity style={styles.shieldBtn}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <ActionCard icon="send-variant" title="Send" sub="Transfer funds" color="#FF4D4D" onPress={() => navigation.navigate('Send')} />
          <ActionCard icon="call-received" title="Receive" sub="Get paid" color="#00FF85" onPress={() => navigation.navigate('Receive')} />
          <ActionCard icon="plus" title="Deposit" sub="Add funds" color="#4D94FF" onPress={() => navigation.navigate('Deposit')} />
          <ActionCard icon="credit-card-outline" title="Card Management" sub="Manage cards" color="#F3E932" onPress={() => navigation.navigate('CardList')} />
        </View>
        <TouchableOpacity style={styles.historyRow} onPress={() => navigation.navigate('Transactions')}>
          <View style={styles.historyIconBox}>
            <MaterialCommunityIcons name="history" size={24} color="#F3E932" />
          </View>
          <View style={styles.historyTextContainer}>
            <Text style={styles.historyTitle}>Transaction History</Text>
            <Text style={styles.historySub}>View all your transactions</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const ActionCard = ({ icon, title, sub, color, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </TouchableOpacity>
  );
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    scrollContent: {  padding: SIZES.padding , paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    historyBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#2C2C2E' },
    balanceCard: { backgroundColor: '#F3E932', borderRadius: 25, padding: 25, width: '100%', marginBottom: 30 },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    balanceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000', marginRight: 6 },
    tagText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#000', marginVertical: 15 },
    statsRow: { flexDirection: 'row', alignItems: 'center' },
    profitBadge: { backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    profitText: { color: '#F3E932', fontSize: 12, fontWeight: 'bold' },
    timeText: { color: 'rgba(0,0,0,0.5)', fontSize: 12, marginLeft: 8 },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
    walletLabel: { fontSize: 10, color: 'rgba(0,0,0,0.6)', fontWeight: 'bold' },
    walletId: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    shieldBtn: { backgroundColor: 'rgba(0,0,0,0.05)', padding: 10, borderRadius: 12 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { backgroundColor: '#1C1C1E', width: (width - 55) / 2, padding: 20, borderRadius: 20, marginBottom: 15 },
    iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cardSub: { color: '#8E8E93', fontSize: 12, marginTop: 4 },
    historyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 20, marginTop: 10 },
    historyIconBox: { width: 45, height: 45, backgroundColor: 'rgba(243,233,50,0.1)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    historyTextContainer: { flex: 1, marginLeft: 15 },
    historyTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    historySub: { color: '#8E8E93', fontSize: 12 }
  });
export default BalanceScreen;