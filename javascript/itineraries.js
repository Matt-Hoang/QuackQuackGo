import { db, ref, get, onAuthStateChanged, auth, onValue, set, remove, child } from "./db.js";

// Container element of itineraries
var itineraryContainerList = document.getElementsByClassName("itineraries-container")[0];

// Container element of bookmarked itineraries
var bookmarkedContainerList = document.getElementsByClassName("bookmarked-container")[0];

// populate page if user is logged in, if logged out reroute to login page
onAuthStateChanged(auth, (user) => {
  // User is signed in
  if (user) {
    // itinDisplayStyle(user);

    // Populate checklist from DB of user
    populateChecklists(user);

    // Reference of user's itineraries in Firebase
    const userItinerariesRef = ref(db, `Users/${user.uid}/Itineraries`);
    get(userItinerariesRef).then((snapshot) => {
      const userItineraries = snapshot.val();

      // Display user itineraries
      displayUserItineraries(userItineraries);

      // click event listener function
      addItineraryTransition(userItineraries, "Itineraries", user.uid);
    });

    // Reference of user's bookmarked itineraries in Firebase
    const userBMItinerariesRef = ref(db, `Users/${user.uid}/Bookmarked`);
    get(userBMItinerariesRef).then((snapshot) => {
      // if no bookmarks exist, its an empty object. Else, populate it from DB
      var userBMItineraries = snapshot.val() == null ? {} : snapshot.val();

      // find all itineraries that are bookmarked true in user's itineraries
      get(ref(db, `Users/${user.uid}/Itineraries`)).then((snapshot) => {
        const itineraries = snapshot.val();

        var itinerariesKeys;
        var itinCount;

        if (itineraries == null) {
          itinCount = 0;
        }

        else {
          // Get array of user itinerary IDs from Firebase
          itinerariesKeys = Object.keys(itineraries);

          // Get number of itins
          itinCount = itinerariesKeys.length;
        }

        for (let i = 0; i < itinCount; i++) {
          // If key exists in DB and the bookmark attribute is true, we add it to object of bookmarked itineraries
          if (itineraries[itinerariesKeys[i]].bookmarked == "true") {
            userBMItineraries[itinerariesKeys[i]] = itineraries[itinerariesKeys[i]];
          }
        }

        // Display user's bookmarked itineraries
        displayUserBMItineraries(userBMItineraries);

        // click event listener function
        addItineraryTransition(userBMItineraries, "Bookmarked", user.uid);
      });

      // direct user to itinerary edit page
      document.getElementsByClassName("add-button")[0].addEventListener("click", function () {
        // user is going to itinerary edit page with no itinerary to edit. it'll be a blank template.
        localStorage.setItem("hasItinerary", "False");
      });
    });
  }
  else {
    // User is signed out
    window.location.href = "login.html";
  }
});

/** Display user's itineraries in itineraries section of itineraries page
 * 
 * @param {*} userItineraries - Object of user's itineraries retrieved from DB
 */
