import { db } from "../firebase/firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// Save score
export async function saveScore(name, score) {
  if (!name || typeof score !== "number") return;

  await addDoc(collection(db, "scores"), {
    name,
    score,
    createdAt: serverTimestamp(),
  });
}

// Get leaderboard
export async function getScores() {
  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
