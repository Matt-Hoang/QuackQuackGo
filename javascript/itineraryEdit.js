import {push, update, ref, query, db, limitToLast, get, remove, onAuthStateChanged, auth} from "./db.js";

var closeloc = document.getElementsByClassName("close-loc");
var hamlist = document.getElementsByClassName("hamburger");
var add = document.getElementsByClassName("add-loc");
var container = document.getElementsByClassName("itinerary-locs");

const hasItinerary = localStorage.getItem("hasItinerary");
const path = localStorage.getItem("dbPath");

/*
Path can be one of two things:
  - Bookmarked (Users/${userID}/Bookmarked)
  - its own itinerary (Users/${userID}/Itineraries)


Bookmarking works like this:
  - Users are able to bookmark their own itineraries or other itineraries found in the explore/trending page
  - There has to be a bookmark attribute for each itinerary in the DB
  - If a user clicks on a bookmarked itinerary from the bookmarked section, itinerary details and edit has to know that its a bookmark
  - when user clicks on itinerary on homepage, maybe show a non-editable version of the itinerary and make it editable until they bookmark it?


*/

console.log(hasItinerary)
onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    // Get user ID of user logged in
    const userID = localStorage.getItem("userID") == null ? localStorage.getItem("userID") : user.uid;

    console.log(userID)
    add[0].onclick = function() {
      addLocationElement("", "", "", "", container);
      deleteLocation();
    }

    /*== END OF CODE BLOCK BY MARIEL URBANO ==*/

    // If user clicks "edit" on an itinerary, we load it into itinerary creation page
    if (hasItinerary == "True")
    {
      // Get user ID
      const userID = localStorage.getItem("userIDItinerary");

      // Get itinerary ID from itineraries.js
      const itineraryID = localStorage.getItem("itineraryID");
    
      console.log(userID);
      console.log(itineraryID);

      // Itinerary is already made. User is editing it
      displayItineraryInfo(userID, itineraryID);
    }

    // Default to user clicks on "create itinerary" from homepage or the "+" symbol in itineraries page
    // Action is for saving an itinerary into the DB regardless of whether itinerary was made prior or not
    document.getElementById("save").addEventListener("click", function() {

      // Get information of itinerary
      const tripName = document.getElementById("tripName").value;
      const origin = document.getElementById("location").value;
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;
      const locations = document.getElementsByClassName("itinerary-locs")[0].children;

      // Parse information to DB
      pushUserItinerary(userID, tripName, origin, startDate, endDate);

      // If the user is editing an itinerary and presses the "save" button, it deletes the old rows in the DB
      if (hasItinerary == "True")
      {
        remove(ref(db, `Users/${userID}/Itineraries/${localStorage.getItem("itineraryID")}/locationList`));
      }

      // Get information of locations from itinerary
      for(let i = 0; i < locations.length; i++)
      {
        const locationName = locations[i].getElementsByClassName(`loc-title`)[0].innerHTML;
        const locationAddress = locations[i].getElementsByClassName(`location-address`)[0].innerHTML;
        const dateTime = locations[i].getElementsByClassName(`loc-datetime`)[0].value.split("T");

        // Parse information to DB
        pushLocationOfItinerary(userID, locationAddress, locationName, dateTime[0], dateTime[1]);
      }
    });
  }
});


/** Display information of an existing itinerary and its locations
 * 
 * @param {*} userID - User ID of user from DB
 * @param {*} itineraryID - ID of itinerary from DB
 */
