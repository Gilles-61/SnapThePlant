// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  "projectId": "snaptheplant-2qivc",
  "appId": "1:766003553871:web:8a7a006940d561c8806c3a",
  "storageBucket": "snaptheplant-2qivc.firebasestorage.app",
  "apiKey": "AIzaSyDkplRwx8wkVb5J73j48zt85LlZvzXaIkw",
  "authDomain": "snaptheplant-2qivc.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "766003553871"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, provider);

const signOutFromGoogle = () => signOut(auth);

const signUpWithEmailPassword = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);

const signInWithEmailPassword = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);


export { auth, signInWithGoogle, signOutFromGoogle, signUpWithEmailPassword, signInWithEmailPassword };
