import {push, update, ref, query, db, limitToLast, get, remove, onAuthStateChanged, auth} from "./db.js";

var closeloc = document.getElementsByClassName("close-loc");
var hamlist = document.getElementsByClassName("hamburger");
var add = document.getElementsByClassName("add-loc");
var container = document.getElementsByClassName("itinerary-locs");

// true/false variable that determines whether to load in a blank template or existing itinerary to be displayed
var hasItinerary = localStorage.getItem("hasItinerary");

// path of itinerary from DB
var itineraryPath = localStorage.getItem("itineraryPath");

//localStorage.clear("itineraryPath");
console.log(itineraryPath);
console.log(hasItinerary)

onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    // Adds in blank templates for locations
    add[0].onclick = function() {
      window.location.href = "index.html";
    }

    // If user loads in pre-existing itinerary, we display it
    if (hasItinerary == "True")
    {
      document.getElementById("delete").addEventListener("click", function(e) {
        e.preventDefault();
  
        remove(ref(db, itineraryPath));
  
        alert("Itinerary deleted successfully!");
  
        window.location.href = "itineraries.html";
      });

      // Itinerary is already made. User is editing it
      displayItineraryInfo(itineraryPath);
      // add change background function here
      // Change Background Image of Itinerary
      // only shows change bg if user owns the itinerary
      document.getElementById('edit-bg').style.display = 'block';
      document.getElementById('bg-file').onchange = function (evt) {
        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;
        
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                
                document.getElementById("bg-pic").src = fr.result;
                console.log(fr.result);
                update(ref(db, itineraryPath), {
                  image: fr.result
                });
            }
            fr.readAsDataURL(files[0]);
        }
      }
      saveItinerary(user.uid)
    }
    else
    {
      add[0].style.visibility = "hidden";

      document.getElementById("delete").addEventListener("click", function(e) {
        e.preventDefault();
  
        alert("Itinerary can't be deleted because it isn't made!");
      });
      
      saveItinerary(user.uid)
    }
  }
});


function saveItinerary(userID)
{
  document.getElementById("itineraryForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const tripName = document.getElementById("tripName").value;
    const origin = document.getElementById("location").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Check for name validation: Unique names only
    get(ref(db, `Users/${userID}/Itineraries`)).then((snapshot) => {
      const itineraries = snapshot.val();
      
      var itineraryKeys;
      var itinCount;

      if (itineraries == null) {
        itinCount = 0;
      }
      else {
        // Get array of user itinerary IDs from Firebase
        itineraryKeys = Object.keys(itineraries);

        // Get number of itins
        itinCount = itineraryKeys.length;
      }

      var isUnique = true;
      var isValid = true;

      for(let i = 0; i < itinCount; i++)
      {
        // Check for same name in DB. Each itinerary should be a unique name for the user
        if (tripName == itineraries[itineraryKeys[i]].name && itineraryPath.split("/")[3] != itineraryKeys[i])
        {
          isUnique = false;
          alert("Trip name already in use! Please choose a different name.")
        }
      }

      if (isUnique)
      {
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        // Test for date validation
        if (date1.getMonth() >= date2.getMonth && date1.getDay() >= date2.getDay() && date1.getFullYear() >= date2.getFullYear())
        {
          isValid = false;
          alert("Start date can't be later than or the same date as the end date!");
        }
        
        if (isValid)
        {
          if (hasItinerary == "False")
          {
            // Parse information to DB
            pushUserItinerary(userID, tripName, origin, startDate, endDate);

            // Get location of recently pushed itinerary
            const lastPushedItin = query(ref(db, `Users/${userID}/Itineraries`), limitToLast(1));

            get(lastPushedItin).then((snapshot) => {
              // get itinerary ID
              const itinID = Object.keys(snapshot.val())[0];
              
              // We want to refresh the page when its saved correctly, so we change the localStorage IDs to the appropiate values
              hasItinerary = localStorage.setItem("hasItinerary", "True");
              itineraryPath = localStorage.setItem("itineraryPath", `Users/${userID}/Itineraries/${itinID}`);

              // Send alert of successful add
              alert("Itinerary saved successfully!")

              // Reroute to itin page
              window.location.href = "itineraries.html";
            });  
          }
          else
          {
            // If the itinerary information is accurate and meets all the requirements, we now check it for each location in the list
            const duration = [date1, date2];
            var locationDates = [];
            var isNotItineraryConflict = true;
            var isNotLocationConflict = true;
            var isNotBlank = true;

            const dates = document.getElementsByClassName(`loc-datetime`);

            const locationElements = container[0].children;

            for(let i = 0; i < locationElements.length; i++)
            {
              // ADDRESS, NAME, DATE, TIME
              const dateTime = locationElements[i].getElementsByClassName("loc-datetime")[0].value;
              
              if (dateTime.length == 0)
              {
                isNotBlank = false;
                alert("Date field is not filled all the way! Please fill them all")
              }
            }

            for(let i = 0; i < dates.length; i++)
            {
              const dateTime = dates[i].value.split("T");
              const date = new Date(dateTime);

              locationDates.push(date)
            }
            
            // Check if any location date is out the scope of the duration date
            for(let i = 0; i < locationDates.length; i++)
            {
              if (locationDates[i] < duration[0] || locationDates[i] > duration[1])
              { 
                isNotItineraryConflict = false;
                alert(`Location dates is in conflict with start or end date of itinerary!`);
                break;
              }
            }

            // Check if any location date conflicts with each other
            const sortedLocationDates = locationDates.slice().sort(function(a, b) {
              const date1 = new Date(a);
              const date2 = new Date(b);
              return date1 - date2;
            });
            
            if (!(JSON.stringify(locationDates) === JSON.stringify(sortedLocationDates)))
            {
              isNotLocationConflict = false;
              alert(`Location dates not in order! Please ensure all location dates are in order`)
            }
            
            if (isNotItineraryConflict && isNotLocationConflict && isNotBlank)
            {
              pushUserItinerary(userID, tripName, origin, startDate, endDate);

              const locationElements = container[0].children;

              if (hasItinerary == "True")
              {
                remove(ref(db, `${itineraryPath}/locationList`));
              }

              for(let i = 0; i < locationElements.length; i++)
              {
                // ADDRESS, NAME, DATE, TIME
                const locationName = locationElements[i].getElementsByClassName("loc-title")[0].innerHTML;
                const address = locationElements[i].getElementsByClassName("loc-address")[0].innerHTML;

                const dateTime = locationElements[i].getElementsByClassName("loc-datetime")[0].value;
                
                console.log(locationName, address, dateTime)

                pushLocationOfItinerary(address, locationName, dateTime.split("T")[0], dateTime.split("T")[1])
              }
              
              window.location.href = "itineraryEdit.html";
              alert("Success!");
            }           
          }
        }
      }
    });
  });
}

