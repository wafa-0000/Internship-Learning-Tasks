import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

export default function GoldVault({ navigation }) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../../assets/avatar.png')} style={styles.avatar} />
              <View style={{ marginLeft: 10 }}>
                 <Text style={styles.verifiedText}>VERIFIED</Text>
                 <Text style={styles.userName}>Johnathan Doe</Text>
              </View>
           </View>
           <View style={styles.chartBox}>
              <MaterialCommunityIcons name="chart-line" size={18} color="#F3E932" />
           </View>
        </View>
        <View style={styles.goldCard}>
           <Image source={require('../../../assets/coin.png')} style={styles.coinBackground} />
           
           <View style={styles.cardContent}>
              <View>
                 <Text style={styles.label}>TOTAL GOLD HOLDINGS</Text>
                 <Text style={styles.amount}>124.50 <Text style={styles.grams}>grams</Text></Text>
              </View>
              <View style={styles.percentageCircle}>
                 <View style={styles.percentageInner}>
                    <Text style={styles.percentageText}>60%</Text>
                 </View>
              </View>
           </View>

           <Text style={styles.label}>VALUE</Text>
           <View style={styles.valueRow}>
              <Text style={styles.value}>ZAR 100</Text>
              <TouchableOpacity style={styles.dropdownBtn}>
                 <Text style={styles.dropdownText}>ZAR</Text>
                 <MaterialCommunityIcons name="chevron-down" size={16} color="#FFF" />
              </TouchableOpacity>
           </View>
        </View>
        <View style={styles.priceSection}>
           <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:15, alignItems:'flex-start'}}>
              <View>
                 <Text style={{color:'#FFF', fontWeight:'bold', fontSize: 16}}>Gold Price</Text>
                 <Text style={{color:'#888', fontSize: 12}}>Per gram (USD)</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                  {['1D','1W','1M','1Y'].map(p => <Text key={p} style={{color:'#888', marginLeft:15, fontSize:12}}>{p}</Text>)}
              </View>
           </View>
           <LineChart
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{ data: [1950, 2600, 1300, 650, 0] }]
              }}
              width={screenWidth - 80}
              height={180}
              chartConfig={{
                backgroundColor: "#1E1E1E",
                backgroundGradientFrom: "#1E1E1E",
                backgroundGradientTo: "#1E1E1E",
                color: (opacity = 1) => `rgba(243, 233, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                strokeWidth: 2,
                fillShadowGradient: "#F3E932",
                fillShadowGradientOpacity: 0.3,
              }}
              bezier
              style={{ borderRadius: 10, marginTop: 15 }}
            />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.buyButton]} onPress={() => navigation.navigate('Purchase')}>
            <MaterialCommunityIcons name="shopping" size={20} color="#000" />
            <Text style={styles.buttonText}>Buy Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sellButton]} onPress={()=> navigation.navigate('SellGold')}>
            <MaterialCommunityIcons name="shopping" size={20} color="#000" />
            <Text style={styles.buttonText}>Sell Gold</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.transactionTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.transactionCard} onPress={() => navigation.navigate('Transactions')}>
           <View style={styles.transactionIconBox}>
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#F3E932" />
           </View>
           <View style={{marginLeft: 15, flex: 1}}>
              <Text style={{color:'#FFF', fontWeight:'bold'}}>View All Transactions</Text>
              <Text style={{color:'#888', fontSize: 12}}>Complete transaction history</Text>
           </View>
           <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { padding: 20, paddingTop: 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, marginTop: 25, paddingHorizontal: 5 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  verifiedText: { color: '#999', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  chartBox: { backgroundColor: '#2A2A2A', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  goldCard: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 20, marginBottom: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A2A' },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  coinBackground: { position: 'absolute', right: -20, top: -10, width: 120, height: 120, opacity: 0.1, resizeMode: 'contain' },
  percentageCircle: { width: 85, height: 85, borderRadius: 42.5, borderWidth: 3, borderColor: '#F3E932', justifyContent: 'center', alignItems: 'center', backgroundColor: '#2A2A2A' },
  percentageInner: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#8B7355', justifyContent: 'center', alignItems: 'center' },
  percentageText: { fontWeight: '700', color: '#F3E932', fontSize: 18 },
  label: { color: '#999', fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 5 },
  amount: { color: '#FFF', fontSize: 36, fontWeight: '700', marginBottom: 20 },
  grams: { fontSize: 14, color: '#F3E932' },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  value: { color: '#FFF', fontSize: 26, fontWeight: '600' },
  dropdownBtn: { flexDirection: 'row', backgroundColor: '#2A2A2A', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  dropdownText: { color: '#FFF', marginRight: 8, fontSize: 13, fontWeight: '500' },
  priceSection: { backgroundColor: '#1E1E1E', padding: 25, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#2A2A2A' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, gap: 12 },
  button: { flex: 0.48, padding: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buyButton: { backgroundColor: '#F3E932' },
  sellButton: { backgroundColor: '#F3E932' },
  buttonText: { color: '#000', fontWeight: '700', marginLeft: 10, fontSize: 14 },
  transactionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 15 },
  transactionCard: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 50, borderWidth: 1, borderColor: '#2A2A2A' },
  transactionIconBox: { width: 45, height: 45, backgroundColor: '#2A2A2A', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#333' }
});