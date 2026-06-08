import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
// Firebase Imports
import { db, auth } from '../../firebaseConfig'; 
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; // addDoc, collection import kiya

const ReceiveScreen = ({ navigation }: any) => {
  const [showName, setShowName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // --- Yahan Backend (Receive Collection) mein record create ho raha hai ---
            await addDoc(collection(db, "receive"), {
              userId: user.uid,
              name: data.fullName || "User", // Wahi name jo profile mein hai
              email: user.email,
              timestamp: new Date(),
              status: "active_session"
            });
          }
        } catch (error) {
          console.error("Error fetching or saving user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleShareQRCode = async () => {
    const currentUserId = auth.currentUser?.uid;
    const userName = userData?.fullName || "Aureus User";
    
    if (!currentUserId) return;

    try {
      await Share.share({
        message: `Hey! Send funds to ${userName} on GoldBlockApp.\nWallet Link / UID Reference:\n${currentUserId}`,
        title: 'Share Wallet QR Details',
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color="#F3E932" size="large" />
      </View>
    );
  }

  const qrValue = auth.currentUser?.uid || "No-UID-Available";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Money</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrValue} 
                size={160}
                backgroundColor="transparent"
                color="#000"
              />
            </View>
            
            <Text style={styles.qrText}>Scan to Send Funds</Text>
            <Text style={styles.qrSubtitle}>Share this QR code with sender</Text>

            <TouchableOpacity style={styles.shareBtnRow} onPress={handleShareQRCode}>
              <MaterialCommunityIcons name="share-variant" size={20} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.shareBtnText}>Share Details</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailContainer}>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Name</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {showName ? (userData?.fullName || "Not Set") : "************"}
                </Text>
                <TouchableOpacity onPress={() => setShowName(!showName)}>
                  <MaterialCommunityIcons name={showName ? "eye" : "eye-off"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {showEmail ? (userData?.email || auth.currentUser?.email) : "***********"}
                </Text>
                <TouchableOpacity onPress={() => setShowEmail(!showEmail)}>
                  <MaterialCommunityIcons name={showEmail ? "eye" : "eye-off"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>
                  {showPhone ? (userData?.phone || "Not Set") : "***********"}
                </Text>
                <TouchableOpacity onPress={() => setShowPhone(!showPhone)}>
                  <MaterialCommunityIcons name={showPhone ? "eye" : "eye-off"} size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { width: 40, height: 40, backgroundColor: '#1C1C1E', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  content: { flex: 1, padding: 20 },
  qrContainer: { backgroundColor: '#F3F4F6', borderRadius: 30, padding: 25, alignItems: 'center', marginBottom: 20 },
  qrWrapper: { padding: 15, backgroundColor: '#FFF', borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  qrText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  qrSubtitle: { color: '#828285', fontSize: 12, marginTop: 5, marginBottom: 15 },
  shareBtnRow: { flexDirection: 'row', backgroundColor: '#E5E5EA', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  shareBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },

  detailContainer: { backgroundColor: '#1C1C1E', borderRadius: 20, padding: 20 },
  detailItem: { marginBottom: 20 },
  detailLabel: { color: '#8E8E93', fontSize: 12, marginBottom: 8 },
  detailValueContainer: { 
    backgroundColor: '#0B0B0C', flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#262629' 
  },
  detailValue: { color: '#FFF', fontSize: 14 }
});

export default ReceiveScreen;