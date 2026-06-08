import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
   ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
const InputField = ({ label, Placeholder, value, onChangeText }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        placeholder={Placeholder} 
        placeholderTextColor="#444" 
        value={value}
        onChangeText={onChangeText}
      />
    </View>
);
const AddressScreen = ({ navigation }: any) => {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  useEffect(() => {
    const fetchSavedData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.address) {
              setAddress1(data.address.street1 || '');
              setAddress2(data.address.street2 || '');
              setCountry(data.address.country || '');
              setState(data.address.state || '');
              setCity(data.address.city || '');
              setPostalCode(data.address.zip || '');
              setAddressType(data.address.type || '');
            }
          }
        } catch (error) {
          console.error("Data fetch error:", error);
        } finally {
          setFetching(false);
        }
      }
    };
    fetchSavedData();
  }, []);
  const handleAddress = async () => {
    if (!address1 || !country || !city) {
      Alert.alert("Required Fields", "Please fill in all the mandatory fields to proceed.");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          address: {
            street1: address1,
            street2: address2,
            country: country,
            state: state,
            city: city,
            zip: postalCode,
            type: addressType
          }
        }, { merge: true });
        setLoading(false);
        Alert.alert("Success", "Your address has been updated successfully.");
        navigation.navigate('UploadDoc');
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Database Error", error.message || "Something went wrong.");
    }
  };
  if (fetching) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#F3E932" />
        <Text style={{ color: '#FFF', textAlign: 'center', marginTop: 10 }}>Loading saved info...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add / Edit Address</Text>
        </View>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InputField label="Street Address 1" Placeholder="House #, Street name" value={address1} onChangeText={setAddress1} />
          <InputField label="Street Address 2" Placeholder="Apartment (optional)" value={address2} onChangeText={setAddress2} />
          <InputField label="Country" Placeholder="Enter Country Name" value={country} onChangeText={setCountry} />
          <InputField label="State" Placeholder="Enter State / Province" value={state} onChangeText={setState} />
          <InputField label="City" Placeholder="Enter City Name" value={city} onChangeText={setCity} />
          <InputField label="Postal Code" Placeholder="Enter Zip/Postal Code" value={postalCode} onChangeText={setPostalCode} />
          <InputField label="Address Type" Placeholder="Home / Office" value={addressType} onChangeText={setAddressType} />
          <TouchableOpacity 
            style={[styles.yellowBtn, loading && { opacity: 0.7 }]}
            onPress={handleAddress}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}> Update Address </Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20},
  backBtn: { width: 35, height: 35, backgroundColor: '#121214', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 15 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  inputContainer: { marginBottom: 15 },
  label: { color: '#FFF', fontSize: 12, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#121214', borderRadius: 10, height: 50, paddingHorizontal: 15, color: '#FFF', borderWidth: 1, borderColor: '#1C1C1E' },
  yellowBtn: { backgroundColor: '#F3E932', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});
export default AddressScreen;