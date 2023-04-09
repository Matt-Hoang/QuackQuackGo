/* === Itineraries Checklist === */
import { firebaseConfig } from "./firebaseKey.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue, child, get, remove } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


// populate page if user is logged in, if logged out reroute to login page
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    populateChecklists(user);
  } else {
    // User is signed out
    window.location.href = "login.html";
  }
});

// populates checklists with thier items from database 
function populateChecklists(user) {

  // read and display pretrip item from database 
  const pretripChecklist = ref(database, 'users/' + user.uid + "/checklists/pretrip/");
  onValue(pretripChecklist, (snapshot) => {
    const checklistItems = snapshot.val();

    // parse pretrip checklist 
    for (var itemName in checklistItems) {
      // add item to checklist
      var li = document.createElement("li");
      var t = document.createTextNode(itemName);
      li.appendChild(t);
      li.id = "pretrip";

      var ul = document.getElementsByClassName("pretrip-checklist")
      for (var j = 0; j < ul.length; j++) {
        ul[j].appendChild(li);
      }

      // create and add "x" to item
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

      var close = document.getElementsByClassName("close");
      for (var i = 0; i < close.length; i++) {
        close[i].onclick = function () {
          var div = this.parentElement;
          div.style.display = "none";

          // remove item from database 
          if (div.id == "pretrip") {
            document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";
            remove(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + div.textContent.slice(0, -1).trim()));
          } else {
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";
            remove(ref(database, 'users/' + user.uid + "/checklists/posttrip/" + div.textContent.slice(0, -1).trim()));
          }
        }
      }

      // mark item as completed (strikethrough and checkmark)
      if (Object.values(checklistItems[itemName]) == 1) {
        li.className = "checked";
      }
    }
  });

  // read and display posttrip item from database
  const posttripChecklist = ref(database, 'users/' + user.uid + "/checklists/posttrip/");
  onValue(posttripChecklist, (snapshot) => {
    const checklistItems = snapshot.val();

    // parse posttrip checklist 
    for (var itemName in checklistItems) {
      // add item to checklist
      var li = document.createElement("li");
      var t = document.createTextNode(itemName);
      li.appendChild(t);
      li.id = "posttrip";


      var ul = document.getElementsByClassName("posttrip-checklist")
      for (var j = 0; j < ul.length; j++) {
        ul[j].appendChild(li);
      }

      // create and add "x" to item
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

      var close = document.getElementsByClassName("close");
      for (var i = 0; i < close.length; i++) {
        close[i].onclick = function () {
          var div = this.parentElement;
          div.style.display = "none";

          // remove item from database 
          if (div.id == "pretrip") {
            document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";
            remove(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + div.textContent.slice(0, -1).trim()));
          } else {
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";
            remove(ref(database, 'users/' + user.uid + "/checklists/posttrip/" + div.textContent.slice(0, -1).trim()));
          }
        }
      }

      // mark item as completed (strikethrough and checkmark)
      if (Object.values(checklistItems[itemName]) == 1) {
        li.className = "checked";
      }
    }
  });
}


// strikethrough for pretrip list
var pretrip = document.querySelectorAll('.pretrip-checklist');
pretrip[0].addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in

        // get item name from html
        var itemName = ev.target.innerText.slice(0, -1).trim();

        // get item once from database 
        get(child(ref(database), `users/${user.uid}/checklists/pretrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = snapshot.val();

            // clear current items in HTML 
            document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";

            // if strikethrough is 0, mark as 1
            // else mark as 0
            if (Object.values(checklistItems[itemName]) == 0) {
              set(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + itemName), {
                strikethrough: 1
              });
            } else {
              set(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + itemName), {
                strikethrough: 0
              });
            }
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        // User is signed out
        console.log("not logged in");
      }
    });
  }
}, false);

// strikethrough for posttrip list
var posttrip = document.querySelectorAll('.posttrip-checklist');
posttrip[0].addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in

        // get item name from html
        var itemName = ev.target.innerText.slice(0, -1).trim();

        // get item once from database 
        get(child(ref(database), `users/${user.uid}/checklists/posttrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = snapshot.val();

            // clear current items in HTML 
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";

            // if strikethrough is 0, mark as 1
            // else mark as 0
            if (Object.values(checklistItems[itemName]) == 0) {
              set(ref(database, 'users/' + user.uid + "/checklists/posttrip/" + itemName), {
                strikethrough: 1
              });
            } else {
              set(ref(database, 'users/' + user.uid + "/checklists/posttrip/" + itemName), {
                strikethrough: 0
              });
            }
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      } else {
        // User is signed out
        console.log("not logged in");
      }
    });
  }
}, false);

// Create a new list item when clicking on the "Add" button for pre-trip check list
window.newElementPre = newElementPre;
function newElementPre() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in

      // add item to database
      var inputValue = document.getElementsByClassName("pretrip-checklist-input")
      for (var i = 0; i < inputValue.length; i++) {
        if (inputValue[i].value.trim() === '') {
          alert("You must write something!");
        } else {
          // clear checklist before adding new item (prevent duplicate items)
          document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";

          var itemName = inputValue[i].value;
          set(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + itemName), {
            strikethrough: 0
          });
        }
        document.getElementsByClassName("pretrip-checklist-input")[i].value = ""
      }
    } else {
      // User is signed out
      console.log("not logged in");
    }
  });
}

// Create a new list item when clicking on the "Add" button for post-trip check list
window.newElementPost = newElementPost;
function newElementPost() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in

      // add item to database
      var inputValue = document.getElementsByClassName("posttrip-checklist-input")
      for (var i = 0; i < inputValue.length; i++) {
        if (inputValue[i].value.trim() === '') {
          alert("You must write something!");
        } else {
          // clear checklist before adding new item (prevent duplicate items)
          document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";
          
          var itemName = inputValue[i].value;
          set(ref(database, 'users/' + user.uid + "/checklists/posttrip/" + itemName), {
            strikethrough: 0
          });
        }
        document.getElementsByClassName("posttrip-checklist-input")[i].value = ""
      }
    } else {
      // User is signed out
      console.log("not logged in");
    }
  });
}

/* === Itineraries Main Center === */

// Settings for itineraries carousel 
$('#slick-carousel-1').slick({
  rows: 2,
  dots: false,
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 3
});

// Settings for bookmarked carousel 
$('#slick-carousel-2 ').slick({
  rows: 2,
  dots: false,
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 3
});
