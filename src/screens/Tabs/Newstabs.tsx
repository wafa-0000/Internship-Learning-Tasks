import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MarketNews from '../News/marketNews';
import NewsDetail from '../News/newsDetail';
const Stack = createStackNavigator();
export default function NewsTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketNews" component={MarketNews} />
      <Stack.Screen name="NewsDetail" component={NewsDetail} />
    </Stack.Navigator>
  );
}