import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCLfSFtR0hNY7aXwPE2sr2IbdLBqYETC0",
  authDomain: "microlens-1fbdb.firebaseapp.com",
  projectId: "microlens-1fbdb",
  storageBucket: "microlens-1fbdb.appspot.com",
  messagingSenderId: "434960218920",
  appId: "1:434960218920:web:b292e9456235e429a2ae1d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
