// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSXkSJJwuWDH85p_3aQIwGDbdSznY34Ck",
  authDomain: "certy-67269.firebaseapp.com",
  projectId: "certy-67269",
  storageBucket: "certy-67269.firebasestorage.app",
  messagingSenderId: "386067668703",
  appId: "1:386067668703:web:4d704986a0511a896d136a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
