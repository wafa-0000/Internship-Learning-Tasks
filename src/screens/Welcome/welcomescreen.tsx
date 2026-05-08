import React, { useEffect } from 'react';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
type RootStackParamList = {
    Splash: undefined;
    Onboarding1: undefined;
    Onboarding2: undefined;
    Onboarding3: undefined;
    Welcome: undefined;
    Signup: undefined;
    Signin: undefined;
};
const Welcome = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    useEffect(() => {
        try {
            hideNavigationBar();
        } catch (e) {
            console.log('Navigation bar hide failed:', e);
        }
    }, []);
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.innerContainer}>
                <View style={styles.centerContent}>
                    <View style={styles.logoConatiner}>
                        <Image
                            source={require('../../../assets/Logo.png')}
                            style={styles.logo}
                            resizeMode='contain'
                        />
                    </View>
                    <Text style={styles.title}>Welcome to GoldBlock</Text>
                    <Text style={styles.description}>Start your journey with gold-backed digital finance.</Text>
                    <Text style={styles.description}>Secure,transparent,and accessible.</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.createText}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SigninButton} onPress={() => navigation.navigate('Signin')}>
                        <Text style={styles.signinText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0C',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoConatiner: {
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    description: {
        color: '#565656',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    footer: {
        width: '100%',
        gap: 12,
    },
    createButton: {
        backgroundColor: '#F3E932',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    SigninButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1C1C1E',
        backgroundColor: 'transparent',
    },
    signinText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
export default Welcome;