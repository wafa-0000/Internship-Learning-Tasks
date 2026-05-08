import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Profile/profile';
import Security from '../Profile/Security';
import AddressScreen from '../KYC/AddressScreen';
import UploadDocScreen from '../KYC/UploadDocScreen';

const Stack = createStackNavigator();

export default function ProfileTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={Profile} />
      <Stack.Screen name="Security" component={Security} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="UploadDoc" component={UploadDocScreen} />
    </Stack.Navigator>
  );
}