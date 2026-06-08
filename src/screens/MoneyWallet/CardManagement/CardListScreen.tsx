import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SIZES } from '../../../utils/constants/theme';
import { db, auth } from '../../../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
const CardListScreen = ({ navigation }: any) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "cards"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(fetchedCards);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const handleCardPress = (item: any) => {
    navigation.navigate('CardUnlockScreen', { cardId: item.id });
  };
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>My Cards</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddCardScreen')}>
          <MaterialCommunityIcons name="plus" size={20} color="#000" />
          <Text style={styles.addBtnText}>Add New Card</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#F3E932" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.cardsContainer}>
            {cards.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleCardPress(item)}>
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <View style={styles.badge}><Text style={styles.badgeText}>{item.type}</Text></View>
                    <View style={styles.greenDot} />
                  </View>
                  <Text style={styles.brandText}>{item.brand}</Text>
                </View>
                <View style={styles.numberSection}>
                  <Text style={styles.cardNumber}>{item.number}</Text>
                  <Text style={styles.smallLabel}>Card Number</Text>
                </View>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.smallLabel}>Card Holder</Text>
                    <Text style={styles.infoText}>{item.holder}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.smallLabel}>Balance</Text>
                    <Text style={styles.infoText}>${item.balance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.secureAccessContainer}>
              <View style={styles.lockIconBox}>
                 <MaterialCommunityIcons name="lock-outline" size={24} color="#F3E932" />
              </View>
              <View style={styles.secureTextContent}>
                <Text style={styles.secureTitle}>Secure Access</Text>
                <Text style={styles.secureSubtitle}>Your card details are protected. Enter your access key to view full information.</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
    scrollContent:{ padding: SIZES.padding },
  container: { flex: 1, paddingHorizontal: 20 }, 
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backBtn: { backgroundColor: '#1C1C1E', padding: 8, borderRadius: 10 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
  addBtn: { flexDirection: 'row', backgroundColor: '#F3E932', paddingVertical: 16, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  addBtnText: { color: '#000', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  cardsContainer: { flex: 1 },
  card: { backgroundColor: '#F3E932', padding: 20, borderRadius: 25, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF85', marginLeft: 8 },
  brandText: { fontWeight: '900', fontSize: 12, color: '#000' }, 
  numberSection: { marginBottom: 30 },
  cardNumber: { fontSize: 22, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  smallLabel: { fontSize: 10, color: 'rgba(0,0,0,0.6)', fontWeight: '600', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  infoText: { fontWeight: 'bold', color: '#000', fontSize: 16, marginTop: 2 },
  secureAccessContainer: { 
    backgroundColor: '#161616', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#222'
  },
  lockIconBox: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 15
  },
  secureTextContent: {
    flex: 1,
    marginLeft: 15
  },
  secureTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  secureSubtitle: {
    color: '#7E7E7E',
    fontSize: 11,
    lineHeight: 16
  }
});
export default CardListScreen;