import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as LocalAuthentication from 'expo-local-authentication'; 
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
type RootStackParamList = {
    Signup: undefined;
    ForgotPassword: undefined;
    Home: undefined; 
    Welcome : undefined; 
};
interface SigninProps {
    onSuccess?: () => void;
}
const SigninScreen = ({ onSuccess }: SigninProps) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    useEffect(() => {
        (async () => {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            setIsBiometricAvailable(hasHardware && isEnrolled);
        })();
    }, []);
    const handleSignin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing Details", "Please enter both email and password.");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (onSuccess) onSuccess(); // Agar App.js se call hua hai toh lock kholo
        } catch (error: any) {
            setLoading(false);
            if (error.code === 'auth/invalid-credential') {
                Alert.alert("Login Failed", "Email or Password is wrong.");
            } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        }
    };
    const handleBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login with Biometrics',
            fallbackLabel: 'Use Password',
        });
        if (result.success) {
            if (onSuccess) {
                onSuccess(); 
            } else {
                Alert.alert("Success", "Authenticated successfully!");
            }
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Welcome')} 
                                style={styles.backButton}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons 
                                    name="arrow-left" 
                                    size={24} 
                                    color="#FFFFFF" 
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Enter your email" 
                                    placeholderTextColor="#444" 
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <View style={styles.passwordHeader}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Enter your password" 
                                    placeholderTextColor="#444" 
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Text style={{ color: '#F3E932' }}>{showPassword ? "Hide" : "Show"}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity 
                                style={[styles.signinButton, loading && { opacity: 0.8 }]} 
                                onPress={handleSignin}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.signinButtonText}>Sign In</Text>}
                            </TouchableOpacity>
                            {isBiometricAvailable && (
                                <View style={{ alignItems: 'center', marginTop: 25 }}>
                                    <Text style={{ color: '#606063', marginBottom: 15 }}>— Or login with —</Text>
                                    <TouchableOpacity onPress={handleBiometricAuth} style={styles.bioButton}>
                                        <MaterialCommunityIcons name="fingerprint" size={50} color="#F3E932" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={styles.linkText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 40 },
    headerTop: { 
        paddingHorizontal: 24, 
        paddingVertical: 16,
        marginBottom: 10, 
        justifyContent: 'flex-start' 
    },
    backButton: { 
        width: 48, 
        height: 48, 
        borderRadius: 16,
        backgroundColor: '#1C1C1E', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    header: { paddingHorizontal: 24, marginBottom: 30 },
    title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { color: '#606063', fontSize: 14 },
    formContainer: { paddingHorizontal: 24 },
    label: { color: '#FFF', fontSize: 13, marginBottom: 8, marginTop: 16, fontWeight: '500' },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    forgotText: { color: '#F3E932', fontSize: 12, marginBottom: 8 },
    inputWrapper: { backgroundColor: '#121214', borderRadius: 12, borderWidth: 1, borderColor: '#1C1C1E', height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
    input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
    signinButton: { backgroundColor: '#F3E932', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    signinButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#606063' },
    linkText: { color: '#F3E932', fontWeight: 'bold' },
    bioButton: { padding: 10, borderWidth: 1, borderColor: '#1C1C1E', borderRadius: 15, backgroundColor: '#121214' }
});
export default SigninScreen;