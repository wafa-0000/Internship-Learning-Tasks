import React, { useEffect } from 'react';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { SIZES } from '../../utils/constants/theme';
const { width, height } = Dimensions.get('window');

type RootStackParamList = {
    Splash: undefined;
    Onboarding1: undefined;
    Onboarding2: undefined;
    Onboarding3: undefined;
    Welcome: undefined;
};

const Onboarding3 = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const handleNavigation = (screenName: string) => {
        navigation.navigate(screenName as never);
    };

    useEffect(() => {
        try {
            hideNavigationBar?.();
        } catch (e) {
            console.log('Navigation bar hide failed:', e);
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.innerContainer}>
                <View style={styles.progressWrapper}>
                    <View style={[styles.bar, styles.activeBar]} />
                    <View style={[styles.bar, styles.activeBar]} />
                    <View style={[styles.bar, styles.activeBar]} />
                </View>
                <View style={styles.centerContent}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../../../assets/securityicon2.png')}
                            style={styles.SecurityIcon}
                            resizeMode='contain'
                        />
                    </View>
                    <Text style={styles.title}>100% Assets-Backed</Text>
                    <Text style={styles.description}>Reward is backed by physical gold,fully audited and insured</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNavigation('Welcome')}>
                        <Text style={styles.nextText}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.skipButton} onPress={() => handleNavigation('Welcome')}>
                        <Text style={styles.skipText}>Skip</Text>
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
        paddingHorizontal: 25,
        justifyContent: 'space-between',
    },
    progressWrapper: {
        flexDirection: 'row',
        marginTop: 20,
    },
    bar: {
        height: 3,
        flex: 1,
        backgroundColor: '#333',
        marginHorizontal: 5,
        borderRadius: 2,
    },
    activeBar: {
        backgroundColor: '#F3E932',
    },
    centerContent: {
        alignItems: 'center',
        marginTop: -40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#0B0B0C',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 35,
        borderWidth: 1,
        borderColor: '#101010',
    },
    SecurityIcon: {
        width: 60,
        height: 60,
        tintColor: '#F3E932',
    },
    title: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 100,
    },
    description: {
        color: '#565656',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        marginBottom: 30,
    },
    nextButton: {
        backgroundColor: '#F3E932',
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        alignItems: 'center',
    },
    skipText: {
        color: '#666',
        fontSize: 16,
    },
});

export default Onboarding3;