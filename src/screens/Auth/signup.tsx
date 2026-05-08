import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, KeyboardAvoidingView,
    Platform, Modal, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Firebase Imports
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type RootStackParamList = {
    Signin: undefined;
    Verification: { email: string; type: string };
};

const SignupScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [accountType, setAccountType] = useState<'Individual' | 'Merchant'>('Individual');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateAccountAttempt = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
            Alert.alert("Required Fields", "All fields must be filled.");
            return;
        }
        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email.");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Weak Password", "Password must be at least 8 characters.");
            return;
        }
        setShowSuccessModal(true);
    };

    const handleContinueFromModal = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                email,
                phone,
                accountType,
                uid: user.uid,
                emailVerified: false,
                createdAt: new Date().toISOString()
            });

            setShowSuccessModal(false);
            setLoading(false);

            // Navigate to Verification screen
            navigation.navigate('Verification', { email: email, type: accountType });

        } catch (error: any) {
            setLoading(false);
            Alert.alert("Error", error.message);
            setShowSuccessModal(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <Modal visible={showSuccessModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.checkIconCircle}><Text style={styles.checkMark}>✓</Text></View>
                        <Text style={styles.modalTitle}>Confirm Registration</Text>
                        <Text style={styles.modalSubtitle}>We'll send a verification link to {email}</Text>
                        <TouchableOpacity 
                            style={[styles.continueButton, loading && { opacity: 0.7 }]} 
                            onPress={handleContinueFromModal}
                            disabled={loading}
                        >
                            <Text style={styles.continueButtonText}>{loading ? "Creating..." : "Confirm & Continue"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={{ color: '#FFF', fontSize: 20 }}>←</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join the future of gold-backed finance</Text>

                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>First Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.input} placeholder="John" placeholderTextColor="#444" value={firstName} onChangeText={setFirstName} />
                                    </View>
                                </View>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Last Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.input} placeholder="Doe" placeholderTextColor="#444" value={lastName} onChangeText={setLastName} />
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.input} placeholder="email@example.com" placeholderTextColor="#444" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                            </View>

                            <Text style={styles.label}>Phone</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.input} placeholder="+1..." placeholderTextColor="#444" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                            </View>

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput style={styles.input} placeholder="Min. 8 characters" placeholderTextColor="#444" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Text style={{ color: '#F3E932' }}>{showPassword ? "Hide" : "Show"}</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Account Type</Text>
                            <View style={styles.typeContainer}>
                                <TouchableOpacity style={[styles.typeBox, accountType === 'Individual' && styles.activeTypeBox]} onPress={() => setAccountType('Individual')}>
                                    <Text style={styles.typeText}>Individual</Text>
                                    <View style={[styles.radio, accountType === 'Individual' && styles.radioActive]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.typeBox, accountType === 'Merchant' && styles.activeTypeBox]} onPress={() => setAccountType('Merchant')}>
                                    <Text style={styles.typeText}>Merchant</Text>
                                    <View style={[styles.radio, accountType === 'Merchant' && styles.radioActive]} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.signupButton} onPress={handleCreateAccountAttempt}>
                                <Text style={styles.signupButtonText}>Create Account</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
                                    <Text style={styles.linkText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ... Styles remain the same as your previous code ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    scrollContent: { paddingBottom: 40 },
    header: { marginTop: 10, paddingHorizontal: 24, marginBottom: 10 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center' },
    formContainer: { paddingHorizontal: 24 },
    title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { color: '#606063', fontSize: 13, marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfInput: { width: '48%' },
    label: { color: '#FFF', fontSize: 13, marginBottom: 8, marginTop: 14, fontWeight: '500' },
    inputWrapper: { backgroundColor: '#121214', borderRadius: 12, borderWidth: 1, borderColor: '#1C1C1E', height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
    input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
    typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    typeBox: { width: '48%', height: 52, backgroundColor: '#121214', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderWidth: 1, borderColor: '#1C1C1E' },
    activeTypeBox: { borderColor: '#F3E932' },
    typeText: { color: '#FFF', fontSize: 14 },
    radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#333' },
    radioActive: { backgroundColor: '#F3E932', borderColor: '#F3E932' },
    signupButton: { backgroundColor: '#F3E932', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
    signupButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { color: '#606063' },
    linkText: { color: '#F3E932', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#121214', borderRadius: 20, padding: 30, alignItems: 'center' },
    checkIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,255,133,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    checkMark: { color: '#00FF85', fontSize: 30, fontWeight: 'bold' },
    modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    modalSubtitle: { color: '#606063', fontSize: 14, textAlign: 'center', marginBottom: 20 },
    continueButton: { backgroundColor: '#F3E932', width: '100%', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    continueButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});

export default SignupScreen;