/** Display information of an existing itinerary and its locations
 *  FUNCTION BY TOMMY LONG
 * @param {*} itineraryPath - path of itinerary from DB
 */
function displayItineraryInfo(itineraryPath)
{
  // Reference to locations of itinerary in DB
  const locationListRef = ref(db, `${itineraryPath}/locationList`);

  get(ref(db, itineraryPath)).then((snapshot) => {
    // Get object-formatted information of itinerary
    const itineraryInfo = snapshot.val();

    // Assign itinerary info for header
    document.getElementById("tripName").value = itineraryInfo["name"];
    document.getElementById("location").value = itineraryInfo["origin"];
    document.getElementById("start-date").value = itineraryInfo["duration"].start;
    document.getElementById("end-date").value = itineraryInfo["duration"].end;
    document.getElementById("bg-pic").src = itineraryInfo["image"];
  });

  get(locationListRef).then((snapshot) => {
    const locationList = snapshot.val() == null ? {} : snapshot.val();

    const locationIDs = Object.keys(locationList);

    for (let i = 0; i < locationIDs.length; i++)
    {
      // Assign location information from DB onto page
      const title = locationList[locationIDs[i]].locationName;
      const address = locationList[locationIDs[i]].address;
      const date = locationList[locationIDs[i]].date;
      const time = locationList[locationIDs[i]].time;

      addLocationElement(title, address, date, time, container)
    }

    // Once user is done searching and adds the location to the itinerary, we add it in
    if (localStorage.getItem("title") != null && localStorage.getItem("address") != null)
    {
      // Add in location to itinerary
      addLocationElement(localStorage.getItem("title"), localStorage.getItem("address"), "", "", container);
      pushLocationOfItinerary(localStorage.getItem("address"), localStorage.getItem("title"), "", "")

      localStorage.removeItem("title");
      localStorage.removeItem("address");
    }

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

        get(ref(db, itineraryPath + "/locationList")).then((snapshot) => {
          const locations = snapshot.val();
          const locationKeys = Object.keys(locations);
          
          for(let i = 0; i < locationKeys.length; i++)
          {
            if (locations[locationKeys[i]].locationName == sdiv.children[1].children[0].innerHTML)
            {
              remove(ref(db, itineraryPath + `/locationList/${locationKeys[i]}`));
              break;
            }
          }

        })
        cdiv.removeChild(sdiv);
      }
    }
  }); 
}

/** Push itinerary information excluding locations to DB
 *  FUNCTION BY TOMMY LONG
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
    update(ref(db, itineraryPath), {
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
      "image": "images/defaults/default-itineraries-background.jpg",
      "name": name,
      "origin": origin,
      "locationList": "",
      "stats": {
        "clicks": 0,
        "totalCost": 0.0,
        
      },
      "bookmarked": "false"
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
 *  FUNCTION BY TOMMY LONG
 * @param {*} userID - ID of user
 * @param {*} address - address of location
 * @param {*} name - name of location
 * @param {*} date - ETA to location
 * @param {*} time - ETA to location
 */
function pushLocationOfItinerary(address, name, date, time)
{
  
  // Reference of list of locations in DB
  const locationListRef = ref(db, `${itineraryPath}/locationList`);
  
  push(locationListRef, {
    "address": address,  
    "locationName": name,
    "locationCost": 0,
    "date": date,
    "time": time
  });  
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
  locationElement.className = `itinerary-edit-location-item`;
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
                                      <h5 class="loc-address">${address}</h5> 
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
  
  console.log(container)
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
