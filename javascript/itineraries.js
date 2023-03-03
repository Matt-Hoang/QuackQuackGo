import {db, ref, onValue} from "./db.js";

// Container element of itineraries
const itineraryContainerList = document.getElementsByClassName("itineraries-container")[0];

// Container element of bookmarked itineraries
const bookmarkedContainerList = document.getElementsByClassName("bookmarked-container")[0];

// get ID of user currently logged in
const userID = localStorage.getItem("userID");

// Reference of user's itineraries in Firebase
const userItinerariesRef = ref(db, `Users/${userID}/Itineraries`);
onValue(userItinerariesRef, (snapshot) => {
  const userItineraries = snapshot.val();
  displayUserItineraries(userItineraries);
})

// Reference of user's bookmarked itineraries in Firebase
const userBMItinerariesRef = ref(db, `Users/${userID}/Bookmarked`);
onValue(userBMItinerariesRef, (snapshot) => {
  const userBMItineraries = snapshot.val();
  displayUserBMItineraries(userBMItineraries);
});

/** Display user's itineraries on itineraries page with "a" HTML elements on carousel element
 * 
 * @param {*} userItineraries - list of itineraries that the user has created
 */
function displayUserItineraries(userItineraries)
{
  // Get array of user itinerary IDs from Firebase
  var userItinerariesIDs = Object.keys(userItineraries);

  // Wrapper element to store "a" HTML elements as child nodes
  var wrapperElement = document.createElement("div");

  // Carousel element to store wrapper element to be scrolled on page
  var carouselElement = document.createElement("div");

  // Assign class name of wrapper
  wrapperElement.className = "itinerary-wrapper";

  // Assign ID of carousel
  carouselElement.id = "slick-carousel-1";

  // Loop through all itineraries of users
  for (let i = 0; i < userItinerariesIDs.length; i++) 
  {
    // "a" HTML element
    var aElement = document.createElement("a");

    // assign itinerary information in element
    aElement.href = "itineraryDetails.html";
    aElement.id = `itinerary-${i + 1}`;
    aElement.className = "itinerary-item";
    aElement.innerHTML = userItineraries[userItinerariesIDs[i]].name;

    aElement.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%), 
      url('${userItineraries[userItinerariesIDs[i]].image}')`;

    // Click listener to store itinerary ID if itinerary is clicked on in itinerary page 
    aElement.addEventListener("click", function() {
      localStorage.setItem("itineraryID", String(userItinerariesIDs[i]));
    });

    // Add element to carousel to be displayed 
    carouselElement.appendChild(aElement);
  }

  // add carousel to wrapper
  wrapperElement.appendChild(carouselElement);

  // add wrapper to container
  itineraryContainerList.appendChild(wrapperElement);

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

/** Display bookmarked itineraries that user has bookmarked
 * 
 * @param {*} userBMItineraries 
 */
function displayUserBMItineraries(userBMItineraries)
{
  var userBMItinerariesIDs = Object.keys(userBMItineraries);

  var wrapperElement = document.createElement("div");
  var carouselElement = document.createElement("div");

  wrapperElement.className = "bookmarked-wrapper";
  carouselElement.id = "slick-carousel-2";

  for (let i = 0; i < userBMItinerariesIDs.length; i++) 
  {
    var aElement = document.createElement("a");

    aElement.href = "itineraryDetails.html";
    aElement.id = `bookmarked-${i + 1}`;
    aElement.className = "bookmarked-item";
    aElement.innerHTML = userBMItineraries[userBMItinerariesIDs[i]].name;

    aElement.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%), 
      url('${userBMItineraries[userBMItinerariesIDs[i]].image}')`;

    aElement.addEventListener("click", function() {
      localStorage.setItem("itineraryID", String(userBMItinerariesIDs[i]));
    });

    carouselElement.appendChild(aElement);
  }

  wrapperElement.appendChild(carouselElement);

  bookmarkedContainerList.appendChild(wrapperElement);

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
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelectorAll('ul');
for (let i = 0; i < list.length; i++) {
  list[i].addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  }, false);
}

// Create a new list item when clicking on the "Add" button for pre-trip check list
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
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  } 
}

// Create a new list item when clicking on the "Add" button for post-trip check list
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
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  } 
}