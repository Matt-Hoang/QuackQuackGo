// Firebase Key
import { firebaseConfig } from "./firebaseKey.js";
// Firebase Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// listen for submit event 
document.getElementById("passwordReset").addEventListener("click", passwordReset);

async function passwordReset(e) {
    e.preventDefault();

    // get email from form 
    var email = document.getElementById('email').value;

    if (email == "") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please input an email!</p>"
    }
    else {
        sendPasswordResetEmail(auth, email)
            .then(async () => {
                // Password reset email sent!
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password reset sent! Loading login page in 5</p>"
                await new Promise(r => setTimeout(r, 1000));
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password reset sent! Loading login page in 4</p>"
                await new Promise(r => setTimeout(r, 1000));
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password reset sent! Loading login page in 3</p>"
                await new Promise(r => setTimeout(r, 1000));
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password reset sent! Loading login page in 2</p>"
                await new Promise(r => setTimeout(r, 1000));
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password reset sent! Loading login page in 1</p>"

                // clear form and redirect
                document.getElementById('passResetForm').reset();
                window.location.href = "login.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode == "auth/user-not-found") {
                    document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Email is not registered!</p>"
                }
                else if (errorCode == "auth/too-many-requests") {
                    document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Too many requests!</p>"
                }
            });
    }
    // fade in and fade out after 5 seconds 
    document.getElementById("bubble-container").style.opacity = 1;
    setTimeout(function () { document.getElementById("bubble-container").style.opacity = 0; }, 5000);
}
