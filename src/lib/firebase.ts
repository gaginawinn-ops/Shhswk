import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9GVC3gTNbGEHe-MuORaroI_1mzlysIEs",
  authDomain: "secret-hub-41d99.firebaseapp.com",
  projectId: "secret-hub-41d99",
  storageBucket: "secret-hub-41d99.firebasestorage.app",
  messagingSenderId: "977877701370",
  appId: "1:977877701370:web:ab7562a3b2307db3caef43",
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
export const db = getFirestore(firebaseApp);
