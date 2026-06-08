import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth'; // getAuth fallback ke liye
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCe9zfG57BJ5YXpEZnD9_VXblMncOOwQYY",
  authDomain: "goldblockapp.firebaseapp.com",
  projectId: "goldblockapp",
  storageBucket: "goldblockapp.firebasestorage.app",
  messagingSenderId: "1062470318471",
  appId: "1:1062470318471:web:90ac0506c0d0e91de93b22"
};

const app = initializeApp(firebaseConfig);

let auth: Auth;

// Mobile aur Web ke liye alag logic taake Expo Go crash na ho
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // Mobile ke liye Persistence set karein
  const { getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db: Firestore = getFirestore(app);
export const functions = getFunctions(app);

export { auth, db };