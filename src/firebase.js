import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdP1D96DhH23n9IcPGAHBwr1g9HxlpoKc",
  authDomain: "water-level-monitoring-aae6d.firebaseapp.com",
  projectId: "water-level-monitoring-aae6d",
  storageBucket: "water-level-monitoring-aae6d.firebasestorage.app",
  messagingSenderId: "598287833940",
  appId: "1:598287833940:web:680afa1a3ab982ae3746c1",
  measurementId: "G-YLR8B3VP6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 