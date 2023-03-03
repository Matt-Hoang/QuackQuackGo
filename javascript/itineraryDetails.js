import {db, ref, onValue} from "./db.js";

// Get element of container to store location elements
const locationClass = document.getElementsByClassName("location-container")[0];

const userID = localStorage.getItem("userID");
const itineraryID = localStorage.getItem("itineraryID");

const itineraryIDRef = ref(db, `Users/${userID}/Itineraries/${itineraryID}`);
onValue(itineraryIDRef, (snapshot) => {
  const itineraryInfo = snapshot.val();
  
  console.log(itineraryInfo)

  displayInfo(itineraryInfo);
  displayLocations(itineraryInfo.locationList);
})

function displayInfo(itineraryInfo)
{
  // Get element of each date and name
  const title = document.getElementById("trip-name");
  const origin = document.getElementById("origin-location-name");
  const date = document.getElementById("itinerary-date-interval");

  // Set date and name with information from ID in database
  title.innerText = itineraryInfo.name;
  date.innerText = itineraryInfo.duration.start + " - " + itineraryInfo.duration.end;
}

function displayLocations(locationList)
{
  const locationIDs = Object.keys(locationList);

  // Get array of locations in itinerary  
  for (let i = 0; i < locationIDs.length; i++)
  {
    // Create "div element"
    var element = document.createElement("div");

    // Assign name of div element class
    element.className = "location-item";

    // Insert nested HTML into div element with corresponding name, address, and date
    element.innerHTML =`<div class="decoration">
                            <img src="images/pin-logo.png" alt="">
                            <div></div>
                        </div>
                        <div class="details">
                            <h4>${locationList[locationIDs[i]].name}</h4>
                            <div>
                                <img src="images/pin-logo.png" alt="">
                                <h5>${locationList[locationIDs[i]].address}</h5> 
                            </div>
                            <div>
                                <img src="images/calendar-logo.png" alt="">
                                <h5>${locationList[locationIDs[i]].date}</h5>
                            </div>
                        </div>`
    
    // Append div element class to container
    locationClass.appendChild(element);
  }
}

function displayCurrentLocation()
{
  // Get HTML element that contains image src
  const decoration = locationClass.children[0].getElementsByClassName("decoration");
  var decorationImage = decoration[0].children[0];

  // Set image of duck.png while every other location has pin
  decorationImage.src = "images/ducky.png";
}