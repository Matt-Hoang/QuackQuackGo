// reference documentation: https://firebase.google.com/docs/auth/web/start

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
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
document.getElementById("registrationForm").addEventListener("submit", registrationSubmit);

// Submit form - sign up new users, addes to authentication and realtime database
async function registrationSubmit(e) {
    e.preventDefault();

    // get values from form
    var fullName = document.getElementById('fullName').value;
    var userName = document.getElementById('userName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password1').value;
    var passwordCheck = document.getElementById('password2').value;

    // make sure both passwords identical 
    if (password != passwordCheck) {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Passwords do not match!</p>"
    }
    else {
        // Sign up and sign in
        var userCredential = await createUserWithEmailAndPassword(auth, email, password).catch((error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode)
            console.log(errorMessage)

            if (errorCode == "auth/weak-password") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must be at least 6 characters!</p>"
            } 
            else if (errorCode == "auth/email-already-in-use") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Email is already used!</p>"
            }
        }));

        // set profile display name to full name
        await updateProfile(auth.currentUser, {displayName: fullName}).catch((error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode)
            console.log(errorMessage)
        }));

        // send email verifcation
        await sendEmailVerification(auth.currentUser); 

        // add information to authentication and realtime database
        const user = userCredential.user;
        await set(ref(database, 'users/' + user.uid),{
            fullName: fullName,
            userName: userName,
            email: email
            // dont save password to DB
        })

        // reset form and redirect page
        document.getElementById('registrationForm').reset();
        window.location.href = "confirmation.html";  
    }
}
