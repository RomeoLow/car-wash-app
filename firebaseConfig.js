import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRTD_NvGiUA3szzLFhMAqyaWV7ggIZHdM",
  authDomain: "fir-b92fc.firebaseapp.com",
  projectId: "fir-b92fc",
  storageBucket: "fir-b92fc.firebasestorage.app",
  messagingSenderId: "437244699509",
  appId: "1:437244699509:web:2cb25664d1b3e595d1e93c",
  measurementId: "G-V98WQLGEJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);