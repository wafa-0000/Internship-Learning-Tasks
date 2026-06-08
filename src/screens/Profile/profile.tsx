import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  ScrollView, Image, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
type RootStackParamList = {
  Security: undefined;
  KYC: undefined;
  SignIn: undefined;
  AddressScreen: undefined;
};
const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }, (error) => {
        setLoading(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, []);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery access is needed to change profile picture.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      setUploading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
          await updateDoc(userRef, { profileImage: imageUri });
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update image.");
      } finally {
        setUploading(false);
      }
    }
  };
  const handleSignOut = () => {
  auth.signOut()
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error: any) => {
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
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={
                  userData?.profileImage 
                    ? { uri: userData.profileImage } 
                    : require('../../../assets/avatar.png') 
                }
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage} disabled={uploading}>
                 {uploading ? <ActivityIndicator size="small" color="#000" /> : <MaterialCommunityIcons name="camera" size={16} color="#000" />}
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfoText}>
              <Text style={styles.name}>{userData?.firstName ? `${userData.firstName} ${userData.lastName}` : (userData?.fullName || 'Johnathan Doe')}</Text>
              <View style={styles.verifiedRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#F3E932" />
                <Text style={styles.verifiedText}>Verified Member</Text>
              </View>
            </View>
          </View>
          <View style={styles.memberSinceContainer}>
             <Text style={styles.memberSinceLabel}>Member Since</Text>
             <Text style={styles.memberSinceValue}>January 2026</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Personal Information</Text>    
        <View style={styles.infoCard}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="email" size={20} color="#F3E932" /></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{userData?.email || auth.currentUser?.email}</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="phone" size={20} color="#F3E932" /></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{userData?.phone || '+1 (555) 123-4567'}</Text>
          </View>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.iconBox}><MaterialCommunityIcons name="map-marker" size={20} color="#F3E932" /></View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>{userData?.address?.city ? `${userData.address.city}, ${userData.address.country}` : 'New York, United States'}</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Account Settings</Text>      
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Security')}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBoxSmall}><MaterialCommunityIcons name="shield-check" size={18} color="#F3E932" /></View>
            <View>
              <Text style={styles.settingText}>Security & Privacy</Text>
              <Text style={styles.settingSubText}>Password, 2FA, biometrics</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#606063" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AddressScreen')}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBoxSmall}><MaterialCommunityIcons name="file-document" size={18} color="#F3E932" /></View>
            <View>
              <Text style={styles.settingText}>KYC</Text>
              <Text style={styles.settingSubText}>verify to see full feature</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#606063" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBoxSmall, { backgroundColor: '#2A1414' }]}><MaterialCommunityIcons name="logout" size={18} color="#FF453A" /></View>
            <View>
              <Text style={[styles.settingText, { color: '#FF453A' }]}>Sign Out</Text>
              <Text style={styles.settingSubText}>Logout from your account</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  profileCard: { backgroundColor: '#121316', padding: 20, borderRadius: 24, marginBottom: 30, borderWidth: 1, borderColor: '#1C1C1E' },
  profileHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#1C1C1E' },
  cameraIcon: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#F3E932', padding: 6, borderRadius: 10 },
  profileInfoText: { marginLeft: 20, justifyContent: 'center' },
  name: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  verifiedText: { color: '#FFF', marginLeft: 6, fontSize: 13, opacity: 0.8 },
  memberSinceContainer: { borderTopWidth: 1, borderTopColor: '#1C1C1E', paddingTop: 15, alignItems: 'center' },
  memberSinceLabel: { color: '#606063', fontSize: 11, textTransform: 'uppercase' },
  memberSinceValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  sectionHeader: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  infoCard: { backgroundColor: '#121316', padding: 16, borderRadius: 18, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
  iconBox: { backgroundColor: '#1C1C1E', padding: 12, borderRadius: 12 },
  infoTextContainer: { marginLeft: 16 },
  infoLabel: { color: '#606063', fontSize: 10, fontWeight: 'bold' },
  infoValue: { color: '#FFF', fontSize: 14, marginTop: 2 },
  settingItem: { backgroundColor: '#121316', padding: 16, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1C1C1E' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBoxSmall: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 10 },
  settingText: { color: '#FFF', marginLeft: 15, fontSize: 15, fontWeight: '600' },
  settingSubText: { color: '#606063', marginLeft: 15, fontSize: 12, marginTop: 2 },
});
export default ProfileScreen;