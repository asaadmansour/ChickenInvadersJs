// scripts/firebase/firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJno6qzd412tft1jNv9v-Odhut-YDDeh0",
  authDomain: "chicken-invaders-scoreboard.firebaseapp.com",
  projectId: "chicken-invaders-scoreboard",
  storageBucket: "chicken-invaders-scoreboard.firebasestorage.app",
  messagingSenderId: "569264713165",
  appId: "1:569264713165:web:40c4c7b0b0fdf381dae884",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore (database)
export const db = getFirestore(app);
