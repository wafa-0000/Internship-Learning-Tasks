import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BalanceScreen from '../MoneyWallet/balancescreen';
import Deposit from '../MoneyWallet/deposit';
import Receive from '../MoneyWallet/receive';
import Send from '../MoneyWallet/send';
import Transactions from '../MoneyWallet/transactions';
import TransactionVerify from '../MoneyWallet/transactionverify';
import AddCardScreen from '../MoneyWallet/CardManagement/AddCardScreen';
import CardDetailsScreen from '../MoneyWallet/CardManagement/CardDetailsScreen';
import CardListScreen from '../MoneyWallet/CardManagement/CardListScreen';
import PhysicalCardApplication from '../MoneyWallet/CardManagement/PhysicalCardApplication';
const Stack = createStackNavigator();
const TabWrapper = (Component: any) => (props: any) => (
  <View style={{ flex: 1, backgroundColor: '#0B0B0C', paddingBottom: 85 }}>
    <Component {...props} />
  </View>
);
export default function MoneyWalletTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Balance" component={TabWrapper(BalanceScreen)} />
      <Stack.Screen name="Deposit" component={TabWrapper(Deposit)} />
      <Stack.Screen name="Receive" component={TabWrapper(Receive)} />
      <Stack.Screen name="Send" component={TabWrapper(Send)} />
      <Stack.Screen name="Transactions" component={TabWrapper(Transactions)} />
      <Stack.Screen name="TransactionVerify" component={TabWrapper(TransactionVerify)} />
      <Stack.Screen name="CardList" component={TabWrapper(CardListScreen)} />
      <Stack.Screen name="AddCard" component={TabWrapper(AddCardScreen)} />
      <Stack.Screen name="CardDetails" component={TabWrapper(CardDetailsScreen)} />
      <Stack.Screen name="PhysicalCard" component={TabWrapper(PhysicalCardApplication)} />
    </Stack.Navigator>
  );
}