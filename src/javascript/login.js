import  { db, auth, ref, update, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, firebaseApp, signInWithPopup} from "./db.js"

// Sign out user
auth.signOut();

// email and password login
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

            if (errorCode == "auth/user-not-found") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Email is not registered!</p>"
            }
            else if (errorCode == "auth/wrong-password") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Incorrect password!</p>"
            }
            else if (errorCode == "auth/too-many-requests") {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Account has been temporarily disabled due to many failed login attempts! Restore it by resetting your password or try again later.</p>"
            }
            else {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Error, please try again.</p>"
            }
        });

        // check if user email is verified, deny access if not
        onAuthStateChanged(auth, async (user) => {
            if (user.email == false) {
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Please verify your email!</p>"
            }
            else {
                // write date and time to database (last login date/time)
                const user = userCredential.user;
                const dt = new Date();
                document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Login successful</p>"
                await update(ref(db, "Users/" + user.uid), { lastLogin: dt })

                // clear form and redirect page
                document.getElementById('loginForm').reset();
                window.location.href = "home.html";
            }

        });
    }
    // fade in and fade out after 5 seconds 
    document.getElementById("bubble-container").style.opacity = 1;
    setTimeout(function () { document.getElementById("bubble-container").style.opacity = 0; }, 5000);
}

// google login
document.getElementById("googleLogin").addEventListener("click", googleAcc);
function googleAcc() {
    const provider = new GoogleAuthProvider(firebaseApp);

    signInWithPopup(auth, provider)
        .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;

            // update last login date
            const dt = new Date();
            document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Login successful</p>"
            await update(ref(db, 'Users/' + user.uid),{lastLogin: dt})

            // redirect page
            window.location.href = "home.html";
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            console.log(errorCode)
            console.log(errorMessage)
            console.log(email)
            console.log(credential)
        });
}
