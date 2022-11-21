import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw4SfyJg0MzVeHzzeHy9TIdTBft2QXPdM",

  authDomain: "reddit-899c2.firebaseapp.com",

  projectId: "reddit-899c2",

  storageBucket: "reddit-899c2.appspot.com",

  messagingSenderId: "253041564366",

  appId: "1:253041564366:web:fba222345350c7cb9fce9f",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
