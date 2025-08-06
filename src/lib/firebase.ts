
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, connectAuthEmulator } from "firebase/auth";

export const firebaseConfig: FirebaseOptions = {
  "projectId": "snaptheplant-2qivc",
  "appId": "1:766003553871:web:53fda5c8df2903ba806c3a",
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

// Connect to emulator if in a development environment
if (process.env.NODE_ENV === 'development') {
    // Point to the auth emulator
    try {
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        console.log("Firebase Auth emulator connected.");
    } catch (e) {
        console.warn("Could not connect to Firebase Auth emulator.", e);
    }
}


const signInWithGoogle = () => signInWithPopup(auth, provider);

const signOutFromGoogle = () => signOut(auth);

const signUpWithEmailPassword = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);

const signInWithEmailPassword = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);

const sendPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);


export { auth, signInWithGoogle, signOutFromGoogle, signUpWithEmailPassword, signInWithEmailPassword, sendPasswordReset };
