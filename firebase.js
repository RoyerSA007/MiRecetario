import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJKsgt0Zs39U61AVa0PTpDgVf-pAA9QkQ",
  authDomain: "mirecetario-734d4.firebaseapp.com",
  projectId: "mirecetario-734d4",
  storageBucket: "mirecetario-734d4.firebasestorage.app",
  messagingSenderId: "488646490383",
  appId: "1:488646490383:web:cd016338d961870e76a67a"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth con persistencia nativa
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { auth, db };