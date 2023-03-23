import {set, ref, db, onValue, auth, updatePassword, reauthenticateWithCredential,EmailAuthProvider} from "./db.js";
//This is a function to change the user profile picture
//Need to update this so that it can upload to database

// Retrieve ID of user that just logged in
const userID = localStorage.getItem("userID");

document.getElementById('file').onchange = function (evt) {
  var tgt = evt.target || window.event.srcElement,
      files = tgt.files;
  
  // FileReader support
  if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
          document.getElementById("pfp").src = fr.result;
      }
      fr.readAsDataURL(files[0]);
  }
}

// display user account information
displayAccount(userID);

document.getElementById("userProfileDetails").addEventListener("submit", profileUpdate);

// displays the user's information & profile pic
function displayAccount(accountID)
{
  // Reference of a user's account information from the database
  const accountRef = ref(db, `Users/${accountID}/AccountInfo`);

  onValue(accountRef, (snapshot) => {
    // Retrieve user's account information as object
    const data = snapshot.val();    

    // Image element of profile picture
    var image = document.getElementById("profile-info-picture");
    var image2 = document.getElementById("pfp");
    var fullN = document.getElementById("fullname");
    var fname = document.getElementById("firstName");
    var lname = document.getElementById("lastName");
    var mail = document.getElementById("email");
    var uname = document.getElementById("username");
    //var pass = document.getElementById("password");
    var loc = document.getElementById("location");
    var uloc = document.getElementById("user-location");

    // Assign picture's src to picture from user's account information
    image.src = data.profilePicture;
    image2.src = data.profilePicture;
    var fullname = data.fullName;
    fullN.innerText = fullname;
    var firstlastname = fullname.split(" ");
    fname.value = firstlastname[0];
    lname.value = firstlastname[1];
    mail.value = data.email;
    uname.value = data.username;
    // pass.value = data.password;
    loc.value = data.location;
    uloc.innerText = data.location;

    // Display user's full name next to profile picture
    image.insertAdjacentText("afterend", data.fullName)
  })
}

async function profileUpdate(e)
{
  e.preventDefault();
  
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const userName = document.getElementById("username").value;
  const location = document.getElementById("location").value;
  const profilepic = document.getElementById("pfp").src;
  const pass = document.getElementById("password").value;
  const npass = document.getElementById("new-password").value;
  const user = auth.currentUser;

  const accountID = localStorage.getItem("userID");
  const accountRef = ref(db, `Users/${accountID}/AccountInfo`);

  onValue(accountRef, (snapshot) => {
    // Retrieve user's account information as object
    const data = snapshot.val();   
    const credential = EmailAuthProvider.credential(
      data.email,
      pass
    );
    reauthenticateWithCredential(user, credential).then(() => {
    updatePassword(user,npass).then(() => {
      console.log("Password updated!");
    }).catch((error) => {
      console.log(error);
      // ...
    });
    });
  });
  await set(ref(db, `Users/${userID}/AccountInfo`), {
    fullName: firstName + " " + lastName,
    email: email,
    username: userName,
    location: location,
    profilePicture: profilepic
  });
  document.getElementById("password").value = "";
  document.getElementById("new-password").value = "";
}

