import  { db, ref, auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, set } from "./db.js"

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
        alert ("\nPassword did not match! Please try again.")
    }
    else {
        // Sign up and sign in
        var userCredential = await createUserWithEmailAndPassword(auth, email, password).catch((error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorMessage)
        }));

        // set profile display name to full name
        await updateProfile(auth.currentUser, {displayName: fullName}).catch((error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("error")
            alert(errorMessage)
        }));

        // send email verifcation
        await sendEmailVerification(auth.currentUser); 

        const user = userCredential.user;
        // add information to authentication and realtime database
        await set(ref(db, 'Users/' + user.uid), {
            "AccountInfo": {
                "fullName": fullName, 
                "username": userName, 
                "email": email, 
                "profilePicture": "images/profile-picture.jpeg"
              },
              "CheckList": {
                "preTrip": "",
                "postTrip": ""
              },
              "Bookmarked": "",
              "Itineraries": ""
            // dont save password to DB
        })

        // reset form and redirect page
        document.getElementById('registrationForm').reset();
        window.location.href = "confirmation.html";  
    }
}
