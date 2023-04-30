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

  // password strength 
  var strength = getPasswordStrength(password);

  // make sure both passwords identical 
  if (password != passwordCheck) {
    document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Passwords do not match!</p>"
  }
  // make sure password is strong
  else if (strength < 5) {
    if (password.length < 10) {
      document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must be at least 10 characters!</p>"
    }
    else if (!/[A-Z]/.test(password)) {
      document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must contain a capital letter!</p>"
    }
    else if (!/[0-9]/.test(password)) {
      document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must contain a number!</p>"
    }
    else if (!/[^A-Za-z0-9]/.test(password)) {
      document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must contain a special character</p>"
    }
    else {
      document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password is too weak!</p>"
    }
  }
  else {
    // validate information 
    var valid = true;

    // Sign up and sign in
    var userCredential = await createUserWithEmailAndPassword(auth, email, password).catch((error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode)
      console.log(errorMessage)

      if (errorCode == "auth/weak-password") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Password must be at least 6 characters!</p>"
        valid = false;
      }
      else if (errorCode == "auth/email-already-in-use") {
        document.getElementById("bubble-container").innerHTML = "<p class='bubble'>Email is already used!</p>"
        valid = false;
      }
    }));

    if (valid) {
      // set profile display name to full name
      await updateProfile(auth.currentUser, { displayName: fullName }).catch((error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode)
        console.log(errorMessage)
      }));

      // send email verifcation
      await sendEmailVerification(auth.currentUser);

      // add information to authentication and realtime database
      const user = userCredential.user;
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

  // fade in and fade out after 5 seconds 
  document.getElementById("bubble-container").style.opacity = 1;
  setTimeout(function () { document.getElementById("bubble-container").style.opacity = 0; }, 5000);
}

// Password strength checker
function getPasswordStrength(password) {
  let s = 0;
  if (password.length > 6) {
    s++;
  }
  if (password.length > 9) {
    s++;
  }
  if (/[A-Z]/.test(password)) {
    s++;
  }
  if (/[0-9]/.test(password)) {
    s++;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    s++;
  }
  return s;
}

// Password bar update
document.querySelector(".pw-meter #password1").addEventListener("keyup", function (e) {
  let password = e.target.value;
  let strength = getPasswordStrength(password);
  let passwordStrengthSpans = document.querySelectorAll(".pw-meter .pw-strength span");
  strength = Math.max(strength, 1);
  passwordStrengthSpans[1].style.width = strength * 20 + "%";
  if (password.length == 0) {
    passwordStrengthSpans[0].innerText = "Password Strength";
    passwordStrengthSpans[0].style.color = "#111";
    passwordStrengthSpans[1].style.width = 0;
  }
  else if (strength < 2) {
    passwordStrengthSpans[0].innerText = "Weak";
    passwordStrengthSpans[0].style.color = "#111";
    passwordStrengthSpans[1].style.background = "#d2222d";
  } else if (strength >= 2 && strength <= 4) {
    passwordStrengthSpans[0].innerText = "Medium";
    passwordStrengthSpans[0].style.color = "#111";
    passwordStrengthSpans[1].style.background = "#ffbf00";
  } else {
    passwordStrengthSpans[0].innerText = "Strong";
    passwordStrengthSpans[0].style.color = "#fff";
    passwordStrengthSpans[1].style.background = "#238823";
  }
});

