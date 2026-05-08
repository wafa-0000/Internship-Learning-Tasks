import React, { useState } from 'react';
import { View, Text, StatusBar, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const ReceiveScreen = ({ navigation }: any) => {
  const [showName, setShowName] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Money</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <Image
            source={require('../../../assets/qrcode.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={styles.qrText}>Scan to Send Funds</Text>
          <Text style={styles.qrSubtitle}>Share this QR code with sender</Text>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Name</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{showName ? "Hassan Iniyat" : "************"}</Text>
              <TouchableOpacity onPress={() => setShowName(!showName)}>
                <MaterialCommunityIcons name={showName ? "eye" : "eye-off"} size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{showEmail ? "ptanh@gmail.com" : "***********"}</Text>
              <TouchableOpacity onPress={() => setShowEmail(!showEmail)}>
                <MaterialCommunityIcons name={showEmail ? "eye" : "eye-off"} size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{showPhone ? "+92-301-XXXXXXXX" : "***********"}</Text>
              <TouchableOpacity onPress={() => setShowPhone(!showPhone)}>
                <MaterialCommunityIcons name={showPhone ? "eye" : "eye-off"} size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
  
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0C' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { width: 40, height: 40,marginTop:25, backgroundColor: '#1C1C1E', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', marginTop:25,fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  content: { flex: 1, padding: 20 },
  
  qrContainer: { backgroundColor: '#F3F4F6', borderRadius: 30, padding: 30, alignItems: 'center', marginBottom: 20 },
  qrImage: { width: 150, height: 150, marginBottom: 20 },
  qrText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  qrSubtitle: { color: '#828285', fontSize: 12, marginTop: 5 },

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