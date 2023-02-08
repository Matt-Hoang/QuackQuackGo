import {ref, onValue, update, increment } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import db from "./db.js";

// List of all elements inside the trending-locations class div
const trendingLocationList = document.getElementsByClassName("trending-locations")[0].children;

// List of all elements inside the new-itineraries class div
const newItineraryList = document.getElementsByClassName("new-itineraries")[0].children;

const userID = "test123";

// Retrieve a reference from database of all locations in the database.
const locationRef = ref(db, "Locations");
onValue(locationRef, (snapshot) => {
  // Sort locations by number of clicks from greatest to least (returns a JSON formatted object)
  const locations = sortClicks(snapshot.val());
  displayTrendingLocations(locations);
})

// Retrieve a reference from database of all itineraries in database
const itineraryRef = ref(db, "Itinerary");
onValue(itineraryRef, (snapshot) => {
  // Sort itineraries by number of clicks from greatest to least
  const itineraries = sortClicks(snapshot.val());
  displayExploreLocations(itineraries);
})

// Retrieve a reference user's itineraries from their account in the database
const tripDisplayRef = ref(db, "Users/" + userID + "/Itineraries");
onValue(tripDisplayRef, (snapshot) => {
  const userTrips = snapshot.val(); 
  displayTrips(userTrips);
})

/** Sorts a list of locations by number of clicks from greatest to least
 * 
 * @param {*} userTrips - a JSON-formatted object of itineraries a given user has 
 * @returns a JSON-formatted object sorted in order by number of clicks
 */
function sortClicks(userTrips)
{
  var sortedData = {};
  Object.keys(userTrips).sort(function(a, b){
        return userTrips[b].Clicks - userTrips[a].Clicks;
    })
    .forEach(function(key) {
      sortedData[key] = userTrips[key];
    });

  return sortedData;
}

/** Displays top 3 locations on the homepage
 * 
 * @param {*} locations - a JSON-formatted object of locations in the database
 */
function displayTrendingLocations(locations) 
{  
  // Get list of location names from locations dictionary
  const locationNames = Object.keys(locations);

  for (let i = 0; i < 3; i++)
  {
    // Get each element's ID 
    var location = document.getElementById(`trending-locations-${i + 1}`);
    
    // Assign location name to element
    location.innerHTML = locationNames[i];

    // Assign location image and CSS styling
    location.style.margin = "0px 25px";
    location.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 35%), 
    url('${locations[locationNames[i]].Image}')`;
  }
}

/**
 * 
 * @param {*} itineraries - a JSON-formatted object of popular itineraries in the database
 */
function displayExploreLocations(itineraries)
{
  // Get list of itinerary names from itineraries dictionary
  const itineraryNames = Object.keys(itineraries);

  for (let i = 0; i < 4; i++)
  {
    // Get itinerary element
    var itinerary = document.getElementById(`new-itineraries-${i + 1}`);

    // Get itinerary's title element
    var title = document.getElementById(`new-itineraries-${i + 1}-title`);

    // Get itinerary's rating element
    var rating = document.getElementById(`new-itineraries-${i + 1}-rating`);

    // Assign title from itinerary list
    title.innerHTML = itineraryNames[i];

    // Assign rating from itineraries object
    rating.innerHTML = Number(itineraries[itineraryNames[i]]["Rating"]).toPrecision(2);

    // Assign location image and CSS styling
    itinerary.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 35%), 
    url('${itineraries[itineraryNames[i]].Image}')`;
  }
}

/** Display user's account and profile picture
 * 
 * @param {*} accountID - ID of a user's account
 */
function displayAccount(accountID)
{
  // Reference of a user's account information from the database
  const accountRef = ref(db, `Users/${accountID}/AccountInfo`);

  onValue(accountRef, (snapshot) => {
    // Retrieve user's account information as object
    const data = snapshot.val();    

    // Image element of profile picture
    var image = document.getElementById("profile-info-picture");

    // Assign picture's src to picture from user's account information
    image.src = data["ProfilePicture"];

    // Display user's full name next to profile picture
    image.insertAdjacentText("afterend", data["FullName"])
  })
}

/** Display all upcoming trips of that user
 * 
 * @param {*} trips - An object of upcoming trips from the user 
 */
function displayTrips(trips)
{
  // Get keys of trip names from object 
  const tripNames = Object.keys(trips);

  for (let i = 0; i < tripNames.length; i++)
  {
    // Image element 
    var image = document.getElementById(`trip-picture-${i + 1}`);

    // Format date
    const date = trips[tripNames[i]].Duration.Start + " - " + trips[tripNames[i]].Duration.End;
    
    // Set image
    image.src = trips[tripNames[i]].Image;

    // Set name of trip and duration
    document.getElementById(`trip-${i + 1}-title`).innerHTML = tripNames[i];
    document.getElementById(`duration-trip-${i + 1}`).innerHTML = date;
  }
}

/** When a location or itinerary is clicked on, it updates the number of clicks that location or itinerary has
 * 
 * @param {*} elementList - List of elements for a given class element
 * @param {*} className - Name of the class element
 */
function increaseClicks(elementList, className)
{
  var locationElement;
  var clickRef;

  for (let i = 0; i < elementList.length; i++)
  {
    // EventListner for clicks based on element ID
    document.getElementById(elementList[i].id).addEventListener("click", function(e) {
      e.preventDefault();
      
      // Checks if className is a trending location or new itinerary
      if (className == "trending-locations")
      {
        // Get location name
        locationElement = document.getElementById(elementList[i].id).innerHTML;

        // Get reference of location
        clickRef = `Locations/${locationElement}`;
      }
      else
      {
        locationElement = document.getElementById(`new-itineraries-${i + 1}-title`).innerHTML;
        clickRef = `Itinerary/${locationElement}`;
      }

      console.log(`Now adding click to ${locationElement}`);
      
      // Update click method
      updateClick(`${clickRef}/Clicks`);

      console.log("Click Successfully added!");
    })
  }
}

/** Updates number of clicks for a given location or itinerary using Firebase Realtime Database
 * 
 * @param {*} locationRef - Reference of location or itinerary's click in database
 */
function updateClick(locationRef)
{
  var updates = {};
  updates[locationRef] = increment(1);

  update(ref(db), updates);
}

// Method calls
increaseClicks(trendingLocationList, "trending-locations");
increaseClicks(newItineraryList, "new-intineraries")
displayAccount(userID);