function displayItineraryInfo(userID, itineraryID)
{
  // Reference to itinerary in DB
  const itineraryInfoRef = ref(db, `Users/${userID}/Itineraries/${itineraryID}`);

  // Reference to locations of itinerary in DB
  const locationListRef = ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList`);

  get(itineraryInfoRef).then((snapshot) => {
    // Get object-formatted information of itinerary
    const itineraryInfo = snapshot.val();

    // Assign itinerary info for header
    document.getElementById("tripName").value = itineraryInfo["name"];
    document.getElementById("location").value = itineraryInfo["origin"];
    document.getElementById("start-date").value = itineraryInfo["duration"].start;
    document.getElementById("end-date").value = itineraryInfo["duration"].end;
  });

  get(locationListRef).then((snapshot) => {
    // Get object-formatted information of locations in itinerary
    const locationList = snapshot.val();

    // Only displays itinerary when there is locations in the itinerary
    if (locationList != null)
    {
      // Array of location IDs
      const locationIDs = Object.keys(locationList);

      for (let i = 0; i < locationIDs.length; i++)
      {
        // Assign location information from DB onto page
        const title = locationList[locationIDs[i]].locationName;
        const address = locationList[locationIDs[i]].address;
        const date = locationList[locationIDs[i]].date;
        const time = locationList[locationIDs[i]].time;

        // Add location HTML element for each location in itinerary
        addLocationElement(title, address, date, time, container)
      }

      deleteLocation(); 
    }
  }); 
}

/** Push itinerary information excluding locations to DB
 * 
 * @param {*} userID - ID of user
 * @param {*} name - Name of itinerary
 * @param {*} origin - Starting location
 * @param {*} startDate - Date that trip starts
 * @param {*} endDate - Date that trip ends
 */
function pushUserItinerary(userID, name, origin, startDate, endDate)
{
  // If itinerary exists, we want to update existing information with new information
  if (hasItinerary == "True")
  {
    update(ref(db, `Users/${userID}/Itineraries/${String(localStorage.getItem("itineraryID"))}`), {
      "image": "images/defaults/default-itineraries-background.png",
      "name": name,
      "origin": origin,
      "duration": {
        "start": startDate,
        "end": endDate
      }
    });
  }
  else
  {
    // If itinerary doesn't exist, we want to add it to DB
    push(ref(db, `Users/${userID}/Itineraries`), {
      "image": "images/defaults/default-itineraries-background.png",
      "name": name,
      "origin": origin,
      "locationList": "",
      "stats": {
        "clicks": 0,
        "totalCost": 0.0      
      }
    });

    // Push in start and end dates
    get(query(ref(db, `Users/${userID}/Itineraries`), limitToLast(1))).then((snapshot) => {
      const itineraryID = Object.keys(snapshot.val())[0];
      update(ref(db, `Users/${userID}/Itineraries/${itineraryID}`), {
        "duration": {
          "start": startDate,
          "end": endDate
        }
      });
    });
  }
}

/** Inserts locations of an itinerary into the DB
 * 
 * @param {*} userID - ID of user
 * @param {*} address - address of location
 * @param {*} name - name of location
 * @param {*} date - ETA to location
 * @param {*} time - ETA to location
 */
function pushLocationOfItinerary(userID, address, name, date, time)
{
  // Goes to either if statement depending of user is editing an existing itinerary or creating a new itinerary
  if (hasItinerary == "True")
  {
    // Reference of list of locations in DB
    const locationListRef = ref(db, `Users/${userID}/Itineraries/${String(localStorage.getItem("itineraryID"))}/locationList`);
    var lastPushedLocationRef = query(ref(db, `Users/${userID}/Itineraries/${String(localStorage.getItem("itineraryID"))}/locationList`), limitToLast(1));

    push(locationListRef, {
      "address": address,  
      "locationName": name,
      "locationCost": 0
    });  
    
    get(lastPushedLocationRef).then((snapshot) => {
      const locationID = Object.keys(snapshot.val())[0];
      update(ref(db, `Users/${userID}/Itineraries/${String(localStorage.getItem("itineraryID"))}/locationList/${locationID}`), {
        "date": date,
        "time": time
      })
    })
  }
  else
  {
    // Get newly created itinerary from DB
    get(query(ref(db, `Users/${userID}/Itineraries`), limitToLast(1))).then((snapshot) => {
      // Get ID of itinerary from DB
      const itineraryID = Object.keys(snapshot.val())[0];
      
      // Reference to last pushed location in DB
      var pushedLocationRef = query(ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList`), limitToLast(1));
      
      // Reference to locationList in user's itineraries in DB
      const locationListRef = ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList`);
  
      push(locationListRef, {
        "address": address,  
        "locationName": name,
        "locationCost": 0
      });  
  
      get(pushedLocationRef).then((snapshot) => {
        const locationID = Object.keys(snapshot.val())[0];
        update(ref(db, `Users/${userID}/Itineraries/${itineraryID}/locationList/${locationID}`), {
          "date": date,
          "time": time
        })
      })
    })
  }
}

/** Adds blank location elements for user to manually input or existing locations from an existing itinerary
 *  FUNCTION BY TOMMY LONG
 * 
 * @param {*} title - Name of location
 * @param {*} address - Address of location
 * @param {*} date - Date of arrival to location
 * @param {*} time - ETA to location
 * @param {*} locationID - ID of location in DB
 * @param {*} itineraryID - ID of itinerary in DB
 */
function addLocationElement(title, address, date, time, container) 
{
  // Depending on whether user clicked "edit" on an itinerary or "create a new itinerary", it will display either an existing location name or default "Location Title #"
  title = title == "" ? `Location Title` : title;
  address = address == "" ? "Address" : address;
  date = date == undefined ? undefined : date;
  time = time == undefined ? undefined : time;
  
  // Create div element
  var locationElement = document.createElement("div");

  // Assign div adjustments
  locationElement.className = `location-item`;
  locationElement.draggable = true;
  locationElement.style.display = "flex";

  // Insert inner HTML of element with appropiate formatting, heading, and stylizing
  locationElement.innerHTML = `<div class="decoration">
                                  <img src="images/pin-logo.png" alt="">
                                </div>
                                <div class="details">
                                  <h4 class="loc-title">${title}</h4>
                                  <div>
                                    <img src="images/pin-logo.png" alt="">
                                      <h5 class="location-address">${address}</h5> 
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
  
  // Append to container class to display in HTML
  container[0].appendChild(locationElement);

  // Assign date and time
  document.getElementsByClassName(`loc-datetime`)[container[0].children.length - 1].value = date + "T" + time;
}

function deleteLocation()
{
  for (var i = 0; i < hamlist.length; i++) 
  {
    var but = document.createElement("button");
    var txt = document.createTextNode("\u00D7");
    but.className = "close-loc";
    but.appendChild(txt);
    hamlist[i].appendChild(but);
  }

  for (var i = 0; i < closeloc.length; i++) 
  {
    closeloc[i].onclick = function() {
      var div = this.parentElement; // hamburger div
      var sdiv = div.parentElement; // location-item div
      var cdiv = sdiv.parentElement; // location-contianer div
      cdiv.removeChild(sdiv);
    }
  }
}

/*== CODE BELOW BY MARIEL URBANO ==*/
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
/*== END OF CODE BLOCK BY MARIEL URBANO ==*/