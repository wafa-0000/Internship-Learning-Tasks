// src/screens/Tabs/DashboardTab.tsx
import { createStackNavigator } from '@react-navigation/stack';
import Hero from '../MoneyWallet/hero';
import GoldWallet from '../Dashboard/goldwallet';
import BuyGold from '../Dashboard/buygold';
import CardPayment from '../Dashboard/cardpayment';
import Purchase from '../Dashboard/purchase';
import Sell from '../Dashboard/Sell';
import SellGold from '../Dashboard/Sellgold';
const Stack = createStackNavigator();

export default function DashboardTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Hero" component={Hero}/>
      <Stack.Screen name="GoldWallet" component={GoldWallet} />
      <Stack.Screen name="BuyGold" component={BuyGold} />
      <Stack.Screen name="Purchase" component={Purchase}/>
      <Stack.Screen name="Sell" component={Sell}/>
      <Stack.Screen name="CardPayment" component={CardPayment}/>
      <Stack.Screen name="SellGold" component={SellGold}/>
    </Stack.Navigator>
  );
}