function displayUserItineraries(userItineraries) {

  var userItinerariesIDs;
  var itinCount;

  if (userItineraries == null) {
    itinCount = 0;
  }
  else {
    // Get array of user itinerary IDs from Firebase
    userItinerariesIDs = Object.keys(userItineraries);

    // Get number of itins
    itinCount = userItinerariesIDs.length;
  }

  // Wrapper element to store "a" HTML elements as child nodes
  var wrapperElement = document.createElement("div");

  // Carousel element to store wrapper element to be scrolled on page
  var carouselElement = document.createElement("div");

  // Assign class name of wrapper
  wrapperElement.className = "itinerary-wrapper";

  // Assign ID of carousel
  carouselElement.id = "slick-carousel-1";

  // Loop through all itineraries of users
  for (let i = 0; i < itinCount; i++) {
    // "a" HTML element
    var aElement = document.createElement("a");

    // assign itinerary information in element
    aElement.href = "itineraryDetails.html";
    aElement.id = `Itineraries-${i + 1}`;
    aElement.className = "itinerary-item";
    aElement.innerHTML = userItineraries[userItinerariesIDs[i]].name;

    aElement.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%), 
      url('${userItineraries[userItinerariesIDs[i]].image}')`;

    // Add element to carousel to be displayed 
    carouselElement.appendChild(aElement);
  }

  // add carousel to wrapper
  wrapperElement.appendChild(carouselElement);
  wrapperElement.style.margin = "auto"

  // add wrapper to container
  itineraryContainerList.appendChild(wrapperElement);


  // change display style depending on number of itins
  if (itinCount == 0) {
    const wrapperElement = document.createElement("div");
    const carouselElement = document.createElement("div");

    wrapperElement.className = "itinerary-wrapper";
    carouselElement.id = "slick-carousel-1";

    const pElement = document.createElement("p");
    pElement.id = `Itineraries-0`;
    pElement.className = "itinerary-item";
    pElement.innerText = "Itineraries are empty!"

    carouselElement.appendChild(pElement);
    wrapperElement.appendChild(carouselElement);
    itineraryContainerList.appendChild(wrapperElement);

    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    document.getElementById(`Itineraries-0`).style.flexGrow = "1";
    document.getElementById(`Itineraries-0`).style.height = "30vh";
    document.getElementById(`Itineraries-0`).style.background = "none";
    document.getElementById(`Itineraries-0`).style.backgroundColor = "#bcf0d9";
    document.getElementById(`Itineraries-0`).style.color = "black";
    document.getElementById(`Itineraries-0`).style.fontSize = "25px";
    document.getElementById(`Itineraries-0`).style.display = "flex";
    document.getElementById(`Itineraries-0`).style.alignItems = "center";
    document.getElementById(`Itineraries-0`).style.pointerEvents = "none";
  }
  if (itinCount == 1) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    document.getElementById(`Itineraries-1`).style.width = "100%";
    document.getElementById(`Itineraries-1`).style.height = "30vh";
  }
  else if (itinCount == 2) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < itinCount; i++) {
      document.getElementById(`Itineraries-${i + 1}`).style.width = "100%";
      document.getElementById(`Itineraries-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Itineraries-1`).style.marginRight = "10px";
    document.getElementById(`Itineraries-2`).style.marginLeft = "10px";
  }
  else if (itinCount == 3) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < itinCount; i++) {
      document.getElementById(`Itineraries-${i + 1}`).style.width = "100%";
      document.getElementById(`Itineraries-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Itineraries-2`).style.marginLeft = "20px";
    document.getElementById(`Itineraries-2`).style.marginRight = "20px";
  }
  else if (itinCount == 4) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < itinCount; i++) {
      document.getElementById(`Itineraries-${i + 1}`).style.width = "100%";
      document.getElementById(`Itineraries-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Itineraries-2`).style.marginLeft = "20px";
    document.getElementById(`Itineraries-2`).style.marginRight = "10px";
    document.getElementById(`Itineraries-3`).style.marginLeft = "10px";
    document.getElementById(`Itineraries-3`).style.marginRight = "20px";
  }
  else if (itinCount > 4) {
    // change height of itins displayed
    for (let i = 0; i < itinCount; i++) {
      document.getElementById(`Itineraries-${i + 1}`).style.height = "16vh";
    }

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
  }


}

/** Display user's bookmarked itineraries in bookmarked section of itineraries page
 * 
 * @param {*} userBMItineraries - Object of user's bookmarked itineraries retrieved from DB
 */
function displayUserBMItineraries(userBMItineraries) {
  var userBMItinerariesIDs = Object.keys(userBMItineraries);

  var wrapperElement = document.createElement("div");
  var carouselElement = document.createElement("div");

  wrapperElement.className = "bookmarked-wrapper";
  carouselElement.id = "slick-carousel-2";

  for (let i = 0; i < userBMItinerariesIDs.length; i++) {
    var aElement = document.createElement("a");

    aElement.href = "itineraryDetails.html";
    aElement.id = `Bookmarked-${i + 1}`;
    aElement.className = "bookmarked-item";
    aElement.innerHTML = userBMItineraries[userBMItinerariesIDs[i]].name;

    aElement.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%), 
      url('${userBMItineraries[userBMItinerariesIDs[i]].image}')`;

    carouselElement.appendChild(aElement);
  }

  wrapperElement.appendChild(carouselElement);
  wrapperElement.style.margin = "auto"


  bookmarkedContainerList.appendChild(wrapperElement);



  // change display style depending on number of itins
  const BMCount = userBMItinerariesIDs.length;
  if (BMCount == 0) {
    const wrapperElement = document.createElement("div");
    const carouselElement = document.createElement("div");

    wrapperElement.className = "bookmarked-wrapper";
    carouselElement.id = "slick-carousel-2";

    const pElement = document.createElement("p");
    pElement.id = `Bookmarked-0`;
    pElement.className = "bookmarked-item";
    pElement.innerText = "Bookmarks are empty!"

    carouselElement.appendChild(pElement);
    wrapperElement.appendChild(carouselElement);
    bookmarkedContainerList.appendChild(wrapperElement);

    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    document.getElementById(`Bookmarked-0`).style.flexGrow = "1";
    document.getElementById(`Bookmarked-0`).style.height = "30vh";
    document.getElementById(`Bookmarked-0`).style.background = "none";
    document.getElementById(`Bookmarked-0`).style.backgroundColor = "#bcf0d9";
    document.getElementById(`Bookmarked-0`).style.color = "black";
    document.getElementById(`Bookmarked-0`).style.fontSize = "25px";
    document.getElementById(`Bookmarked-0`).style.display = "flex";
    document.getElementById(`Bookmarked-0`).style.alignItems = "center";
    document.getElementById(`Bookmarked-0`).style.pointerEvents = "none";
  }
  else if (BMCount == 1) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    document.getElementById(`Bookmarked-1`).style.flexGrow = "1";
    document.getElementById(`Bookmarked-1`).style.height = "30vh";
  }
  else if (BMCount == 2) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < BMCount; i++) {
      document.getElementById(`Bookmarked-${i + 1}`).style.width = "100%";
      document.getElementById(`Bookmarked-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Bookmarked-1`).style.marginRight = "10px";
    document.getElementById(`Bookmarked-2`).style.marginLeft = "10px";
  }
  else if (BMCount == 3) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < BMCount; i++) {
      document.getElementById(`Bookmarked-${i + 1}`).style.width = "100%";
      document.getElementById(`Bookmarked-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Bookmarked-2`).style.marginLeft = "20px";
    document.getElementById(`Bookmarked-2`).style.marginRight = "20px";
  }
  else if (BMCount == 4) {
    carouselElement.style.display = "flex";
    carouselElement.style.flexDirection = "row";
    for (let i = 0; i < BMCount; i++) {
      document.getElementById(`Bookmarked-${i + 1}`).style.width = "100%";
      document.getElementById(`Bookmarked-${i + 1}`).style.height = "30vh";
    }
    document.getElementById(`Bookmarked-2`).style.marginLeft = "20px";
    document.getElementById(`Bookmarked-2`).style.marginRight = "10px";
    document.getElementById(`Bookmarked-3`).style.marginLeft = "10px";
    document.getElementById(`Bookmarked-3`).style.marginRight = "20px";
  }
  else if (BMCount == 5 || BMCount == 6) {
    // change height of itins displayed
    for (let i = 0; i < BMCount; i++) {
      document.getElementById(`Bookmarked-${i + 1}`).style.height = "16vh";
    }

    $('#slick-carousel-2').slick({
      rows: 2,
      dots: false,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 3
    });
  }
  else if (BMCount > 6) {
    // change height of itins displayed
    for (let i = 0; i < BMCount; i++) {
      document.getElementById(`Bookmarked-${i + 1}`).style.height = "16vh";
    }

    // Settings for itineraries carousel 
    $('#slick-carousel-2 ').slick({
      rows: 2,
      dots: false,
      arrows: true,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 3
    });
  }
}

