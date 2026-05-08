import React, { useState, useEffect } from 'react';
import {
  View, Text, Modal, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
const transactionsData = [
  { id: '1', amount: '-$89.99', date: '2026-02-03', time: '14:32', status: 'COMPLETED', icon: 'shopping-outline' },
  { id: '2', amount: '-$5.75', date: '2026-02-03', time: '09:15', status: 'COMPLETED', icon: 'refresh' },
  { id: '3', amount: '+$125.00', date: '2026-02-02', time: '16:45', status: 'COMPLETED', icon: 'arrow-bottom-left' },
  { id: '4', amount: '-$32.50', date: '2026-02-01', time: '19:20', status: 'COMPLETED', icon: 'cart-outline' },
];
const CardDetailsScreen = ({ navigation, route }: any) => {
  const isFocused = useIsFocused();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [cardStatus, setCardStatus] = useState('active');
  useEffect(() => {
    if (route.params?.updatedStatus) {
      setCardStatus(route.params.updatedStatus);
    }
  }, [isFocused, route.params?.updatedStatus]);
  const handleOptionSelect = (action: string) => {
    setIsMenuVisible(false);
    navigation.navigate('CardUnlockScreen', { action: action });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtnContainer} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>       
        <Text style={styles.headerTitle}>Virtual Card Application</Text>    
        <TouchableOpacity 
           style={styles.menuBtnContainer}
           onPress={() => setIsMenuVisible(true)}
        >
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, cardStatus === 'frozen' && styles.frozenCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.statusWrapper}>
              <View style={styles.badgeContainer}>
                <Text style={styles.virtualTag}>VIRTUAL</Text>
              </View>
              <View style={[styles.greenDot, { backgroundColor: cardStatus === 'frozen' ? '#7E7E7E' : '#05DF72' }]} />
            </View>           
            <View style={styles.cardIcons}>
              <Image source={require('../../../../assets/visa.png')} style={styles.cardIcon} />
              <Image source={require('../../../../assets/mastercard.png')} style={styles.cardIcon} />
            </View>
          </View>
          <Text style={styles.maskedNumber}>**** **** **** 9012</Text>
          <Text style={styles.realNumber}>9012</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.label}>Card Holder</Text>
              <Text style={styles.cardTextBold}>ATEEQ RAFIQ</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>Balance</Text>
              <Text style={styles.cardTextBold}>$5,420.8</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="currency-usd" size={22} color="#FCEB46" />
            <Text style={styles.statLabel}>BALANCE</Text>
            <Text style={styles.statValue}>$5,420.8</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="shopping" size={22} color="#FCEB46" />
            <Text style={styles.statLabel}>LIMIT</Text>
            <Text style={styles.statValue}>$10,000</Text>
          </View>
        </View>
        <View style={styles.transHeader}>
          <Text style={styles.sectionTitle}>Card Transactions</Text>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#FCEB46" />
        </View>
        {transactionsData.map((item) => (
          <View key={item.id} style={styles.transactionRow}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.icon} size={22} color={item.amount.includes('+') ? '#05DF72' : '#FF4D4D'} />
              </View>
              <View>
                <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.amountText, { color: item.amount.includes('+') ? '#05DF72' : '#FF4D4D' }]}>{item.amount}</Text>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal transparent={true} visible={isMenuVisible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsMenuVisible(false)}>
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsHeading}>Options</Text>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('freeze')}>
              <MaterialCommunityIcons name="cancel" size={20} color="#FFF" />
              <Text style={styles.optionText}>Freeze Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('delete')}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#FF4D4D" />
              <Text style={[styles.optionText, { color: '#FF4D4D' }]}>Delete Card</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0C0C0C', paddingHorizontal: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 25, 
    marginBottom: 20 
  },
  backBtnContainer: {
    backgroundColor: '#1A1A1A', 
    padding: 10,
    borderRadius: 12,
  },
  menuBtnContainer: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    borderRadius: 12,
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  card: { backgroundColor: '#FCEB46', padding: 20, borderRadius: 24, height: 210, justifyContent: 'space-between' },
  frozenCard: { backgroundColor: '#8E8E93' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusWrapper: { flexDirection: 'row', alignItems: 'center' }, 
  badgeContainer: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  virtualTag: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  greenDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10 }, 
  cardIcons: { flexDirection: 'row' },
  cardIcon: { width: 35, height: 22, marginLeft: 8, resizeMode: 'contain' },
  maskedNumber: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2, color: '#000', marginTop: 20 },
  realNumber: { fontSize: 14, color: '#000', opacity: 0.7 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 10, color: '#444', marginBottom: 2 },
  cardTextBold: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  statBox: { backgroundColor: '#141414', padding: 18, borderRadius: 16, width: '48%', borderWidth: 1, borderColor: '#222' },
  statLabel: { color: '#7E7E7E', fontSize: 11, marginTop: 10, fontWeight: '600' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  transHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 35, marginBottom: 15, alignItems: 'center' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  transactionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { backgroundColor: '#1A1A1A', padding: 12, borderRadius: 14, marginRight: 15 },
  dateTimeText: { color: '#7E7E7E', fontSize: 13 },
  rowRight: { alignItems: 'flex-end' },
  amountText: { fontWeight: 'bold', fontSize: 16 },
  statusText: { color: '#7E7E7E', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  optionsContainer: { backgroundColor: '#141414', width: '85%', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#222' },
  optionsHeading: { color: '#7E7E7E', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  optionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  optionText: { color: '#FFF', fontSize: 17, marginLeft: 15, fontWeight: '500' },
});

export default CardDetailsScreen;