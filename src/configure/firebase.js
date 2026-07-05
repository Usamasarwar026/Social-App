import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCClWmGZjsaTNhCKPYjfzwJfKEawcdMP-4",
  authDomain: "socialapp-ba4bb.firebaseapp.com",
  projectId: "socialapp-ba4bb",
  storageBucket: "socialapp-ba4bb.firebasestorage.app",
  messagingSenderId: "35449273554",
  appId: "1:35449273554:web:2d20d30aceda7a93f3010b",
  measurementId: "G-P9JCNK0NE7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// Export Firebase Storage for image uploads
export const storage = getStorage(app);
