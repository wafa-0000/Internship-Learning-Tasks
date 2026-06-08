import React, { useState } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, 
    StatusBar, Alert, ActivityIndicator, KeyboardAvoidingView, 
    Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
const ForgotPasswordScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleResetPassword = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address.");
            return;
        }
        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email format.");
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        setLoading(false);
            Alert.alert(
                "Email Sent", 
                "A password reset link has been sent to your email.",
                [{ text: "OK", onPress: () => navigation.navigate('Signin') }]
            );
        } catch (error: any) {
            setLoading(false);
            let msg = "Could not send reset email.";
            if (error.code === 'auth/user-not-found') msg = "No account found with this email.";
            if (error.code === 'auth/invalid-email') msg = "The email address is not valid.";
            
            Alert.alert("Error", msg);
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
                    <View style={styles.content}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={{ color: '#FFF', fontSize: 20 }}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Enter your email address and we'll send you a link to reset your password.
                            </Text>
                        </View>
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="john@example.com" 
                                    placeholderTextColor="#444" 
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <TouchableOpacity 
                                style={[styles.resetButton, loading && { opacity: 0.8 }]} 
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.resetButtonText}>Send Reset Link</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.backToSignIn} 
                                onPress={() => navigation.navigate('Signin')}
                            >
                                <Text style={styles.backToSignInText}>Back to <Text style={{color: '#F3E932'}}>Sign In</Text></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    content: { flex: 1, paddingHorizontal: 24 },
    backButton: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: '#1C1C1E', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 20,
        marginBottom: 30 
    },
    header: { marginBottom: 32 },
    title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
    subtitle: { color: '#606063', fontSize: 15, lineHeight: 22 },
    formContainer: { width: '100%' },
    label: { color: '#FFF', fontSize: 13, marginBottom: 10, fontWeight: '500' },
    inputWrapper: { 
        backgroundColor: '#121214', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: '#1C1C1E', 
        height: 56, 
        paddingHorizontal: 16, 
        justifyContent: 'center',
        marginBottom: 24 
    },
    input: { color: '#FFFFFF', fontSize: 15 },
    resetButton: { 
        backgroundColor: '#F3E932', 
        height: 56, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10
    },
    resetButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    backToSignIn: { marginTop: 25, alignItems: 'center' },
    backToSignInText: { color: '#606063', fontSize: 14 }
});
export default ForgotPasswordScreen;