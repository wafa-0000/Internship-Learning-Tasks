import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../../firebaseConfig';
import { SIZES } from '../../../utils/constants/theme';
import { doc, getDoc, onSnapshot, collection, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';

const CardDetailsScreen = ({ navigation, route }: any) => {
  const { cardId } = route.params;
  const [card, setCard] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userName, setUserName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [isNumberVisible, setIsNumberVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "cards", cardId);
    const unsubCard = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setCard({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    });
    const transRef = collection(db, "cards", cardId, "transactions");
    const q = query(transRef, orderBy("createdAt", "desc"));
    const unsubTrans = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubCard(); unsubTrans(); };
  }, [cardId]);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (!user) return;
      if (card?.holder) { setUserName(card.holder.toUpperCase()); return; }
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const data = userSnap.data();
        const name = data?.fullName || user.email?.split('@')[0] || "USER";
        setUserName(name.toUpperCase());
      } catch (e) { 
        setUserName(user.email?.split('@')[0].toUpperCase() || "USER"); 
      }
    };
    fetchUserName();
  }, [card]);

  const handleFreeze = async () => {
    setMenuVisible(false);
    try {
      const newStatus = card.status === 'frozen' ? 'active' : 'frozen';
      await updateDoc(doc(db, "cards", cardId), { status: newStatus });
    } catch (error) {
      Alert.alert("Error", "Could not update card status.");
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, "cards", cardId));
          navigation.goBack();
      }}
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#F3E932" style={{ flex: 1, backgroundColor: '#0B0B0C' }} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual Card Application</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.badgeRow}>
             <View style={styles.badge}><Text style={styles.badgeText}>{card?.type || 'VIRTUAL'}</Text></View>
             <View style={[styles.greenDot, { backgroundColor: card?.status === 'frozen' ? '#FF3B30' : '#00FF85' }]} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
             <Text style={styles.cardNum}>{isNumberVisible ? card?.number : `**** **** **** ${card?.number?.slice(-4)}`}</Text>
             <TouchableOpacity onPress={() => setIsNumberVisible(!isNumberVisible)}>
                <MaterialCommunityIcons name={isNumberVisible ? "eye-off" : "eye"} size={20} color="#000" />
             </TouchableOpacity>
          </View>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.footerRow}>
            <View><Text style={styles.label}>Card Holder</Text><Text style={styles.infoText}>{userName}</Text></View>
            <View style={{ alignItems: 'flex-end' }}><Text style={styles.label}>Balance</Text><Text style={styles.infoText}>${card?.balance}</Text></View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
             <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <MaterialCommunityIcons name="wallet-outline" size={16} color="#F3E932" style={{marginRight: 5}}/>
                <Text style={styles.whiteLabel}>BALANCE</Text>
             </View>
            <Text style={styles.statValue}>${card?.balance}</Text>
          </View>
          <View style={styles.statBox}>
             <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                <MaterialCommunityIcons name="shield-check-outline" size={16} color="#F3E932" style={{marginRight: 5}}/>
                <Text style={styles.whiteLabel}>LIMIT</Text>
             </View>
            <Text style={styles.statValue}>${card?.limit || '10,000'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Card Transactions</Text>
        {transactions.map((t) => (
            <View key={t.id} style={styles.transItem}>
                <MaterialCommunityIcons name={t.amount > 0 ? "arrow-down-circle-outline" : "shopping"} size={20} color="#FFF" />
                <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={{color: '#FFF'}}>{t.description || "Purchase"}</Text>
                    <Text style={{color: '#7E7E7E', fontSize: 10}}>{new Date(t.createdAt?.seconds * 1000).toLocaleDateString()}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={{color: t.amount > 0 ? '#00FF85' : '#FF3B30', fontWeight: 'bold'}}>{t.amount > 0 ? '+' : ''}${t.amount}</Text>
                    <Text style={{color: '#7E7E7E', fontSize: 10}}>COMPLETED</Text>
                </View>
            </View>
        ))}
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="fade">
         <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} />
         </TouchableWithoutFeedback>
         <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleFreeze}>
                <MaterialCommunityIcons name="cancel" size={20} color="#FFF" />
                <Text style={{color:'#FFF', marginLeft: 10}}>Freeze Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, {borderTopWidth: 0}]} onPress={handleDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF3B30" />
                <Text style={{color:'#FF3B30', marginLeft: 10}}>Delete Card</Text>
            </TouchableOpacity>
         </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 },
  backBtn: { padding: 10, backgroundColor: '#1C1C1E', borderRadius: 12 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cardContainer: { backgroundColor: '#F3E932', padding: 20, borderRadius: 25, marginBottom: 20 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  badge: { backgroundColor: 'rgba(0,0,0,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  greenDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 8 },
  cardNum: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  label: { fontSize: 10, color: 'rgba(0,0,0,0.6)', fontWeight: '600', marginTop: 4 },
  whiteLabel: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  infoText: { fontWeight: 'bold', color: '#000', fontSize: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 15, width: '48%' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  transItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 15, borderRadius: 15, marginBottom: 10 },
  menu: { position: 'absolute', top: 60, right: 20, backgroundColor: '#1A1A1A', borderRadius: 15, padding: 10, width: 150 },
  menuItem: { flexDirection: 'row', padding: 10, alignItems: 'center' }
});

export default CardDetailsScreen;