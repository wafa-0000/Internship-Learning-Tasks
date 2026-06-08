import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../../firebaseConfig';
import { SIZES } from '../../../utils/constants/theme';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; 

const AddCardScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const name = data.fullName || user.email?.split('@')[0] || "User";
          setUserName(name.toUpperCase());
        }
      }
    };
    fetchUserData();
  }, []);

  const generateCardNumber = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const handleCreateVirtualCard = async () => {
    setLoading(true);
    try {
      const cardRef = await addDoc(collection(db, "cards"), {
        number: generateCardNumber(),
        balance: 0,
        status: 'active',
        holder: userName, 
        type: 'VIRTUAL',
        createdAt: new Date(),
        userId: auth.currentUser?.uid 
      });
      navigation.navigate('CardDetailsScreen', { cardId: cardRef.id });
    } catch (error) {
      Alert.alert("Error", "Could not create card. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Choose Card Type</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.cardOption} 
          onPress={handleCreateVirtualCard}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4A90E2" />
          ) : (
            <>
              <View style={[styles.iconBox, { backgroundColor: '#1e2d40' }]}>
                <MaterialCommunityIcons name="credit-card-outline" size={28} color="#4A90E2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Virtual Card</Text>
                <Text style={styles.cardDesc}>Instant creation, perfect for online purchases. Use immediately.</Text>
                <View style={styles.tagsContainer}>
                  <View style={[styles.tag, { backgroundColor: '#1e2d40' }]}><Text style={[styles.tagText, { color: '#4A90E2' }]}>INSTANT</Text></View>
                  <View style={[styles.tag, { backgroundColor: '#1e2d40' }]}><Text style={[styles.tagText, { color: '#4A90E2' }]}>NO FEES</Text></View>
                </View>
              </View>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cardOption} 
          onPress={() => navigation.navigate('PhysicalCardApplication', { userName })}
        >
          <View style={[styles.iconBox, { backgroundColor: '#332d19' }]}>
            <MaterialCommunityIcons name="credit-card-chip-outline" size={28} color="#F3E932" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Physical Card</Text>
            <Text style={styles.cardDesc}>Premium metal card with contactless payment. Delivered in 5-7 days.</Text>
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: '#332d19' }]}><Text style={[styles.tagText, { color: '#F3E932' }]}>5-7 DAYS</Text></View>
              <View style={[styles.tag, { backgroundColor: '#332d19' }]}><Text style={[styles.tagText, { color: '#F3E932' }]}>$10 FEE</Text></View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 10 },
  backBtn: { 
    padding: 10, 
    backgroundColor: '#1C1C1E', 
    borderRadius: 12, 
    marginRight: 15 
  },
  header: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: SIZES.padding },
  cardOption: { 
    backgroundColor: '#161616', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222'
  },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardDesc: { color: '#7E7E7E', fontSize: 12, marginTop: 5, lineHeight: 18 },
  tagsContainer: { flexDirection: 'row', marginTop: 12, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8, marginBottom: 5 },
  tagText: { fontSize: 9, fontWeight: '800' }
});

export default AddCardScreen;