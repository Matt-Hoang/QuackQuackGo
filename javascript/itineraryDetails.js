import {db, ref, onValue, onAuthStateChanged, auth, push, get, query, remove, limitToLast, update} from "./db.js";

// Get location container element
const locationClass = document.getElementsByClassName("location-container")[0];

onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    const itineraryPath = localStorage.getItem("itineraryPath");
    const bookmark = document.getElementsByClassName("itin-bookmark")[0];

    console.log(itineraryPath);

    // reference of itinerary that user clicked on in itineraries.js in Firebase
    const itineraryIDRef = ref(db, itineraryPath);
    onValue(itineraryIDRef, (snapshot) => {
      const itineraryInfo = snapshot.val();

      displayInfo(itineraryInfo);
      displayLocations(itineraryInfo.locationList);
    });

    document.getElementsByClassName("itin-button")[1].addEventListener("click", function() {
      localStorage.setItem("hasItinerary", "True");
      localStorage.setItem("userID", String(localStorage.getItem("userIDItinerary")))
      window.location.href = "itineraryEdit.html";  
    });
    
    document.getElementsByClassName("itin-bookmark")[0].addEventListener("click", function(e) {
      e.preventDefault();

      // Get element of each date and name
      const title = document.getElementById("trip-name").innerHTML;
      const origin = document.getElementById("origin-location-name").innerHTML;
      const date = document.getElementById("itinerary-date-interval").innerHTML.split(" ");
      const totalCost = document.getElementById("itinerary-total-cost").innerHTML.split("$");

      // If bookmark is not filled out when you press the bookmark button, we add in itinerary
      if (bookmark.style.backgroundImage != `url(images/bookmark-filled.png)`)
      {
        // Fill in bookmark button
        bookmark.style.backgroundImage = `url(images/bookmark-filled.png)`;
        
        addBookmarkedItinerary(user.uid, title, origin, date[0], date[2], totalCost[1], itineraryPath);
        
        if (user.uid != itineraryPath.split("/")[1])
        {
          // Add in locations of bookmarked itinerary
          for(let i = 0; i < locationClass.childElementCount; i++)
          {
            const locationName = document.getElementById(`location-name-${i + 1}`).innerHTML;
            const locationAddress = document.getElementById(`location-address-${i + 1}`).innerHTML;
            const locationDate = document.getElementById(`location-date-${i + 1}`).innerHTML;
            const locationCost = document.getElementById(`location-cost-${i + 1}`).innerHTML;

            addLocationBookmarked(user.uid, locationName, locationAddress, locationDate, locationCost, itineraryPath);
          }
        }
      
        alert("Bookmarked Successfully!")
      }
      else
      {
        // Unfill bookmark button
        bookmark.style.backgroundImage = `url(images/bookmark-empty.png)`;

        // Remove bookmarked itinerary from DB
        //remove(ref(db, `Users/${user.uid}/Bookmarked/${bookmarkedID}`));
      }
    })
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
                            <h4 id="location-name-${i + 1}">${locationList[locationIDs[i]].locationName}</h4>
                            <div>
                                <img src="images/pin-logo.png" alt="">
                                <h5 id="location-address-${i + 1}">${locationList[locationIDs[i]].address}</h5> 
                            </div>
                            <div>
                                <img src="images/calendar-logo.png" alt="">
                                <h5 id="location-date-${i + 1}">${locationList[locationIDs[i]].date}</h5>
                            </div>
                        </div>
                        <div class="location-cost">
                            <input type="number" placeholder="$0" id="location-cost-${i + 1}"></h4>
                        </div>`;
    
    // Append div element class to container
    locationClass.appendChild(element);
  }
}

function addBookmarkedItinerary(userID, name, origin, startDate, endDate, totalCost, itineraryPath)
{
  const pathList = itineraryPath.split("/");

  if (userID == pathList[1])
  {
    update(ref(db, itineraryPath), {
      "bookmarked": "true"
    });
  }
  else
  {
    push(ref(db, `Users/${userID}/Bookmarked`), {
      "image": "images/defaults/default-itineraries-background.png",
      "name": name,
      "origin": origin,
      "locationList": "",
      "stats": {
        "clicks": 0,
        "totalCost": totalCost    
      }
    });
    
    get(query(ref(db, `Users/${userID}/Bookmarked`), limitToLast(1))).then((snapshot) => {
      const itineraryID = Object.keys(snapshot.val())[0];
      update(ref(db, `Users/${userID}/Bookmarked/${itineraryID}`), {
        duration: {
          "start": startDate,
          "end": endDate
        }
      });
    })
  }
}

function addLocationBookmarked(userID, locationName, address, date, cost)
{
  get(query(ref(db, `Users/${userID}/Bookmarked`), limitToLast(1))).then((snapshot) => {
    const itineraryID = Object.keys(snapshot.val())[0];
    push(ref(db, `Users/${userID}/Bookmarked/${itineraryID}/locationList`), {
      "address": address,
      "date": date,
      "locationCost": cost,
      "locationName": locationName
    });
  });
  // how to get time??? maybe just display it in itindetails
}