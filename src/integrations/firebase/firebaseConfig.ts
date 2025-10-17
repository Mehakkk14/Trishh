import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQioGmZSojDzE-oqkwbPDpvrruD-65xdA",
  authDomain: "trishh-98333.firebaseapp.com",
  projectId: "trishh-98333",
  storageBucket: "trishh-98333.firebasestorage.app",
  messagingSenderId: "822835304486",
  appId: "1:822835304486:web:472e1e10a9d7cb6b0f6ee7",
  measurementId: "G-B7FCL4L1Z5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };