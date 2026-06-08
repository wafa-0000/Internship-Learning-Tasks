import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image
        source={require('../../../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
export default SplashScreen;