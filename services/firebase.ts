import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "",
  authDomain: "nemesis-os.firebaseapp.com",
  projectId: "nemesis-os",
  storageBucket: "nemesis-os.firebasestorage.app",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export them properly so they are defined when the app starts
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
