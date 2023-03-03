import {db, ref, onValue} from "./db.js";

const itineraryContainerList = document.getElementsByClassName("itineraries-container")[0];
const bookmarkedContainerList = document.getElementsByClassName("bookmarked-container")[0];

const userID = localStorage.getItem("userID");

const userItinerariesRef = ref(db, `Users/${userID}/Itineraries`);
onValue(userItinerariesRef, (snapshot) => {
  const userItineraries = snapshot.val();
  displayUserItineraries(userItineraries);
})

const userBMItinerariesRef = ref(db, `Users/${userID}/Bookmarked`);
onValue(userBMItinerariesRef, (snapshot) => {
  const userBMItineraries = snapshot.val();
  displayUserBMItineraries(userBMItineraries);
});

function displayUserItineraries(userItineraries)
{
  var userItinerariesIDs = Object.keys(userItineraries);

  var wrapperElement = document.createElement("div");
  var carouselElement = document.createElement("div");

  wrapperElement.className = "itinerary-wrapper";
  carouselElement.id = "slick-carousel-1";

  for (let i = 0; i < userItinerariesIDs.length; i++) 
  {
    var aElement = document.createElement("a");

    aElement.href = "itineraryDetails.html";
    aElement.id = `itinerary-${i + 1}`;
    aElement.className = "itinerary-item";
    aElement.innerHTML = userItineraries[userItinerariesIDs[i]].name;

    aElement.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%), 
      url('${userItineraries[userItinerariesIDs[i]].image}')`;

    aElement.addEventListener("click", function() {
      localStorage.setItem("itineraryID", String(userItinerariesIDs[i]));
    });

    carouselElement.appendChild(aElement);
  }

  wrapperElement.appendChild(carouselElement);

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