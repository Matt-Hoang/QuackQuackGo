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


/* === Itineraries Checklist === */

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
for (var i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
for (var i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelectorAll('ul');
for (let i = 0; i < list.length; i++) {
  list[i].addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  }, false);
}

// Create a new list item when clicking on the "Add" button for pre-trip check list
window.newElementPre = newElementPre;
function newElementPre() {
  var inputValue = document.getElementsByClassName("pretrip-checklist-input")
  for (var i = 0; i < inputValue.length; i++) {
    var li = document.createElement("li");
    var t = document.createTextNode(inputValue[i].value);
    li.appendChild(t);
    if (inputValue[i].value === '') {
      alert("You must write something!");
    } else {
      var ul = document.getElementsByClassName("pretrip-checklist")
      for (var j = 0; j < ul.length; j++) {
        ul[j].appendChild(li);
      }
    }
    document.getElementsByClassName("pretrip-checklist-input")[i].value = ""

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  }
}

// Create a new list item when clicking on the "Add" button for post-trip check list
window.newElementPost = newElementPost;
function newElementPost() {
  var inputValue = document.getElementsByClassName("posttrip-checklist-input")
  for (var i = 0; i < inputValue.length; i++) {
    var li = document.createElement("li");
    var t = document.createTextNode(inputValue[i].value);
    li.appendChild(t);
    if (inputValue[i].value === '') {
      alert("You must write something!");
    } else {
      var ul = document.getElementsByClassName("posttrip-checklist")
      for (var j = 0; j < ul.length; j++) {
        ul[j].appendChild(li);
      }
    }
    document.getElementsByClassName("posttrip-checklist-input")[i].value = ""

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  }
}



// write to firebase
import { firebaseConfig } from "./firebaseKey.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// write item to list 
function writeUserData(user) {
  var itemName1 = "Item 1";
  var itemName2 = "Item 2";

  var mark = 0;

  set(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + itemName1), {
    strikethrough: mark
  });

  set(ref(database, 'users/' + user.uid + "/checklists/pretrip/" + itemName2), {
    strikethrough: mark
  });
}






onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in

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

        for (i = 0; i < close.length; i++) {
          close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
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

        for (i = 0; i < close.length; i++) {
          close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
          }
        }

        // mark item as completed (strikethrough and checkmark)
        if (Object.values(checklistItems[itemName]) == 1) {
          li.className = "checked";
        }
      }
    });

  } else {
    // User is signed out
    console.log("not logged in");
  }
});