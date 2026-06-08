import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, Alert, 
    ActivityIndicator, Linking 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { sendEmailVerification } from "firebase/auth";
// import { SIZES } from '../../utils/constants/theme';
const VerificationScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const email = route.params?.email || "your email";
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    useEffect(() => {
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload(); 
                if (auth.currentUser.emailVerified) {
                    clearInterval(interval);
                    Alert.alert(
                        "Success!", 
                        "Your email has been verified. Let's complete your profile.",
                        [{ text: "Continue", onPress: () => navigation.replace('AddressScreen') }]
                    );
                }
            }
        }, 3000); 
        return () => clearInterval(interval);
    }, [navigation]);
    useEffect(() => {
        let timerInt = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timerInt);
    }, []);
    const handleResendLink = async () => {
        if (auth.currentUser) {
            try {
                setLoading(true);
                await sendEmailVerification(auth.currentUser);
                setLoading(false);
                setTimer(60);
                Alert.alert("Link Sent", "A new verification link has been sent to your email.");
            } catch (error: any) {
                setLoading(false);
                Alert.alert("Error", error.message);
            }
        }
    };
    const openGmail = () => {
        Linking.openURL('mailto:'); 
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Text style={styles.icon}>✉️</Text>
                </View>
                <Text style={styles.title}>Verify Email</Text>
                <Text style={styles.subtitle}>We have sent a verification link to:</Text>
                <Text style={styles.emailText}>{email}</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Please check your inbox and click the link to verify your account. 
                        Once verified, you will be redirected to complete your address details.
                    </Text>
                </View>
                <TouchableOpacity style={styles.gmailButton} onPress={openGmail}>
                    <Text style={styles.gmailButtonText}>Open Email App</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator color="#F3E932" style={{marginTop: 20}} />
                ) : (
                    <TouchableOpacity 
                        style={styles.resendContainer} 
                        onPress={handleResendLink} 
                        disabled={timer > 0}
                    >
                        <Text style={[styles.resendText, timer > 0 && { color: '#444' }]}>
                            {timer > 0 ? `Resend link in ${timer}s` : "Didn't get a link? Resend Now"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0C' },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1C1C1E', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    icon: { fontSize: 40 },
    title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { color: '#606063', fontSize: 15, textAlign: 'center' },
    emailText: { color: '#F3E932', fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 30 },
    infoBox: { backgroundColor: '#121214', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1C1C1E', marginBottom: 30 },
    infoText: { color: '#AAA', fontSize: 14, textAlign: 'center', lineHeight: 20 },
    gmailButton: { backgroundColor: '#F3E932', width: '100%', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    gmailButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    resendContainer: { padding: 10 },
    resendText: { color: '#F3E932', fontWeight: '500', fontSize: 14 }
});
export default VerificationScreen;