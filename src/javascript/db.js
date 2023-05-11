import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, limitToFirst, query, get, orderByChild, orderByKey, orderByValue, remove, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updatePassword, reauthenticateWithCredential,EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
export { push, ref, remove, update, orderByChild, orderByKey, orderByValue, increment, onValue, limitToLast, limitToFirst, query, set, get, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updatePassword, reauthenticateWithCredential,EmailAuthProvider, child };

const firebaseConfig = {
  apiKey: "AIzaSyCJ6Y9GaNqv4VA5hzydaGHkUMQPE0Q9TpM",
  authDomain: "quackquackgo-3545c.firebaseapp.com",
  databaseURL: "https://quackquackgo-3545c-default-rtdb.firebaseio.com/",
  projectId: "quackquackgo-3545c",
  storageBucket: "quackquackgo-3545c.appspot.com",
  messagingSenderId: "728670417360",
  appId: "1:728670417360:web:a17cae9a7658dee7b349d5"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Get Database Object with app
export const db = getDatabase(firebaseApp);

export const auth = getAuth();