/** Function that handles transition from itineraries page to itinerary details page
 * 
 * @param {*} userItineraries - Object of user's itineraries
 * @param {*} htmlID - ID of the HTML element clicked on. Labeled as either "Bookmarked-#" or "Itineraries-#"
 * @param {*} userID - ID of user loggined in currently
 */
function addItineraryTransition(userItineraries, htmlID, userID) {
  var userItinerariesIDs;
  var itinCount;

  if (userItineraries == null) {
    itinCount = 0;
  }
  else {
    // Get array of user itinerary IDs from Firebase
    userItinerariesIDs = Object.keys(userItineraries);

    // Get number of itins
    itinCount = userItinerariesIDs.length;
  }

  for (let i = 0; i < itinCount; i++) {
    document.getElementById(`${htmlID}-${i + 1}`).addEventListener("click", function (e) {
      e.preventDefault();

      // Loop through all bookmarked itineraries to see if the itinerary clicked on is in the bookmarked section
      get(ref(db, `Users/${userID}/Bookmarked`)).then((snapshot) => {
        const IDKeys = Object.keys(snapshot.val());

        if (IDKeys.find(key => key == userItinerariesIDs[i]) != undefined) {
          // Set path to  bookmarked itinerary from DB
          localStorage.setItem("itineraryPath", `Users/${userID}/Bookmarked/${userItinerariesIDs[i]}`)
          window.location.href = "itineraryDetails.html";
        }
      })

      // Loop through all user's itineraries to see if the itinerary clicked on is in the itineraries section
      get(ref(db, `Users/${userID}/Itineraries`)).then((snapshot) => {
        const IDKeys = Object.keys(snapshot.val());

        if (IDKeys.find(key => key == userItinerariesIDs[i]) != undefined) {
          // Set path to itinerary from DB
          localStorage.setItem("itineraryPath", `Users/${userID}/Itineraries/${userItinerariesIDs[i]}`)
          window.location.href = "itineraryDetails.html";
        }
      })
    });
  }
}

