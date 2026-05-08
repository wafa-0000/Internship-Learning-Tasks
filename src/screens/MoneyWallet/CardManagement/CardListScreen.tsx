import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CardListScreen = ({ navigation }: any) => {
  const myCards = [
    { 
      id: '1', 
      type: 'VIRTUAL', 
      brand: 'GOLD BLOCK', 
      number: '••••  ••••  ••••  9012', 
      holder: 'ATEEQ RAFIQ', 
      balance: '$5,420.8',
      logo: require('../../../../assets/mastercard.png') 
    },
    { 
      id: '2', 
      type: 'PHYSICAL', 
      brand: 'GOLD BLOCK', 
      number: '••••  ••••  ••••  1098', 
      holder: 'ATEEQ RAFIQ', 
      balance: '$3,200.5',
      logo: require('../../../../assets/visa.png')
    },
  ];
  const handleCardPress = (item: any) => {
    if (item.type === 'VIRTUAL') {
      navigation.navigate('CardUnlockScreen', { cardId: item.id });
    } else {
      navigation.navigate('PhysicalCardApplication', { cardId: item.id });
    }
  };

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.title}>My Cards</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => navigation.navigate('AddCardScreen')}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#000" />
          <Text style={styles.addBtnText}>Add New Card</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {myCards.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => handleCardPress(item)} 
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                  </View>
                  <View style={styles.greenDot} />
                </View>
                
                <View style={styles.brandRow}>
                  <Image source={item.logo} style={styles.cardLogo} resizeMode="contain" />
                  <Text style={styles.brandText}>{item.brand}</Text>
                </View>
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
                  <Text style={styles.infoText}>{item.balance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.secureBox}>
            <View style={styles.lockIconBg}>
               <MaterialCommunityIcons name="lock-outline" size={20} color="#F3E932" />
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.secureTitle}>Secure Access</Text>
              <Text style={styles.secureSub}>
                Your card details are protected. Enter your access key to view full information.
              </Text>
            </View>
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1, padding: 20, marginTop: 25 }, 
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { marginRight: 15, backgroundColor: '#1C1C1E', padding: 8, borderRadius: 10 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  addBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#F3E932', 
    paddingVertical: 16, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  addBtnText: { color: '#000', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  card: { backgroundColor: '#F3E932', padding: 20, borderRadius: 25, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF85', marginLeft: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  cardLogo: { width: 35, height: 25, marginRight: 8 },
  brandText: { fontWeight: '900', fontSize: 12, color: '#000' }, 
  numberSection: { marginBottom: 30 },
  cardNumber: { fontSize: 22, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  smallLabel: { fontSize: 10, color: 'rgba(0,0,0,0.6)', fontWeight: '600', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  infoText: { fontWeight: 'bold', color: '#000', fontSize: 16, marginTop: 2 },
  secureBox: { backgroundColor: '#0F0F10', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
  lockIconBg: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12 },
  secureTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  secureSub: { color: '#8E8E93', fontSize: 12, marginTop: 5, lineHeight: 18 }
});

export default CardListScreen;