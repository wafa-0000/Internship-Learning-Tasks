import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Modal, ScrollView } from 'react-native';

const TransactionVerify = ({ navigation, route }: any) => {
    // Params handle karna
    const { receiverName, amount } = route.params || { receiverName: 'User', amount: '0' };
    
    const [timer, setTimer] = useState(58);
    const [code, setCode] = useState(['', '', '', '']);
    const [isVerified, setIsVerified] = useState(false);

    // 1. References Array (Fix: Array ke andar refs sahi se assign karne ke liye)
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const isOtpComplete = code.every(digit => digit.length === 1);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleInputChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // 2. Auto-Focus Logic (Maqsad: Agle box pe jana)
        if (text.length !== 0 && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
        
        // 3. Auto-Submit (Maqsad: Aakhri digit par modal khulna)
        if (text !== '' && index === 3) {
            setIsVerified(true);
        }
    };

    // 4. Backspace handle karne ke liye (Maqsad: Piche wale box pe jana)
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyPress = () => {
        if (isOtpComplete) {
            setIsVerified(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    
                    {/* SUCCESS MODAL */}
                    <Modal visible={isVerified} transparent={true} animationType="fade">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.successIcon}>
                                    <Text style={{ color: '#00FF85', fontSize: 24, fontWeight: 'bold' }}>✓</Text>
                                </View>
                                <Text style={styles.modalTitle}>Transfer Successful</Text>
                                <Text style={styles.modalSubtitle}>${amount} has been sent to {receiverName}</Text>
                                <TouchableOpacity 
                                    onPress={() => {
                                        setIsVerified(false);
                                        navigation.navigate('hero'); 
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* MAIN UI */}
                    <View style={styles.card}>
                        <View style={styles.iconContainer}>
                            <Text style={{ fontSize: 30 }}>✉️</Text>
                        </View>

                        <Text style={styles.title}>Verify Transaction</Text>
                        <Text style={styles.subtitle}>Enter the 4-digit PIN to confirm transfer</Text>

                        <View style={styles.otpContainer}>
                            {code.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)} // Fix: Ref mapping
                                    style={styles.otpInput}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    onChangeText={(text) => handleInputChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    value={digit}
                                    placeholder="0"
                                    placeholderTextColor="#1C1C1E"
                                />
                            ))}
                        </View>

                        <Text style={styles.resendText}>Didn't receive the code?</Text>
                        <Text style={styles.timerText}>
                            Resend in {`00:${timer < 10 ? `0${timer}` : timer}`}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.button, 
                                !isOtpComplete && { opacity: 0.5 }
                            ]}
                            onPress={handleVerifyPress}
                            disabled={!isOtpComplete}
                        >
                            <Text style={styles.buttonText}>Confirm Transfer</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    card: { width: '90%', padding: 20, alignItems: 'center' },
    iconContainer: {
        width: 60, height: 60, backgroundColor: '#121214',
        borderRadius: 15, justifyContent: 'center', alignItems: 'center',
        marginBottom: 20, borderWidth: 1, borderColor: '#1C1C1E'
    },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#606063', marginBottom: 30, textAlign: 'center' },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', marginBottom: 30 },
    otpInput: {
        width: 55, height: 60, borderWidth: 1, borderColor: '#1C1C1E',
        borderRadius: 12, backgroundColor: '#121214', color: 'white',
        textAlign: 'center', fontSize: 20, fontWeight: 'bold'
    },
    resendText: { color: '#606063', fontSize: 14 },
    timerText: { color: 'white', fontWeight: 'bold', marginTop: 5, marginBottom: 40 },
    button: {
        width: '100%', height: 55, backgroundColor: '#F3E932', 
        borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    },
    buttonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#121214', borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#1C1C1E' },
    successIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0, 255, 133, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    modalSubtitle: { color: '#606063', fontSize: 14, textAlign: 'center', marginBottom: 30 },
    modalButton: { backgroundColor: '#F3E932', width: '100%', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    modalButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});

export default TransactionVerify;