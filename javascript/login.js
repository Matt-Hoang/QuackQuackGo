// reference documentation: https://firebase.google.com/docs/auth/web/start

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGNTPXS5ljCUD_ihtUkzlwRKRgdG6CgrQ",
    authDomain: "senior-project-qqg.firebaseapp.com",
    databaseURL: "https://senior-project-qqg-default-rtdb.firebaseio.com",
    projectId: "senior-project-qqg",
    storageBucket: "senior-project-qqg.appspot.com",
    messagingSenderId: "770896520630",
    appId: "1:770896520630:web:ca79157ceee5d7ffc0cd17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// listen for submit event 
document.getElementById("loginSubmit").addEventListener("click", formSubmit);

async function formSubmit(e) {
    e.preventDefault();

    // get values from form
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (email == "" && password == "") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please input an email and password!</p>"
    } 
    else if (email == "") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please input an email!</p>"
    } 
    else if (password == "") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please input a password!</p>"
    }
    else {
        // sign in with email and password
        var userCredential = await signInWithEmailAndPassword(auth, email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode)
            console.log(errorMessage)

            if (errorCode == "auth/invalid-email") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Email is not registered!</p>"
            }
            else if (errorCode == "auth/wrong-password") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Incorrect password!</p>"
            }
            else if (errorCode == "auth/too-many-requests") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Account has been temporarily disabled due to many failed login attemps! Restore it by resetting your password or try again later.</p>"
            }           
        });
        
        // check if user email is verified, deny access if not
        onAuthStateChanged(auth, async (user) => {
            if (user.emailVerified == false) {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please verify your email!</p>"
            }
            else {
                // write date and time to database (last login date/time)
                const user = userCredential.user;
                const dt = new Date();
                await update(ref(database, 'users/' + user.uid),{lastLogin: dt})

                // clear form and redirect page
                document.getElementById('loginForm').reset();
                window.location.href = "home.html";     
            }
            
        });
    }
}