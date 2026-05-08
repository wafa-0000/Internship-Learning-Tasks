import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  SafeAreaView, StatusBar, Dimensions, Modal 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { hideNavigationBar } from 'react-native-navigation-bar-color';

const { width } = Dimensions.get('window');
const Hero = ({ navigation }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    try {
      hideNavigationBar();
    } catch (e) {
      console.log('Navigation hide failed:', e);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <View style={styles.yellowBox}>
            <MaterialCommunityIcons name="plus" size={32} color="#FFF" />
          </View>
        </View>

        <Text style={styles.title}>Create Your Wallet</Text>
        <Text style={styles.subtitle}>
          Activate your secure wallet to start trading gold-backed assets
        </Text>

        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Start Earning Gold</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successCircle}>
              <MaterialCommunityIcons name="check" size={30} color="#F3E932" />
            </View>
            <Text style={styles.modalTitle}>Wallet Activated</Text>
            <Text style={styles.modalSubtitle}>Your Gold Block Wallet is ready to use</Text>
            
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('GoldWallet'); 
              }}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0B0C' 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40
  },
  iconBox: { 
    width: 120, 
    height: 120, 
    backgroundColor: '#0B0B0C', 
    borderColor :'#0B0B0C',
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 10,
  },
  yellowBox: { 
    width: 60, 
    height: 60, 
    backgroundColor: 'gold', 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 40 
  },
  subtitle: { 
    color: '#8E8E93', 
    textAlign: 'center', 
    marginTop: 15, 
    lineHeight: 22,
    fontSize: 16
  },
  mainButton: { 
    backgroundColor: '#F3E932', 
    width: width * 0.85, 
    height: 55, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: 230
  },
  buttonText: { 
    color: '#000', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '85%', 
    backgroundColor: '#1C1C1E', 
    borderRadius: 25, 
    padding: 30, 
    alignItems: 'center' 
  },
  successCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderColor: '#F3E932', 
    borderWidth: 1.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  modalSubtitle: { 
    color: '#8E8E93', 
    textAlign: 'center', 
    marginVertical: 15,
    fontSize: 14 
  },
  continueButton: { 
    backgroundColor: '#F3E932', 
    width: '100%', 
    height: 50, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  continueText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default Hero;