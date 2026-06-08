import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../../firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore'; 
import { SIZES } from '../../../utils/constants/theme';
const PhysicalCardApplication = ({ navigation, route }: any) => {
  const { userName } = route.params || { userName: 'User' };
  const [limit, setLimit] = useState('');
  const [address, setAddress] = useState(''); 
  const [city, setCity] = useState('');
  const [cardState, setCardState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const generateCardNumber = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  };
  const handleCreateCard = async () => {
    if (!limit || !address || !city || !cardState || !zip || !country) {
      Alert.alert("Error", "Please fill in all the details!");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "cards"), {
        number: generateCardNumber(),
        balance: 0,
        status: 'pending',
        holder: userName,
        type: 'PHYSICAL',
        limit: `$${limit}`,
        address: `${address}, ${city}, ${cardState}, ${zip}, ${country}`,
        createdAt: new Date(),
        userId: auth.currentUser?.uid
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to apply for card. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.mainWrapper}>
          <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.title}>Physical Card Application</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Spending Limit</Text>
              <TextInput 
                style={styles.input} 
                placeholder="$5000" 
                placeholderTextColor="#444" 
                keyboardType="numeric" 
                value={limit} 
                onChangeText={setLimit} 
              />
              <Text style={styles.hint}>maximum amount you can spend per month</Text>
            </View>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="map-marker-outline" size={24} color="#F3E932" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.infoTitle}>Delivery Address Required</Text>
                <Text style={styles.infoSub}>Your physical card will be delivered to this address</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput style={styles.input} placeholder="123 Main Street, Apt 4B" placeholderTextColor="#444" value={address} onChangeText={setAddress} />
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>City</Text>
                <TextInput style={styles.input} placeholder="New York" placeholderTextColor="#444" value={city} onChangeText={setCity} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>State</Text>
                <TextInput style={styles.input} placeholder="NY" placeholderTextColor="#444" value={cardState} onChangeText={setCardState} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>ZIP Code</Text>
                <TextInput style={styles.input} placeholder="10001" placeholderTextColor="#444" keyboardType="numeric" value={zip} onChangeText={setZip} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Country</Text>
                <TextInput style={styles.input} placeholder="United States" placeholderTextColor="#444" value={country} onChangeText={setCountry} />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleCreateCard} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Create Physical Card</Text>}
            </TouchableOpacity>
            <Modal animationType="fade" transparent={true} visible={isModalVisible}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.successIcon}><MaterialCommunityIcons name="check-bold" size={40} color="#000" /></View>
                  <Text style={styles.modalTitle}>Card Created</Text>
                  <Text style={styles.modalSub}>Your physical card is on its way and will soon be delivered to your specified location</Text>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => { setIsModalVisible(false); navigation.navigate('AddCardScreen'); }}>
                    <Text style={styles.closeBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { padding: 20, paddingBottom: 40 },
  scrollContent: { padding: SIZES.padding  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  backBtn: { marginRight: 15, backgroundColor: '#1C1C1E', padding: 8, borderRadius: 10 },
  title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#8E8E93', marginBottom: 8, fontSize: 13 },
  hint: { color: '#444', fontSize: 11, marginTop: 5 },
  input: { backgroundColor: '#151517', color: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#232325' },
  infoBox: { backgroundColor: '#1C1C14', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  infoSub: { color: '#8E8E93', fontSize: 12 },
  row: { flexDirection: 'row', marginBottom: 10 },
  button: { backgroundColor: '#F3E932', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1C1C1E', padding: 30, borderRadius: 20, alignItems: 'center', width: '80%' },
  successIcon: { backgroundColor: '#F3E932', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { color: '#8E8E93', textAlign: 'center', marginBottom: 25 },
  closeBtn: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  closeBtnText: { color: '#FFF', fontWeight: 'bold' }
});
export default PhysicalCardApplication;