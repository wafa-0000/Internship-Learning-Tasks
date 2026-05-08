import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ScrollView, TextInput, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Send = ({ navigation }: any) => {
  const [amount, setAmount] = useState('0.00');
  const [walletId, setWalletId] = useState('');
  const [receiverName, setReceiverName] = useState(''); 
  const [note, setNote] = useState(''); // Note state wapas add ki hai
  const [showContacts, setShowContacts] = useState(false);

  const quickAmounts = ['25', '50', '100', '250'];

  const contacts = [
    { id: '1', name: 'Sarah Chen', walletId: 'AUR-1121-****', image: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '2', name: 'Michael Ross', walletId: 'AUR-3814-****', image: 'https://i.pravatar.cc/150?u=mike' },
    { id: '3', name: 'Emily Taylor', walletId: 'AUR-2056-****', image: 'https://i.pravatar.cc/150?u=emily' },
  ];

  const handleSelectContact = (contact: any) => {
    setWalletId(contact.walletId);
    setReceiverName(contact.name); 
    setShowContacts(false); 
  };

  return (
    <View style={styles.mainWrapper}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          {/* Header Title with marginTop 25 */}
          <Text style={styles.headerTitle}>Send Money</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Amount Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Amount to Send</Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.currency}>ZAR</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.quickSelectRow}>
                {quickAmounts.map((val) => (
                  <TouchableOpacity key={val} style={styles.quickBtn} onPress={() => setAmount(`${val}.00`)}>
                    <Text style={styles.quickBtnText}>${val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Send To Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Send To</Text>
              <View style={[styles.walletInputBox, showContacts && styles.activeInput]}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#606063" />
                <TextInput 
                  style={styles.walletInput}
                  placeholder="Wallet ID or Username"
                  placeholderTextColor="#606063"
                  value={walletId}
                  onChangeText={(text) => {
                    setWalletId(text);
                    setReceiverName(text); 
                    if (text.length > 0) setShowContacts(true);
                  }}
                  onFocus={() => setShowContacts(true)}
                />
              </View>

              {showContacts && (
                <View style={styles.recentList}>
                  <Text style={[styles.label, {marginTop: 15}]}>Recent Contacts</Text>
                  {contacts.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.contactCard} onPress={() => handleSelectContact(item)}>
                      <Image source={{ uri: item.image }} style={styles.avatar} />
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactId}>{item.walletId}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Note Section (Re-added) */}
            <View style={styles.section}>
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

          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.sendMainBtn}
            onPress={() => navigation.navigate('TransactionVerify', { 
                amount, 
                receiverName: receiverName || walletId 
            })}
          >
            <MaterialCommunityIcons name="send" size={20} color="#000" />
            <Text style={styles.sendMainBtnText}>Send ${amount}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40 },
  backBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 12 ,marginTop:25},
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 15,
    marginTop: 25 
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 150 },
  section: { marginBottom: 20 },
  label: { color: '#8E8E93', fontSize: 12, marginBottom: 10 },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 15, padding: 15 },
  currency: { color: '#8E8E93', marginRight: 10 },
  amountInput: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1 },
  quickSelectRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  quickBtn: { backgroundColor: '#1C1C1E', padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  quickBtnText: { color: '#fff' },
  walletInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 15, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#222' },
  activeInput: { borderColor: '#F3E932' },
  walletInput: { color: '#fff', marginLeft: 10, flex: 1 },
  recentList: { backgroundColor: '#161618', padding: 10, borderRadius: 15, marginTop: 5 },
  contactCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#222' },
  avatar: { width: 35, height: 35, borderRadius: 18, marginRight: 12 },
  contactInfo: { flex: 1 },
  contactName: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  contactId: { color: '#606063', fontSize: 11 },
  noteInput: { 
    backgroundColor: '#111', 
    borderRadius: 15, 
    padding: 15, 
    color: '#fff', 
    height: 80, 
    textAlignVertical: 'top' 
  },
  footer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  sendMainBtn: { backgroundColor: '#F3E932', height: 55, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom : 30},
  sendMainBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});

export default Send;