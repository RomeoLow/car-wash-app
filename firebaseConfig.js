// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);