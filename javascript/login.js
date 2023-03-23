import  { db, auth, ref, update, signInWithEmailAndPassword, onAuthStateChanged} from "./db.js"

// listen for submit event 
document.getElementById("loginSubmit").addEventListener("click", formSubmit);

export async function formSubmit(e) {
    e.preventDefault();

    // get values from form
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // sign in with email and password
    var userCredential = await signInWithEmailAndPassword(auth, email, password).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage);
    });
    
    // check if user email is verified, deny access if not
    onAuthStateChanged(auth, async (user) => {
        if (user.emailVerified) {
            // write date and time to database (last login date/time)
            const userID = userCredential.user.uid;
            const dt = new Date();
            await update(ref(db, 'Users/' + userID),{lastLogin: dt})
            
            // Save ID of user that logged in to persist to other pages
            localStorage.setItem("userID", userID);

            // clear form and redirect page
            document.getElementById('loginForm').reset();            
            window.location.href = "home.html";     
        } else {
            alert('Please verify Email!')
        }
    }); 
}
