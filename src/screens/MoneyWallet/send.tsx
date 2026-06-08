import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { db, auth } from '../../firebaseConfig';
// import { SIZES } from '../../utils/constants/theme';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const { height, width } = Dimensions.get('window');

const Send = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [note, setNote] = useState('');
  const [allPhoneContacts, setAllPhoneContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    fetchUserBalance();
    syncAndMatchContacts();
  }, []);

  const fetchUserBalance = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserBalance(docSnap.data().totalBalance || 0);
      }
    }
  };

  const syncAndMatchContacts = async () => {
    setLoading(true);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data: phoneContacts } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
      });
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const registeredUsers = querySnapshot.docs.map((doc) => doc.data());

        const matchedList = phoneContacts.map((pc: any) => {
          const rawNumber = pc.phoneNumbers
            ? pc.phoneNumbers[0].number.replace(/[\s-]/g, '')
            : '';
          const appUser = registeredUsers.find((u) => u.phoneNumber === rawNumber);
          return {
            id: pc.id,
            name: pc.name,
            phoneNumber: rawNumber,
            isRegistered: !!appUser,
            walletId: appUser ? appUser.walletId : null,
            profilePic: appUser
              ? appUser.profilePic
              : pc.imageAvailable
              ? pc.image.uri
              : null,
          };
        });

        matchedList.sort(
          (a, b) =>
            (b.isRegistered ? 1 : 0) - (a.isRegistered ? 1 : 0)
        );
        setAllPhoneContacts(matchedList);
        setFilteredContacts(matchedList);
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  const handleWalletIdChange = (text: string) => {
    setWalletId(text);
    setIsDropdownVisible(text.length > 0);

    if (text.trim() === '') {
      setFilteredContacts(allPhoneContacts);
    } else {
      const filtered = allPhoneContacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(text.toLowerCase()) ||
          (contact.walletId &&
            contact.walletId.toLowerCase().includes(text.toLowerCase())) ||
          contact.phoneNumber.includes(text)
      );
      setFilteredContacts(filtered);
    }
  };

  const handleSendPress = () => {
    if (!walletId || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Enter valid recipient and amount');
      return;
    }
    navigation.navigate('TransactionVerify', { amount, receiverId: walletId });
  };

  return (
    <View style={styles.mainWrapper}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={true}
          keyboardVerticalOffset={0}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            {/* Balance Info */}
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>
                ${userBalance.toLocaleString()}
              </Text>
            </View>

            {/* Amount Input */}
            <View style={[styles.section, { marginTop: 10 }]}>
              <Text style={styles.label}>Amount to Send (ZAR)</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#444"
              />
            </View>

            {/* Recipient Input & Floating Dropdown */}
            <View style={[styles.section, { marginTop: 10, zIndex: 100 }]}>
              <Text style={styles.label}>Recipient Wallet ID or Contact</Text>
              <View style={styles.dropdownInputContainer}>
                <TextInput
                  style={styles.walletInput}
                  placeholder="Enter Wallet ID or Search Contact Name"
                  placeholderTextColor="#606063"
                  value={walletId}
                  onChangeText={handleWalletIdChange}
                  onFocus={() => setIsDropdownVisible(true)}
                />
                <TouchableOpacity
                  onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                  <MaterialCommunityIcons
                    name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#F3E932"
                  />
                </TouchableOpacity>
              </View>

              {/* Floating Dropdown with Scrollable Contacts */}
              {isDropdownVisible && (
                <View style={styles.floatingDropdown}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    style={styles.dropdownScrollView}
                  >
                    {loading ? (
                      <ActivityIndicator
                        color="#F3E932"
                        style={{ marginVertical: 10 }}
                      />
                    ) : filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <TouchableOpacity
                          key={contact.id}
                          style={styles.contactCard}
                          onPress={() => {
                            if (contact.isRegistered) {
                              setWalletId(contact.walletId);
                              setIsDropdownVisible(false);
                            } else {
                              Alert.alert(
                                'Invite',
                                `${contact.name} is not on the app.`
                              );
                            }
                          }}
                        >
                          <Image
                            source={{
                              uri:
                                contact.profilePic ||
                                'https://via.placeholder.com/150',
                            }}
                            style={styles.avatar}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.contactName}>
                              {contact.name}
                            </Text>
                            <Text style={styles.contactId}>
                              {contact.isRegistered
                                ? contact.walletId
                                : 'No Account'}
                            </Text>
                          </View>
                          {contact.isRegistered && (
                            <MaterialCommunityIcons
                              name="check-decagram"
                              size={16}
                              color="#F3E932"
                            />
                          )}
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noContactsText}>
                        No matching contacts found
                      </Text>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Note Section */}
            <View style={[styles.section, { marginTop: 20 }]}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note to this transfer"
                placeholderTextColor="#606063"
                multiline
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Extra space to prevent content hiding behind button */}
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Fixed Footer Button - Stays at bottom always */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.sendMainBtn}
            onPress={handleSendPress}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="send" size={20} color="#000" />
            <Text style={styles.sendMainBtnText}>
              Send ${amount || '0.00'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#0B0B0C',
  },
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#0B0B0C',
  },
  backBtn: {
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    // padding:SIZES.padding,
    paddingBottom: 20,
  },
  balanceInfo: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 12,
  },
  balanceValue: {
    color: '#F3E932',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
    position: 'relative',
  },
  label: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 10,
  },
  amountInput: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 10,
  },
  dropdownInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 15,
    paddingRight: 15,
  },
  walletInput: {
    color: '#fff',
    borderRadius: 15,
    padding: 15,
    height: 55,
    flex: 1,
  },
  floatingDropdown: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 999,
    elevation: 5,
    maxHeight: 250,
  },
  dropdownScrollView: {
    maxHeight: 250,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 12,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactId: {
    color: '#BBBBBB',
    fontSize: 11,
  },
  noContactsText: {
    color: '#606063',
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 14,
  },
  noteInput: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B0B0C',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#1C1C1E',
  },
  sendMainBtn: {
    backgroundColor: '#F3E932',
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendMainBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Send;