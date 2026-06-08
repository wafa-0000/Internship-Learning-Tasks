import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, Text, StyleSheet, 
  TouchableOpacity, FlatList, TextInput, Dimensions, Keyboard, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db, auth } from '../../firebaseConfig';
import { SIZES } from '../../utils/constants/theme';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const TransactionsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time Data Fetching
  useEffect(() => {
    if (!auth.currentUser) return;

    // NOTE: This specific query requires a Firestore Composite Index.
    // If you haven't created it yet, click the link in your console error!
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(fetchedTransactions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getTransactionStyle = (type: string) => {
    switch(type) {
      case 'Sent': return { icon: 'send', color: '#FF4D4D' };
      case 'Gold': return { icon: 'trending-up', color: '#F3E932' };
      case 'Received': return { icon: 'tray-arrow-down', color: '#00FF85' };
      case 'Withdraw': return { icon: 'download', color: '#FF9500' };
      default: return { icon: 'bank', color: '#FFF' };
    }
  };

  const filteredData = useMemo(() => {
    return transactions.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || (item.name?.toLowerCase().includes(query) || item.title?.toLowerCase().includes(query));
      const matchesType = selectedType === 'All' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType, transactions]);

  const handleExportPDF = async () => {
    const htmlContent = `<h1>Transaction Report</h1><p>Type: ${selectedType}</p>`; 
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const style = getTransactionStyle(item.type);
    
    // Formatting: Assuming item.amount is a number. If it's a string, this handles it.
    const amountVal = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount);
    
    return (
      <View style={styles.transactionCard}>
        <View style={[styles.iconBox, { backgroundColor: '#131313' }]}>
          <MaterialCommunityIcons name={style.icon as any} size={22} color={style.color} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.topRow}>
            <Text style={styles.typeTitle}>{item.title}</Text>
            <Text style={[styles.amountText, { color: amountVal >= 0 ? '#00FF85' : '#FF4D4D' }]}>
               {amountVal >= 0 ? '+' : ''}{item.amount}
            </Text>
          </View>
          <View style={styles.midRow}>
            <Text style={styles.nameText}>{item.name}</Text>
            <View style={styles.statusBadge}>
               <View style={[styles.statusDot, { backgroundColor: item.status === 'PENDING' ? '#FF9500' : '#00FF85' }]} />
               <Text style={[styles.statusText, { color: item.status === 'PENDING' ? '#FF9500' : '#00FF85' }]}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.bottomRowInfo}>
            <MaterialCommunityIcons name="clock-outline" size={12} color="#606063" />
            <Text style={styles.dateText}>{item.date} • {item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Transactions</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#F3E932" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View>
                <View style={styles.searchContainer}>
                  <MaterialCommunityIcons name="magnify" size={22} color="#606063" />
                  <TextInput 
                    placeholder="Search transactions..." 
                    placeholderTextColor="#606063" 
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.filterBtn, showFilters && styles.activeBtn]} onPress={() => { setShowFilters(!showFilters); Keyboard.dismiss(); }}>
                    <MaterialCommunityIcons name="filter-variant" size={20} color={showFilters ? "#000" : "#fff"} />
                    <Text style={[styles.filterText, showFilters && { color: '#000' }]}>Filters</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF}>
                    <MaterialCommunityIcons name="file-pdf-box" size={20} color="#000" />
                    <Text style={styles.exportText}>Export PDF</Text>
                  </TouchableOpacity>
                </View>

                {showFilters && (
                  <View style={styles.filterMenu}>
                    <Text style={styles.filterLabel}>TRANSACTION TYPE</Text>
                    <FlatList 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      data={['All', 'Sent', 'Received', 'Gold', 'Withdraw']}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={[styles.chip, selectedType === item && styles.activeChip]} 
                          onPress={() => setSelectedType(item)}
                        >
                          <Text style={[styles.chipText, selectedType === item && styles.activeChipText]}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
                <Text style={styles.resultsLabel}>Showing {filteredData.length} transactions</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start', padding: 20 },
  scrollContent: {  padding: SIZES.padding  },
  backBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginTop: 10 },
  paddingContainer: { paddingHorizontal: 20 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 15, paddingHorizontal: 15, alignItems: 'center', height: 52, marginBottom: 15 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterBtn: { flexDirection: 'row', backgroundColor: '#1C1C1E', height: 45, borderRadius: 12, alignItems: 'center', flex: 1, justifyContent: 'center' },
  activeBtn: { backgroundColor: '#F3E932' },
  exportBtn: { flexDirection: 'row', backgroundColor: '#F3E932', height: 45, borderRadius: 12, alignItems: 'center', flex: 1, justifyContent: 'center' },
  filterText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  exportText: { color: '#000', marginLeft: 8, fontWeight: '600' },
  filterMenu: { marginBottom: 15 },
  filterLabel: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#1C1C1E', marginRight: 8 },
  activeChip: { backgroundColor: '#F3E932' },
  chipText: { color: '#8E8E93', fontSize: 12 },
  activeChipText: { color: '#000', fontWeight: 'bold' },
  resultsLabel: { color: '#8E8E93', fontSize: 13, marginBottom: 15 },
  transactionCard: { flexDirection: 'row', backgroundColor: '#111111', padding: 16, borderRadius: 15, marginBottom: 12, borderWidth: 0.5, borderColor: '#222' },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderColor: '#333' },
  detailsContainer: { flex: 1, marginLeft: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  typeTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  amountText: { fontSize: 16, fontWeight: 'bold' },
  midRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' },
  nameText: { color: '#8E8E93', fontSize: 13 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  bottomRowInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  dateText: { color: '#606063', fontSize: 11, marginLeft: 5 },
});

export default TransactionsScreen;