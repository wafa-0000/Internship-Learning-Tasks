import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BalanceScreen = ({ navigation }:any) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Money Vault</Text>
          <TouchableOpacity 
            style={styles.historyBtn} 
            onPress={() => navigation.navigate('Transactions')}
          >
            <MaterialCommunityIcons name="history" size={24} color="#F3E932" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
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

          <Text style={styles.balanceAmount}>
            {isBalanceVisible ? "$24,560.80" : "*******"}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.profitBadge}>
              <Text style={styles.profitText}>+$540.20</Text>
            </View>
            <Text style={styles.timeText}>Last 24h</Text>
          </View>

          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.walletLabel}>WALLET ID</Text>
              <Text style={styles.walletId}>AUR-7823-****</Text>
            </View>
            <TouchableOpacity style={styles.shieldBtn}>
              <MaterialCommunityIcons name="shield-check-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {/* Action Grid */}
        <View style={styles.grid}>
          <ActionCard 
            icon="send-variant" title="Send" sub="Transfer funds" color="#FF4D4D" 
            onPress={() => navigation.navigate('Send')} 
          />
          <ActionCard 
            icon="call-received" title="Receive" sub="Get paid" color="#00FF85" 
            onPress={() => navigation.navigate('Receive')} 
          />
          <ActionCard 
            icon="plus" title="Deposit" sub="Add funds" color="#4D94FF" 
            onPress={() => navigation.navigate('Deposit')} 
          />
          <ActionCard 
            icon="credit-card-outline" title="Card Management" sub="Manage cards" color="#F3E932" 
            onPress={() => navigation.navigate('CardListScreen')} 
          />
        </View>

        {/* Transaction History Row - Alignment Fixed */}
        <TouchableOpacity 
          style={styles.historyRow} 
          onPress={() => navigation.navigate('Transactions')}
        >
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

const ActionCard = ({ icon, title, sub, color, onPress }) => (
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
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,marginTop: 25, },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  historyBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#2C2C2E' },
  balanceCard: { backgroundColor: '#F3E932', borderRadius: 25, padding: 25, width: '100%', marginBottom: 30 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#000', marginRight: 6 },
  tagText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  balanceAmount: { fontSize: 36, fontWeight: 'bold', color: '#000', marginVertical: 10 }, // Adjusted
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  profitBadge: { backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  profitText: { color: '#F3E932', fontSize: 12, fontWeight: 'bold' },
  timeText: { color: 'rgba(0,0,0,0.5)', fontSize: 12, marginLeft: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25 },
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