import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEwyyh_SyadTEXyiRS_26WefnnmE6D-v8",
  authDomain: "test-c37dc.firebaseapp.com",
  databaseURL: "https://test-c37dc-default-rtdb.firebaseio.com",
  projectId: "test-c37dc",
  storageBucket: "test-c37dc.appspot.com",
  messagingSenderId: "325507987931",
  appId: "1:325507987931:web:ee786697442c24875bcffe",
  measurementId: "G-KS50GC2ZMC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get Database Object with app
const db = getDatabase(firebaseApp);

export default db;