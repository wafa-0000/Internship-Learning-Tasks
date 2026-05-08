import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Aapki simple config file

// 1. Context create karein
const AuthContext = createContext<{ user: User | null }>({ user: null });

// 2. Provider banayein jo app ko wrap karega
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Firebase listener: Jab bhi auth status badlega, ye trigger hoga
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook taake use karna asan ho
export const useAuth = () => useContext(AuthContext);