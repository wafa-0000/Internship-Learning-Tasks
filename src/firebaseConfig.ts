import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCe9zfG57BJ5YXpEZnD9_VXblMncOOwQYY",
  authDomain: "goldblockapp.firebaseapp.com",
  projectId: "goldblockapp",
  storageBucket: "goldblockapp.firebasestorage.app",
  messagingSenderId: "1062470318471",
  appId: "1:1062470318471:web:90ac0506c0d0e91de93b22"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;