import {push, update, ref, query, db, limitToLast, get} from "./db.js";

const userID = localStorage.getItem("userID");
const hasItinerary = localStorage.getItem("hasItinerary");
var pushedItinerary = query(ref(db, `Users/${userID}/Itineraries`), limitToLast(1));

console.log(hasItinerary);

if (hasItinerary == "True")
{
  // Get user ID
  const userIDItinerary = localStorage.getItem("userIDItinerary");

  // Get itinerary ID from itineraries.js
  const itineraryID = localStorage.getItem("itineraryID");

  console.log(userIDItinerary);
  console.log(itineraryID);
  
  // Itinerary is already made. User is editing it
  //displayItineraryInfo(userIDItinerary, itineraryID);
}
else
{
  // Itinerary is not made at all
  document.getElementById("save").addEventListener("click", function(e) {
    const tripName = document.getElementById("tripName").value;
    const origin = document.getElementById("location").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const locations = document.getElementsByClassName("itinerary-locs")[0].children;
  
    pushUserItinerary(userID, tripName, origin, startDate, endDate);
    
    for(let i = 0; i < locations.length; i++)
    {
      const locationName = locations[i].getElementsByClassName(`loc-title`)[0].innerHTML;
      const locationAddress = locations[i].getElementsByClassName(`location-address`)[0].innerHTML;
      const dateTime = locations[i].getElementsByClassName(`loc-datetime`)[0].value.split("T");
  
      pushLocationOfItinerary(userID, locationAddress, locationName, dateTime[0], dateTime[1]);
    }
  });
}

function pushUserItinerary(userID, name, origin, startDate, endDate)
{
  push(ref(db, `Users/${userID}/Itineraries`), {
    "image": "images/defaults/default-itineraries-background.png",
    "name": name,
    "origin": origin,
    "locationList": "",
    "stats": {
      "rating": 0.0,
      "clicks": 0,
      "totalCost": 0.0
    }
  });

  get(pushedItinerary).then((snapshot) => {
    const itineraryID = Object.keys(snapshot.val())[0];
    update(ref(db, `Users/${userID}/Itineraries/${itineraryID}`), {
      "duration": {
        "start": startDate,
        "end": endDate
      }
    });
  })
}

function pushLocationOfItinerary(userID, address, name, date, time)
{
  get(pushedItinerary).then((snapshot) => {
    const itineraryID = Object.keys(snapshot.val())[0];
    const locationItineraryRef = ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList`);

    var pushedLocation = query(ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList`), limitToLast(1));

    push(locationItineraryRef, {
      "address": address,  
      "locationName": name,
      "locationCost": 0
    });  

    get(pushedLocation).then((snapshot) => {
      const locationID = Object.keys(snapshot.val())[0];
      update(ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList/${locationID}`), {
        "date": date,
        "time": time
      })
    })
  })
}

/*== adds close button to all locations ==*/
var hamlist = document.getElementsByClassName("hamburger");
for (var i = 0; i < hamlist.length; i++) {
  var but = document.createElement("button");
  var txt = document.createTextNode("\u00D7");
  but.className = "close-loc";
  but.appendChild(txt);
  hamlist[i].appendChild(but);
}

// Click on a close button to hide the location item
var closeloc = document.getElementsByClassName("close-loc");
for (var i = 0; i < closeloc.length; i++) {
  closeloc[i].onclick = function() {
    var div = this.parentElement; // hamburger div
    var sdiv = div.parentElement; // location-item div
    var cdiv = sdiv.parentElement; // location-contianer div
    cdiv.removeChild(sdiv);
  }
}

// Temporary add location item 
var add = document.getElementsByClassName("add-loc");
var container = document.getElementsByClassName("itinerary-locs");
var count = 1;
add[0].onclick = function() {
  var locationElement = document.createElement("div");
  locationElement.className = `location-item`;
  locationElement.draggable = true;
  locationElement.style.display = "flex";

  locationElement.innerHTML = `<div class="decoration">
                                  <img src="images/pin-logo.png" alt="">
                                </div>
                                <div class="details">
                                  <h4 class="loc-title">Location Title ${count}</h4>
                                  <div>
                                    <img src="images/pin-logo.png" alt="">
                                      <h5 class="location-address">Location Address</h5> 
                                  </div>
                                  <div>
                                      <img src="images/calendar-logo.png" alt="">
                                      <!-- <h5> Date and Time</h5> -->
                                      <input type="datetime-local" class="loc-datetime" required>
                                  </div>
                                </div>
                                <div class="hamburger">
                                  <img src="images/hamburger.png" alt="">
                                </div>`
  
  count += 1;
  container[0].appendChild(locationElement);
  
  // Old Code for temporarily adding items
  /*
  var node = document.getElementsByClassName("location-item");
  var clone = node[0].cloneNode(true);

  clone.style.display = "flex";

  var child = clone.getElementsByClassName("loc-title");
  var locItems = document.getElementsByClassName("location-item");

  child[0].innerHTML = "Location Title " + (locItems.length + 1);

  container[0].appendChild(clone);
  */

  for (var i = 0; i < closeloc.length; i++) 
  {
    closeloc[i].onclick = function() {
      var div = this.parentElement;
      var sdiv = div.parentElement;
      var cdiv = sdiv.parentElement; // location-contianer div
      cdiv.removeChild(sdiv);
    }
  }
  (()=> {enableDragSort('location-container')})();
}

/*== Allows drag and drop to arrange order of locations ==*/
function enableDragSort(listClass) 
{
  const sortableLists = document.getElementsByClassName(listClass);
  Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
}

function enableDragList(list) 
{
  Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
}

function enableDragItem(item) 
{
  item.setAttribute('draggable', true)
  item.ondrag = handleDrag;
  item.ondragend = handleDrop;
}

function handleDrag(item) 
{
  const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;
  
  selectedItem.classList.add('drag-sort-active');
  let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
  
  if (list === swapItem.parentNode) 
  {
    swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
    list.insertBefore(selectedItem, swapItem);
  }
}

function handleDrop(item) {
  item.target.classList.remove('drag-sort-active');
}

(()=> {enableDragSort('location-container')})();

