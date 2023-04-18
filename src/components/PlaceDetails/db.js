import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, limitToFirst, query, get, orderByChild, orderByKey, orderByValue, remove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
export { push, ref, remove, update, orderByChild, orderByKey, orderByValue, increment, onValue, limitToLast, limitToFirst, query, set, get, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider };

const firebaseConfig = {
  apiKey: "AIzaSyCzpEwrHIAT1MfPfW9RXMxR0wNOFpcnS-Y",
    authDomain: "qqg-491b.firebaseapp.com",
    databaseURL: "https://qqg-491b-default-rtdb.firebaseio.com",
    projectId: "qqg-491b",
    storageBucket: "qqg-491b.appspot.com",
    messagingSenderId: "891674221190",
    appId: "1:891674221190:web:a4bcf43906da1a6dd3cf07"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Get Database Object with app
export const db = getDatabase(firebaseApp);

export const auth = getAuth();