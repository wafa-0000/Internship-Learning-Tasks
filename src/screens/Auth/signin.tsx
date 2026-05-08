import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ScrollView, StatusBar, Alert, KeyboardAvoidingView,
    Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Firebase Imports
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

type RootStackParamList = {
    Signup: undefined;
    ForgotPassword: undefined;
    Home: undefined; 
};

const SigninScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing Details", "Please enter both email and password.");
            return;
        }

        setLoading(true);
      try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
} catch (error: any) {
    setLoading(false);
    console.log("Actual Firebase Error:", error.code); // Console mein check karein error kya hai

    if (error.code === 'auth/user-not-found') {
        Alert.alert("Not Found", "No account exists.Create one");
    } 
    else if (error.code === 'auth/wrong-password') {
        Alert.alert("Wrong Password", "please enter correct password");
    }
    else if (error.code === 'auth/invalid-credential') {
        Alert.alert("Login Failed", "Email or Password is wrong. please check again");
    }
    else {
        Alert.alert("Error", "There is some issue,Please try again.");
    }
}
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Header Section */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="Enter your email" 
                                    placeholderTextColor="#444" 
                                    keyboardType="email-address"
                                    autoCapitalize="none"
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

                            {/* Sign In Button */}
                            <TouchableOpacity 
                                style={[styles.signinButton, loading && { opacity: 0.8 }]} 
                                onPress={handleSignin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.signinButtonText}>Sign In</Text>
                                )}
                            </TouchableOpacity>

                            {/* Footer */}
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
    header: { paddingHorizontal: 24, marginBottom: 30 },
    title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { color: '#606063', fontSize: 14 },
    formContainer: { paddingHorizontal: 24 },
    label: { color: '#FFF', fontSize: 13, marginBottom: 8, marginTop: 16, fontWeight: '500' },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    forgotText: { color: '#F3E932', fontSize: 12, marginBottom: 8 },
    inputWrapper: { 
        backgroundColor: '#121214', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#1C1C1E', 
        height: 56, 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16 
    },
    input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
    signinButton: { 
        backgroundColor: '#F3E932', 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 32 
    },
    signinButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#606063' },
    linkText: { color: '#F3E932', fontWeight: 'bold' },
});

export default SigninScreen;