import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Alert, ActivityIndicator, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// --- FIREBASE IMPORTS ---
import { db, auth } from '../../firebaseConfig'; 
import { doc, onSnapshot, addDoc, collection, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { SIZES } from '../../utils/constants/theme';
const SellGold = ({ navigation }: any) => {
  const { width, height } = useWindowDimensions();
  
  // Responsive sizing
  const isSmallDevice = width < 375;
  const isLargeDevice = width > 450;
  const isTablet = width > 600;

  const [amount, setAmount] = useState('10');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userGold, setUserGold] = useState(0); // Real-time balance

  const pricePerGram = 68.5;
  const numericAmount = parseFloat(amount) || 0;
  const subTotal = numericAmount * pricePerGram;
  const processingFee = subTotal * 0.10; 
  const finalAmount = subTotal - processingFee;

  // Real-time Fetch: User ka apna gold balance
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "gold_holdings", uid), (doc) => {
      if (doc.exists()) {
        setUserGold(doc.data().grams || 0);
      }
    });
    return () => unsub();
  }, []);

  const handleContinue = () => {
    if (numericAmount > userGold) {
      Alert.alert("Insufficient Balance", `You only have ${userGold}g of gold available.`);
      return;
    }
    if (numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to sell.");
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not found");

      // 1. Transaction Record Save karo
      await addDoc(collection(db, 'transactions'), {
        userId: uid,
        amountGrams: numericAmount,
        type: 'SALE',
        paymentMethod: selectedMethod,
        finalReceived: finalAmount,
        createdAt: serverTimestamp(),
      });

      // 2. Gold Holding Decrease karo
      const userGoldRef = doc(db, 'gold_holdings', uid);
      await updateDoc(userGoldRef, {
        grams: increment(-numericAmount), // Negative value for decrement
        value: increment(-subTotal)
      });

      setLoading(false);
      setIsModalVisible(false);
      Alert.alert("Success", "Gold sold successfully!");
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'hero' }],
      });
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  // Get responsive styles
  const responsiveStyles = getResponsiveStyles(width, isSmallDevice, isLargeDevice, isTablet);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, responsiveStyles.scrollPadding]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={[styles.header, responsiveStyles.headerMargin]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons 
                name="arrow-left" 
                size={responsiveStyles.headerIconSize} 
                color="#FFF" 
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, responsiveStyles.headerTitleSize]}>Sell Gold</Text>
          </View>

          <View style={[styles.priceCard, responsiveStyles.cardPadding, responsiveStyles.priceCardMargin]}>
            <Text style={[styles.label, responsiveStyles.labelSize]}>AVAILABLE BALANCE</Text>
            <Text style={[styles.priceText, responsiveStyles.priceTextSize]}>
              {userGold.toFixed(3)} grams
            </Text>
          </View>

          <Text style={[styles.sectionLabel, responsiveStyles.sectionLabelSize]}>Amount to Sell (grams)</Text>
          <View style={[styles.inputContainer, responsiveStyles.inputHeight]}>
            <TextInput 
              style={[styles.input, responsiveStyles.inputFontSize]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#606063"
            />
            <View style={[styles.currencyBox, responsiveStyles.currencyBoxPadding]}>
              <Text style={[{color: '#FFF', fontWeight: 'bold'}, responsiveStyles.currencyFontSize]}>
                Grams
              </Text>
            </View>
          </View>
          <Text style={[styles.gramsText, responsiveStyles.gramsTextSize]}>
            Estimated Value: ZAR {subTotal.toFixed(2)}
          </Text>

          <Text style={[styles.sectionLabel, responsiveStyles.sectionLabelSize, { marginTop: 15 }]}>
            Receive Funds To
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentCard, 
              responsiveStyles.paymentCardPadding,
              selectedMethod === 'bank' && styles.selectedCard
            ]} 
            onPress={() => setSelectedMethod('bank')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <MaterialCommunityIcons 
                name="bank-outline" 
                size={responsiveStyles.paymentIconSize} 
                color="#FFF" 
              />
              <View style={{marginLeft: responsiveStyles.paymentMarginLeft}}>
                <Text style={[styles.paymentTitle, responsiveStyles.paymentTitleSize]}>
                  Bank Account
                </Text>
                <Text style={[styles.paymentSub, responsiveStyles.paymentSubSize]}>
                  Transfer to your local bank
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'bank' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={responsiveStyles.checkboxSize} 
              color={selectedMethod === 'bank' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.paymentCard, 
              responsiveStyles.paymentCardPadding,
              selectedMethod === 'wallet' && styles.selectedCard
            ]} 
            onPress={() => setSelectedMethod('wallet')}
            activeOpacity={0.7}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <MaterialCommunityIcons 
                name="wallet-outline" 
                size={responsiveStyles.paymentIconSize} 
                color="#FFF" 
              />
              <View style={{marginLeft: responsiveStyles.paymentMarginLeft}}>
                <Text style={[styles.paymentTitle, responsiveStyles.paymentTitleSize]}>
                  App Wallet
                </Text>
                <Text style={[styles.paymentSub, responsiveStyles.paymentSubSize]}>
                  Instant credit to app balance
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons 
              name={selectedMethod === 'wallet' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
              size={responsiveStyles.checkboxSize} 
              color={selectedMethod === 'wallet' ? "#F3E932" : "#606063"} 
            />
          </TouchableOpacity>

          <View style={[styles.summaryCard, responsiveStyles.cardPadding]}>
            <Text style={[styles.summaryTitle, responsiveStyles.summaryTitleSize]}>Sale Summary</Text>
            <View style={[styles.row, responsiveStyles.rowMargin]}>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize]}>Gold to Sell</Text>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize]}>{numericAmount}g</Text>
            </View>
            <View style={[styles.row, responsiveStyles.rowMargin]}>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize]}>Market Price</Text>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize]}>ZAR {pricePerGram}</Text>
            </View>
            <View style={[styles.row, responsiveStyles.rowMargin]}>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize]}>Service Fee (10%)</Text>
              <Text style={[styles.rowText, responsiveStyles.rowTextSize, {color: '#FF453A'}]}>
                - ZAR {processingFee.toFixed(2)}
              </Text>
            </View>
            <View style={[
              styles.row, 
              {
                marginTop: responsiveStyles.dividerMarginTop, 
                borderTopWidth: 1, 
                borderColor: '#333', 
                paddingTop: responsiveStyles.dividerPaddingTop
              }
            ]}>
              <Text style={[styles.totalLabel, responsiveStyles.totalLabelSize]}>You will receive</Text>
              <Text style={[styles.totalAmount, responsiveStyles.totalAmountSize]}>
                ZAR {finalAmount > 0 ? finalAmount.toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>

          {/* Button scrolls with content */}
          <TouchableOpacity 
            style={[styles.continueBtn, responsiveStyles.buttonPadding, responsiveStyles.buttonMargin]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, responsiveStyles.btnTextSize]}>Confirm & Withdraw</Text>
          </TouchableOpacity>

          {/* Extra spacing at bottom */}
          <View style={{ height: responsiveStyles.bottomSpacing }} />
        </ScrollView>

        {/* Loading Modal */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, responsiveStyles.modalPadding]}>
              {loading ? (
                <ActivityIndicator size="large" color="#F3E932" />
              ) : (
                <>
                  <Text style={[styles.modalTitle, responsiveStyles.modalTitleSize]}>
                    Confirm Withdrawal
                  </Text>
                  <Text style={[styles.modalText, responsiveStyles.modalTextSize]}>
                    Are you sure you want to sell {numericAmount}g of gold?
                  </Text>
                  <Text style={[styles.modalAmount, responsiveStyles.modalAmountSize]}>
                    You will receive: ZAR {finalAmount.toFixed(2)}
                  </Text>
                  <View style={[styles.modalButtonRow, responsiveStyles.modalButtonRowGap]}>
                    <TouchableOpacity 
                      style={[styles.cancelBtn, responsiveStyles.modalButtonPadding]} 
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Text style={[styles.cancelBtnText, responsiveStyles.modalBtnTextSize]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.confirmBtn, responsiveStyles.modalButtonPadding]} 
                      onPress={handleConfirm}
                    >
                      <Text style={[styles.confirmBtnText, responsiveStyles.modalBtnTextSize]}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Function to calculate responsive styles based on screen width
function getResponsiveStyles(width: number, isSmall: boolean, isLarge: boolean, isTablet: boolean) {
  const basePadding = isSmall ? 12 : isLarge ? 24 : 20;
  const cardPadding = isSmall ? 14 : isLarge ? 24 : 20;

  return {
    scrollPadding: {
      padding: basePadding,
      paddingTop: isSmall ? 15 : 20,
    },
    headerMargin: {
      marginBottom: isSmall ? 15 : 20,
    },
    headerIconSize: isSmall ? 20 : 24,
    headerTitleSize: {
      fontSize: isSmall ? 16 : isLarge ? 20 : 18,
    },
    cardPadding: {
      padding: cardPadding,
    },
    priceCardMargin: {
      marginBottom: isSmall ? 15 : 20,
    },
    labelSize: {
      fontSize: isSmall ? 9 : isLarge ? 12 : 11,
    },
    priceTextSize: {
      fontSize: isSmall ? 20 : isLarge ? 28 : 24,
      marginTop: isSmall ? 3 : 5,
    },
    sectionLabelSize: {
      fontSize: isSmall ? 11 : isLarge ? 13 : 12,
      marginBottom: isSmall ? 8 : 10,
      marginTop: isSmall ? 8 : 10,
    },
    inputHeight: {
      height: isSmall ? 50 : isTablet ? 70 : 60,
    },
    inputFontSize: {
      fontSize: isSmall ? 16 : isLarge ? 22 : 20,
    },
    currencyBoxPadding: {
      padding: isSmall ? 6 : 8,
    },
    currencyFontSize: {
      fontSize: isSmall ? 11 : isLarge ? 14 : 12,
    },
    gramsTextSize: {
      fontSize: isSmall ? 11 : 12,
      marginTop: isSmall ? 8 : 10,
      marginBottom: isSmall ? 15 : 20,
    },
    paymentCardPadding: {
      padding: cardPadding,
      marginBottom: isSmall ? 10 : 15,
    },
    paymentIconSize: isSmall ? 20 : 24,
    paymentMarginLeft: isSmall ? 12 : 15,
    paymentTitleSize: {
      fontSize: isSmall ? 13 : isLarge ? 16 : 14,
    },
    paymentSubSize: {
      fontSize: isSmall ? 10 : 12,
    },
    checkboxSize: isSmall ? 20 : 24,
    rowMargin: {
      marginVertical: isSmall ? 3 : 4,
    },
    rowTextSize: {
      fontSize: isSmall ? 12 : isLarge ? 15 : 14,
    },
    summaryTitleSize: {
      fontSize: isSmall ? 13 : isLarge ? 16 : 14,
      marginBottom: isSmall ? 8 : 10,
    },
    dividerMarginTop: isSmall ? 8 : 10,
    dividerPaddingTop: isSmall ? 8 : 10,
    totalLabelSize: {
      fontSize: isSmall ? 13 : isLarge ? 15 : 14,
    },
    totalAmountSize: {
      fontSize: isSmall ? 16 : isLarge ? 22 : 18,
    },
    buttonPadding: {
      padding: isSmall ? 14 : isLarge ? 20 : 18,
    },
    buttonMargin: {
      marginTop: isSmall ? 15 : 20,
      marginHorizontal: 0,
    },
    btnTextSize: {
      fontSize: isSmall ? 14 : isLarge ? 17 : 16,
    },
    bottomSpacing: isSmall ? 10 : 20,
    // Modal styles
    modalPadding: {
      padding: isSmall ? 20 : 25,
    },
    modalTitleSize: {
      fontSize: isSmall ? 18 : isLarge ? 22 : 20,
      marginBottom: isSmall ? 12 : 15,
    },
    modalTextSize: {
      fontSize: isSmall ? 12 : 14,
      marginBottom: isSmall ? 8 : 10,
    },
    modalAmountSize: {
      fontSize: isSmall ? 18 : isLarge ? 24 : 22,
      marginBottom: isSmall ? 20 : 25,
    },
    modalButtonRowGap: {
      gap: isSmall ? 8 : 10,
    },
    modalButtonPadding: {
      padding: isSmall ? 12 : 15,
    },
    modalBtnTextSize: {
      fontSize: isSmall ? 13 : isLarge ? 15 : 14,
    },
  };
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0B0C' 
  },
  scrollContent: { 
    paddingBottom: 60,
     padding: SIZES.padding 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerTitle: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    marginLeft: 15 
  },
  priceCard: { 
    backgroundColor: '#1C1C1E', 
    borderRadius: 15 
  },
  label: { 
    color: '#8E8E93', 
    fontWeight: 'bold' 
  },
  priceText: { 
    color: '#F3E932', 
    fontWeight: 'bold' 
  },
  sectionLabel: { 
    color: '#8E8E93' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#1C1C1E', 
    borderRadius: 15, 
    alignItems: 'center', 
    paddingHorizontal: 15 
  },
  input: { 
    flex: 1, 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  currencyBox: { 
    backgroundColor: '#333', 
    borderRadius: 8 
  },
  gramsText: { 
    color: '#8E8E93' 
  },
  paymentCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#1C1C1E', 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: 'transparent' 
  },
  selectedCard: { 
    borderColor: '#F3E932' 
  },
  paymentTitle: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  paymentSub: { 
    color: '#606063',
    marginTop: 2
  },
  summaryCard: { 
    backgroundColor: '#1C1C1E', 
    borderRadius: 15, 
    marginTop: 15 
  },
  summaryTitle: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  rowText: { 
    color: '#8E8E93' 
  },
  totalLabel: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  totalAmount: { 
    color: '#F3E932', 
    fontWeight: 'bold' 
  },
  continueBtn: { 
    backgroundColor: '#F3E932', 
    borderRadius: 15, 
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0
  },
  btnText: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#1C1C1E', 
    borderRadius: 20, 
    width: '100%', 
    alignItems: 'center' 
  },
  modalTitle: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  modalText: { 
    color: '#8E8E93', 
    textAlign: 'center' 
  },
  modalAmount: { 
    color: '#F3E932', 
    fontWeight: 'bold' 
  },
  modalButtonRow: { 
    flexDirection: 'row', 
    width: '100%' 
  },
  cancelBtn: { 
    flex: 1, 
    backgroundColor: '#333', 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  confirmBtn: { 
    flex: 1,
    backgroundColor: '#F3E932', 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmBtnText: { 
    color: '#000', 
    fontWeight: 'bold' 
  }
});

export default SellGold;