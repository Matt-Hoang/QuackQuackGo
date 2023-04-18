import {db, ref, onValue, onAuthStateChanged, auth} from "./db.js";

// Get location container element
const locationClass = document.getElementsByClassName("location-container")[0];

onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    const userIDItinerary = localStorage.getItem("userIDItinerary");
    const itineraryID = localStorage.getItem("itineraryID");
    const isBookmarked = localStorage.getItem("isBookmarked");

    if (isBookmarked == "True")
    {
      // Show bookmarked button
    }
    else
    {
      // Show default buttton not yet bookmarked
    }

    
    
    // reference of itinerary that user clicked on in itineraries.js in Firebase
    const itineraryIDRef = ref(db, `Users/${userIDItinerary}/Itineraries/${itineraryID}`);
    onValue(itineraryIDRef, (snapshot) => {
      const itineraryInfo = snapshot.val();

      displayInfo(itineraryInfo);
      displayLocations(itineraryInfo.locationList);

      // When user bookmarks or unbookmarks an itinerary
      /*
      document.getElementByID("Some bookmark button").addEventListener("click", function() {
        if (isBookmarked == "True")
        {
          // un-bookmark it

          // Remove from user's bookmark section in DB
        }
        else
        {
          // bookmark it

          // Add to user's bookmark section in DB
        }
      })
      */
    });


    
  }
});

/** Display main information of itinerary like name of trip, duration of trip, etc
 * 
 * @param {*} itineraryInfo - information of itinerary pulled from Firebase
 */
function displayInfo(itineraryInfo)
{
  // Get element of each date and name
  const title = document.getElementById("trip-name");
  const origin = document.getElementById("origin-location-name");
  const date = document.getElementById("itinerary-date-interval");

  // Set date and name with information from ID in database
  title.innerText = itineraryInfo.name;
  date.innerText = itineraryInfo.duration.start + " - " + itineraryInfo.duration.end;
  origin.innerText = itineraryInfo.origin;
  
  // set background image and delete css for it in css
}

/** Display all locations stored in itinerary that user clicked on in itineraries page
 * 
 * @param {*} locationList - list of locations from itinerary
 */
function displayLocations(locationList)
{
  // Array of all location IDs from itinerary
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
                            <h4>${locationList[locationIDs[i]].locationName}</h4>
                            <div>
                                <img src="images/pin-logo.png" alt="">
                                <h5>${locationList[locationIDs[i]].address}</h5> 
                            </div>
                            <div>
                                <img src="images/calendar-logo.png" alt="">
                                <h5>${locationList[locationIDs[i]].date}</h5>
                            </div>
                        </div>
                        <div class="location-cost">
                            <input type="number" placeholder="$0"></h4>
                        </div>`;
    
    console.log(element)
    // Append div element class to container
    locationClass.appendChild(element);
  }
}

document.getElementsByClassName("itin-button")[1].addEventListener("click", function() {
  localStorage.setItem("hasItinerary", "True");
  localStorage.setItem("userID", String(localStorage.getItem("userIDItinerary")))
  window.location.href = "itineraryEdit.html";  
});