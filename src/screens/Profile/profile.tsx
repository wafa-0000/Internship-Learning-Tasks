import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Firebase Imports
import { auth, db } from '../../firebaseConfig'; 
import { doc, onSnapshot } from 'firebase/firestore';

type RootStackParamList = {
  Security: undefined;
  KYC: undefined;
  SignIn: undefined;
  AddressScreen: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  // State for Real-time User Data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Real-time listener: Jab bhi database change hoga, UI khud update hogi
      const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });

      return () => unsub(); // Cleanup listener on unmount
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        // Reset navigation stack to prevent going back to profile after logout
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' as any }],
        });
      })
      .catch((error) => {
        Alert.alert("Logout Error", error.message);
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#F3E932" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={
              userData?.profileImage 
                ? { uri: userData.profileImage } 
                : require('../../../assets/avatar.png') 
            }
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            {/* First Name aur Last Name merge karke dikhayein */}
            <Text style={styles.name}>
              {userData?.firstName ? `${userData.firstName} ${userData.lastName}` : (userData?.fullName || 'User Name')}
            </Text>
            <View style={styles.verifiedRow}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={16} 
                color={userData?.kyc_status === 'Verified' ? "#00FF85" : "#F3E932"} 
              />
              <Text style={[styles.verifiedText, userData?.kyc_status === 'Verified' && { color: '#00FF85' }]}>
                {userData?.kyc_status || 'Pending Verification'}
              </Text>
            </View>
            <Text style={styles.memberSince}>
              Account Type: {userData?.accountType || 'Individual'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Personal Information</Text>
        
        {/* Email Section */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#606063" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{userData?.email || auth.currentUser?.email}</Text>
          </View>
        </View>

        {/* Phone Section */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="phone-outline" size={20} color="#606063" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{userData?.phone || 'Not provided'}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#606063" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>
              {userData?.address?.city ? `${userData.address.city}, ${userData.address.country}` : 'Location not set'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Account Settings</Text>
        
        {/* Security Navigation */}
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('Security')}
        >
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="shield-check-outline" size={22} color="#F3E932" />
            <Text style={styles.settingText}>Security & Privacy</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#606063" />
        </TouchableOpacity>

        {/* KYC Navigation */}
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => navigation.navigate('AddressScreen')}
        >
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="file-document-outline" size={22} color="#F3E932" />
            <Text style={styles.settingText}>KYC Documents</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#606063" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={handleSignOut}
        >
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="logout" size={22} color="#FF453A" />
            <Text style={[styles.settingText, { color: '#FF453A' }]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 25 
  },
  profileCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 15 },
  name: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  verifiedText: { color: '#F3E932', marginLeft: 5, fontSize: 12 },
  memberSince: { color: '#606063', fontSize: 12, marginTop: 4 },
  sectionHeader: { color: '#606063', fontSize: 14, fontWeight: 'bold', marginBottom: 15, marginTop: 25 },
  infoCard: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  infoTextContainer: { marginLeft: 15 },
  infoLabel: { color: '#F3E932', fontSize: 10, letterSpacing: 1, fontWeight: 'bold' },
  infoValue: { color: '#FFF', fontSize: 14, marginTop: 2 },
  settingItem: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { color: '#FFF', marginLeft: 15, fontSize: 16 },
});

export default ProfileScreen;