import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClwUFQKwLn89IUJMEy_XqAw-sZzSgGi7A",
  authDomain: "nemesis-os.firebaseapp.com",
  projectId: "nemesis-os",
  storageBucket: "nemesis-os.firebasestorage.app",
  messagingSenderId: "377071190881",
  appId: "1:377071190881:web:82f63e024c72a597333b20",
  measurementId: "G-G2ZS058D20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export them properly so they are defined when the app starts
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);