// populates checklists with thier items from database 
function populateChecklists(user) {

  // read and display pretrip item from database 
  const pretripChecklist = ref(db, 'Users/' + user.uid + "/Checklist/preTrip/");
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
            remove(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + div.textContent.slice(0, -1).trim()));
          } else {
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";
            remove(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + div.textContent.slice(0, -1).trim()));
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
  const posttripChecklist = ref(db, 'Users/' + user.uid + "/Checklist/postTrip/");
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
            remove(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + div.textContent.slice(0, -1).trim()));
          } else {
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";
            remove(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + div.textContent.slice(0, -1).trim()));
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
        get(child(ref(db), `Users/${user.uid}/Checklist/preTrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = snapshot.val();

            // clear current items in HTML 
            document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";

            // if strikethrough is 0, mark as 1
            // else mark as 0
            if (Object.values(checklistItems[itemName]) == 0) {
              set(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + itemName), {
                strikethrough: 1
              });
            } else {
              set(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + itemName), {
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
        get(child(ref(db), `Users/${user.uid}/Checklist/postTrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = snapshot.val();

            // clear current items in HTML 
            document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";

            // if strikethrough is 0, mark as 1
            // else mark as 0
            if (Object.values(checklistItems[itemName]) == 0) {
              set(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + itemName), {
                strikethrough: 1
              });
            } else {
              set(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + itemName), {
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
      var inputValue = document.getElementsByClassName("pretrip-checklist-input")[0].value.trim();
      if (inputValue == "") {
        alert("Item name cannot be empty!");
      }
      else {
        // get current items in checklist
        get(child(ref(db), `Users/${user.uid}/Checklist/preTrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = Object.keys(snapshot.val());

            if (inputValue == '') {
              alert("Item name cannot be empty!");
            }
            else if (checklistItems.includes(inputValue)) {
              alert("Item is already in this checklist!")
            }
            else {
              // clear checklist before adding new item (prevent duplicate items)
              document.getElementsByClassName("pretrip-checklist")[0].innerHTML = "";

              set(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + inputValue), {
                strikethrough: 0
              });
            }
          } else {
            // first item to initialize, don't need to check for dup
            set(ref(db, 'Users/' + user.uid + "/Checklist/preTrip/" + inputValue), {
              strikethrough: 0
            });

            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
        document.getElementsByClassName("pretrip-checklist-input")[0].value = ""
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
      var inputValue = document.getElementsByClassName("posttrip-checklist-input")[0].value.trim();
      if (inputValue == "") {
        alert("Item name cannot be empty!");
      }
      else {
        // get current items in checklist
        get(child(ref(db), `Users/${user.uid}/Checklist/postTrip/`)).then((snapshot) => {
          if (snapshot.exists()) {
            const checklistItems = Object.keys(snapshot.val());

            if (inputValue == '') {
              alert("Item name cannot be empty!");
            }
            else if (checklistItems.includes(inputValue)) {
              alert("Item is already in this checklist!")
            }
            else {
              // clear checklist before adding new item (prevent duplicate items)
              document.getElementsByClassName("posttrip-checklist")[0].innerHTML = "";

              set(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + inputValue), {
                strikethrough: 0
              });
            }
          } else {
            // first item to initialize, don't need to check for dup
            set(ref(db, 'Users/' + user.uid + "/Checklist/postTrip/" + inputValue), {
              strikethrough: 0
            });

            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
        document.getElementsByClassName("posttrip-checklist-input")[0].value = ""
      }

    } else {
      // User is signed out
      console.log("not logged in");
    }
  });
}

