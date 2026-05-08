import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const AddCardScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.mainWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Card Type</Text>
        </View>
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('CardUnlockScreen')}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="credit-card-outline" size={30} color="#4A90E2" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTypeTitle}>Virtual Card</Text>
            <Text style={styles.cardTypeSub}>
              Instant creation, perfect for online purchases and subscriptions. Use immediately after creation.
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.blueBadge}><Text style={styles.blueBadgeText}>INSTANT</Text></View>
              <View style={styles.blueBadge}><Text style={styles.blueBadgeText}>NO FEES</Text></View>
              <View style={styles.blueBadge}><Text style={styles.blueBadgeText}>ONLINE ONLY</Text></View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.optionBox} 
          onPress={() => navigation.navigate('PhysicalCardApplication')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#2C2C14' }]}>
            <MaterialCommunityIcons name="credit-card-chip-outline" size={30} color="#F3E932" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTypeTitle}>Physical Card</Text>
            <Text style={styles.cardTypeSub}>
              Premium metal card with contactless payment. Delivered to your address within 5-7 business days.
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.yellowBadge}><Text style={styles.yellowBadgeText}>5-7 DAYS</Text></View>
              <View style={styles.yellowBadge}><Text style={styles.yellowBadgeText}>$10 FEE</Text></View>
              <View style={styles.yellowBadge}><Text style={styles.yellowBadgeText}>CONTACTLESS</Text></View>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0B0B0C' },
  container: { flex: 1, padding: 20, marginTop: 25 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  backBtn: { marginRight: 15, backgroundColor: '#1C1C1E', marginTop:25,padding: 8, borderRadius: 10 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold',marginTop:25},
  optionBox: { 
    backgroundColor: '#151517', 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#232325'
  },
  iconContainer: { 
    width: 60, 
    height: 60, 
    backgroundColor: '#1A212A', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15 
  },
  textContainer: { flex: 1 },
  cardTypeTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardTypeSub: { color: '#8E8E93', fontSize: 13, lineHeight: 18, marginBottom: 15 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  blueBadge: { backgroundColor: '#1A212A', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginRight: 8, marginBottom: 5 },
  blueBadgeText: { color: '#4A90E2', fontSize: 10, fontWeight: 'bold' },
  yellowBadge: { backgroundColor: '#2C2C14', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, marginRight: 8, marginBottom: 5 },
  yellowBadgeText: { color: '#F3E932', fontSize: 10, fontWeight: 'bold' }
});

export default AddCardScreen;