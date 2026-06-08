import React, { useEffect, useState } from 'react'; 
import { View, StyleSheet, ActivityIndicator } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Firebase Imports
import { AuthContextProvider } from './src/Context/Authcontext';
import { auth, db } from './src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 

// Screens Import
import SplashScreen from './src/screens/Splash/splashscreen';
import Onboarding1 from './src/screens/onboarding/onboardingscreen1';
import Onboarding2 from './src/screens/onboarding/onboardingscreen2';
import Onboarding3 from './src/screens/onboarding/onboardingscreen3';
import WelcomeScreen from './src/screens/Welcome/welcomescreen';
import SignUpScreen from './src/screens/Auth/signup';
import SignInScreen from './src/screens/Auth/signin';
import Verification from './src/screens/Auth/verification';
import ForgotPassword from './src/screens/Auth/forgotPassword';
import BalanceScreen from './src/screens/MoneyWallet/balancescreen';
import Transactions from './src/screens/MoneyWallet/transactions';
import Send from './src/screens/MoneyWallet/send';
import TransactionVerify from './src/screens/MoneyWallet/transactionverify';
import Receive from './src/screens/MoneyWallet/receive';
import Deposit from './src/screens/MoneyWallet/deposit';
import AddressScreen from './src/screens/KYC/AddressScreen';
import UploadDocScreen from './src/screens/KYC/UploadDocScreen';
import CardListScreen from './src/screens/MoneyWallet/CardManagement/CardListScreen';
import AddCardScreen from './src/screens/MoneyWallet/CardManagement/AddCardScreen';
import PhysicalCardApplication from './src/screens/MoneyWallet/CardManagement/PhysicalCardApplication';
import CardDetailsScreen from './src/screens/MoneyWallet/CardManagement/CardDetailsScreen';
import CardUnlockScreen from './src/screens/MoneyWallet/CardManagement/CardUnlockScreen';
import GoldWallet from './src/screens/Dashboard/goldwallet';
import BuyGold from './src/screens/Dashboard/buygold';
import CardPayment from './src/screens/Dashboard/cardpayment';
import Purchase from './src/screens/Dashboard/purchase';
import Sell from './src/screens/Dashboard/Sell';
import SellGold from './src/screens/Dashboard/Sellgold';
import Profile from './src/screens/Profile/profile';
import Security from './src/screens/Profile/Security';
import NewsDetail from './src/screens/News/newsDetail';
import MarketNews from './src/screens/News/marketNews';
import DashboardTabs from './src/screens/Tabs/Dashboardtabs';
import MoneyWalletTabs from './src/screens/Tabs/Moneywallettabs';
import NewsTabs from './src/screens/Tabs/Newstabs';
import ProfileTabs from './src/screens/Tabs/Profiletabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface TabIconProps {
  color: string;
  focused: boolean;
}

// --- Slide Right Animation Configuration ---
const slideRightConfig = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

// --- Tab Navigator Component ---
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MONEY WALLET"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F3E932',
        tabBarInactiveTintColor: '#606063',
        tabBarStyle: {
          backgroundColor: '#121214',
          height: 85,
          borderTopWidth: 0,
          paddingBottom: 25,
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="GOLD VAULT"
        component={DashboardTabs}
        options={{
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <View style={{ alignItems: 'center' }}>
              {focused && <View style={styles.activeBar} />}
              <MaterialCommunityIcons name="view-grid-outline" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MONEY WALLET"
        component={MoneyWalletTabs}
        options={{
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <View style={{ alignItems: 'center' }}>
              {focused && <View style={styles.activeBar} />}
              <MaterialCommunityIcons name="wallet-outline" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NEWS"
        component={NewsTabs}
        options={{
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <View style={{ alignItems: 'center' }}>
              {focused && <View style={styles.activeBar} />}
              <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={ProfileTabs}
        options={{
          tabBarIcon: ({ color, focused }: TabIconProps) => (
            <View style={{ alignItems: 'center' }}>
              {focused && <View style={styles.activeBar} />}
              <MaterialCommunityIcons name="account-outline" color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- Root Navigation Logic ---
const RootNavigation = () => {
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);
  const [isAppLocked, setIsAppLocked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().isBiometricEnabled === true) {
            setIsAppLocked(true);
          } else {
            setIsAppLocked(false);
          }
        } catch (error) {
          console.error("Biometric Check Error:", error);
          setIsAppLocked(false);
        }
      } else {
        setIsAppLocked(false);
      }

      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0B0C', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F3E932" />
      </View>
    );
  }

  if (user && isAppLocked) {
    return <SignInScreen onSuccess={() => setIsAppLocked(false)} />;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        ...slideRightConfig as any,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid }}
          />
          <Stack.Screen name="Onboarding1" component={Onboarding1} />
          <Stack.Screen name="Onboarding2" component={Onboarding2} />
          <Stack.Screen name="Onboarding3" component={Onboarding3} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Signin" component={SignInScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="hero" component={TabNavigator} />
          <Stack.Screen name="Balance" component={BalanceScreen} />
          <Stack.Screen name="Transactions" component={Transactions} />
          <Stack.Screen name="Send" component={Send} />
          <Stack.Screen name="TransactionVerify" component={TransactionVerify} />
          <Stack.Screen name="Receive" component={Receive} />
          <Stack.Screen name="Deposit" component={Deposit} />
          <Stack.Screen name="UploadDoc" component={UploadDocScreen} />
          <Stack.Screen name="CardListScreen" component={CardListScreen} />
          <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
          <Stack.Screen name="PhysicalCardApplication" component={PhysicalCardApplication} />
          <Stack.Screen name="CardDetailsScreen" component={CardDetailsScreen} />
          <Stack.Screen name="CardUnlockScreen" component={CardUnlockScreen} />
          <Stack.Screen name="GoldWallet" component={GoldWallet} />
          <Stack.Screen name="BuyGold" component={BuyGold} />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="CardPayment" component={CardPayment} />
          <Stack.Screen name="Sell" component={Sell} />
          <Stack.Screen name="SellGold" component={SellGold} />
          <Stack.Screen name="profile" component={Profile} />
          <Stack.Screen name="Security" component={Security} />
          <Stack.Screen name="NewsDetail" component={NewsDetail} />
          <Stack.Screen name="MarketNews" component={MarketNews} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// --- Main App Component ---
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  activeBar: {
    width: 25,
    height: 3,
    backgroundColor: '#F3E932',
    borderRadius: 5,
    position: 'absolute',
    top: -12,
  },
});