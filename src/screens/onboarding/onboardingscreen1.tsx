import React, { useEffect } from 'react';
import { hideNavigationBar } from 'react-native-navigation-bar-color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { SIZES } from '../../utils/constants/theme';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
    Splash: undefined;
    Onboarding2: undefined;
    Onboarding3: undefined;
    Welcome: undefined;
};

const Onboarding1 = () => {
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
                    <View style={styles.bar} />
                    <View style={styles.bar} />
                </View>
                <View style={styles.centerContent}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../../../assets/lightningicon1.png')}
                            style={styles.LightningIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Transacations</Text>
                    <Text style={styles.description}>Turning Reward into Real World Assets.Earn Real Gold Every Time You Spend.
                    </Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNavigation('Onboarding2')}>
                        <Text style={styles.nextText}>Next   {'>'}</Text>
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
    LightningIcon: {
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
        backgroundColor: '#e2d811',
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

export default Onboarding1;