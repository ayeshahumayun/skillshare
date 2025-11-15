import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../components/firebase'; // Adjust path to your firebase.js
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sign In function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Register (Sign Up) function
  const register = async (email, password, name, university, expertise) => {
    // 1. Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Update their Firebase Auth profile
    await updateProfile(user, {
      displayName: name,
    });

    // 3. Create a user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      university: university,
      expertise: expertise,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  };

  // Sign Out function
  const logout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false); // Stop loading once we know auth state
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // The value to be passed to consuming components
  const value = {
    currentUser,
    isAuthenticated: !!currentUser, // True if currentUser is not null
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children when not loading */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};