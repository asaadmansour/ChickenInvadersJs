import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
