import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, ScrollView, TextInput, Dimensions, Keyboard
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

const TransactionsScreen = ({ navigation }:any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');

  const allTransactions = useMemo(() => [
    { id: '1', type: 'Sent', title: 'Transfer Out', name: 'Sarah Chen', amount: '-$125.00', date: '2026-02-03', time: '14:45', status: 'COMPLETED', icon: 'send', color: '#FF4D4D', range: 'This Week' },
    { id: '2', type: 'Gold', title: 'Gold ', name: 'Aureus Market', amount: '-$850.50', date: '2026-02-02', time: '10:30', status: 'COMPLETED', icon: 'trending-up', color: '#F3E932', range: 'Yesterday' },
    { id: '3', type: 'Received', title: 'Deposit', name: 'Bank Transfer', amount: '+$1200.00', date: '2026-01-30', time: '09:15', status: 'PENDING', icon: 'tray-arrow-down', color: '#00FF85', range: 'Today' },
    { id: '4', type: 'Withdraw', title: 'Withdrawal', name: 'Bank Account', amount: '-$500.00', date: '2026-01-28', time: '16:20', status: 'COMPLETED', icon: 'download', color: '#FF9500', range: 'This Month' },
    { id: '5', type: 'Sent', title: 'Transfer Out', name: 'Michael Ross', amount: '-$75.00', date: '2026-01-27', time: '11:00', status: 'COMPLETED', icon: 'send', color: '#FF4D4D', range: 'This Month' },
    { id: '6', type: 'Received', title: 'Deposit', name: 'Card Payment', amount: '+$2500.00', date: '2026-01-25', time: '14:30', status: 'COMPLETED', icon: 'plus-circle', color: '#00FF85', range: 'Yesterday' },
    { id: '7', type: 'Gold', title: 'Gold Sale', name: 'Aureus Market', amount: '+$320.75', date: '2026-01-24', time: '13:45', status: 'COMPLETED', icon: 'trending-down', color: '#F3E932', range: 'Today' },
    { id: '8', type: 'Sent', title: 'Transfer', name: 'Netflix Premium', amount: '-$15.99', date: '2026-01-20', time: '08:00', status: 'COMPLETED', icon: 'minus', color: '#FF4D4D', range: 'This Month' },
    { id: '9', type: 'Received', title: 'Deposit', name: 'Tech Solutions Inc', amount: '+$4500.00', date: '2026-01-01', time: '09:00', status: 'COMPLETED', icon: 'bank', color: '#00FF85', range: 'All Time' },
    { id: '10', type: 'Withdraw', title: '     Gold', name: 'Standard Bank', amount: '-$200.00', date: '2025-12-28', time: '18:30', status: 'COMPLETED', icon: 'cash', color: '#FF9500', range: 'All Time' },
  ], []);

  const filteredData = useMemo(() => {
    return allTransactions.filter(item => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === '' || item.name.toLowerCase().includes(query) || item.title.toLowerCase().includes(query);
      const matchesType = selectedType === 'All' || item.type === selectedType;
      const matchesDate = selectedDateRange === 'All Time' || item.range === selectedDateRange;
      return matchesSearch && matchesType && matchesDate;
    });
  }, [searchQuery, selectedType, selectedDateRange, allTransactions]);

  const handleExportPDF = async () => {
    const htmlContent = `<h1>Transaction Report</h1><p>Type: ${selectedType}</p><p>Range: ${selectedDateRange}</p>`; 
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
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

        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}  
        >
          <View style={styles.paddingContainer}>
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
          </View>

          {showFilters && (
            <View style={styles.filterMenu}>
              <Text style={styles.filterLabel}>TRANSACTION TYPE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {['All', 'Sent', 'Received', 'Gold', 'Withdraw'].map(type => (
                  <TouchableOpacity key={type} style={[styles.chip, selectedType === type && styles.activeChip]} onPress={() => setSelectedType(type)}>
                    <Text style={[styles.chipText, selectedType === type && styles.activeChipText]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.filterLabel}>DATE RANGE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {['All Time', 'Today', 'This Week', 'This Month'].map(range => (
                  <TouchableOpacity key={range} style={[styles.chip, selectedDateRange === range && styles.activeChip]} onPress={() => setSelectedDateRange(range)}>
                    <Text style={[styles.chipText, selectedDateRange === range && styles.activeChipText]}>{range}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.paddingContainer}>
            <Text style={styles.resultsLabel}>Showing {filteredData.length} transactions</Text>
            {filteredData.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={[styles.iconBox, { backgroundColor: '#131313' }]}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={item.color} />
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.topRow}>
                    <Text style={styles.typeTitle}>{item.title}</Text>
                    <Text style={[styles.amountText, { color: item.amount.includes('+') ? '#00FF85' : '#FF4D4D' }]}>{item.amount}</Text>
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
                    <Text style={styles.txnId}>TXN-00{item.id}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start', padding: 20 },
  backBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12, marginTop: 22 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginTop: 25 },
  paddingContainer: { paddingHorizontal: 20 },
  searchContainer: { 
    flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 15, 
    paddingHorizontal: 15, alignItems: 'center', height: 52, marginBottom: 15 
  },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterBtn: { flexDirection: 'row', backgroundColor: '#1C1C1E', height: 45, borderRadius: 12, alignItems: 'center', flex: 1, justifyContent: 'center' },
  activeBtn: { backgroundColor: '#F3E932' },
  exportBtn: { flexDirection: 'row', backgroundColor: '#F3E932', height: 45, borderRadius: 12, alignItems: 'center', flex: 1, justifyContent: 'center' },
  filterText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  exportText: { color: '#000', marginLeft: 8, fontWeight: '600' },
  filterMenu: { paddingLeft: 20, marginBottom: 15 },
  filterLabel: { color: '#8E8E93', fontSize: 11, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  chipScroll: { marginBottom: 10 }, // <--- Missing Style Added
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
  txnId: { color: '#333', fontSize: 10, marginLeft: 'auto' },
});

export default TransactionsScreen;