import {db, updateClick, ref, onValue} from "./db.js";

// Retrieve ID of user that just logged in
const userID = localStorage.getItem("userID");

// display user account information
displayAccount(userID);

// List of all elements inside the trending-locations class div
const trendingLocationList = document.getElementsByClassName("trending-locations")[0].children;

// List of all elements inside the new-itineraries class div
const newItineraryList = document.getElementsByClassName("new-itineraries")[0].children;

// Retrieve a reference from database of all locations in the database.
const locationRef = ref(db, "Locations");
onValue(locationRef, (snapshot) => {
  // Sort locations by number of clicks from greatest to least (returns a JSON formatted object)
  const locations = sortClicks(snapshot.val());
  displayTrendingLocations(locations);
})

// Retrieve a reference from database of all itineraries in database
const itineraryRef = ref(db, "Itineraries");
onValue(itineraryRef, (snapshot) => {
  // Sort itineraries by number of clicks from greatest to least
  const itineraries = sortClicks(snapshot.val());
  displayExploreLocations(itineraries);
})

const tripDisplayRef = ref(db, "Users/" + userID + "/Itineraries");
  onValue(tripDisplayRef, (snapshot) => {
    const userTrips = snapshot.val(); 

    if (userTrips.length > 0)
    {
      displayTrips(userTrips);
    }
  });

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
    image.src = data.profilePicture;

    // Display user's full name next to profile picture
    image.insertAdjacentText("afterend", data.fullName)
  })
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
    location.innerHTML = locations[locationNames[i]].name;

    // Assign location image and CSS styling
    location.style.backgroundImage = `url('${locations[locationNames[i]].image}')`;
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
    // Get itinerary, title, and rating element
    var itinerary = document.getElementById(`new-itineraries-${i + 1}`);
    var title = document.getElementById(`new-itineraries-${i + 1}-title`);
    var rating = document.getElementById(`new-itineraries-${i + 1}-rating`);

    // Assign title from itinerary list
    title.innerHTML = itineraries[itineraryNames[i]].name;

    // Assign rating from itineraries object
    rating.innerHTML = Number(itineraries[itineraryNames[i]].rating).toPrecision(2);

    // Assign location image and CSS styling
    itinerary.style.backgroundImage = `url('${itineraries[itineraryNames[i]].image}')`;
  }
}

/** Display all upcoming trips of that user
 * 
 * @param {*} accountTrips - An object of upcoming trips from the user 
 */
function displayTrips(accountTrips)
{
  const itineraryIDs = Object.keys(accountTrips);

  for (let i = 0; i < 2; i++)
  {
    // Image element 
    var image = document.getElementById(`trip-picture-${i + 1}`);
    
    // Format date
    const date = accountTrips[itineraryIDs[i]].duration.start + " - " + accountTrips[itineraryIDs[i]].duration.end;
    
    console.log(accountTrips[itineraryIDs[i]].image)

    // Set image
    image.src = accountTrips[itineraryIDs[i]].image;

    // Set name of trip and duration
    document.getElementById(`trip-${i + 1}-title`).innerHTML = accountTrips[itineraryIDs[i]].name;
    document.getElementById(`duration-trip-${i + 1}`).innerHTML = date;
  }
}

/** Sorts a list of locations by number of clicks from greatest to least
 * 
 * @param {*} userTrips - a JSON-formatted object of itineraries a given user has 
 * @returns a JSON-formatted object sorted in order by number of clicks
 */
function sortClicks(userTrips)
{
  var sortedTrips = {};
  var userTripKeys = Object.keys(userTrips);

  // Sort keys based on click function
  userTripKeys = userTripKeys.sort(function(a, b){return userTrips[b].stats.clicks - userTrips[a].stats.clicks;});
  userTripKeys.forEach(function(key) {sortedTrips[key] = userTrips[key];});

  return sortedTrips;
}

/** When a user clicks on a location, this function's event listener is called that handles a click event. 
 *  It retrieves an object of multiple objects with the same name of that location and increases the click count 
 *  of the location with the highest click count.
 * 
 * @param {*} elementList - List of HTML elements 
 * @param {*} tableRef - Name of table in Firebase
 */
function increaseClicks(elementList, tableRef)
{
  for (let i = 0; i < elementList.length; i++)
  {
    // EventListner for clicks based on element ID
    document.getElementById(elementList[i].id).addEventListener("click", function(e) {
      e.preventDefault();

      // Get location name based on ID
      var name = document.getElementById(elementList[i].id).innerHTML;

      // If statement is called only when it pulls a name from the Itinerary table in Firebase due to how different of a structure it has compared to Locations.
      if (tableRef == "Itineraries")
        name = document.getElementById(`new-itineraries-${i + 1}-title`).innerHTML;
      
      // The "Consuming code" of a Promise
      retrieveLocation(ref(db, tableRef), name).then(
        function(value) 
        {
          // Get 0th element of object, which is the highest click count location
          var location = Object.keys(value)[0];
          
          console.log(`Now adding click to ${name}!`);

          // Update click in Firebase
          updateClick(`${tableRef}/${location}/stats/clicks`)
        },
        function(error) 
        {
          // Function is only called if error is encounted in getting the object of same location name objects
          console.error(error);
        }
      )
    });
  }
}

/** Retrieve all entries in Firebase with the locationName parameter and 
 *  return the location with the most clicks
 * 
 * @param {*} tableRef - Reference of table in Firebase 
 * @param {*} locationName - name of the location to search up in database
 * @returns Promise object that contains an object of all locations with the locationName
 */
function retrieveLocation(tableRef, locationName)
{
  // A promise object produces code and calls code
  let promise = new Promise(function(resolve, reject) {
    // Loop through Firebase's tables
    onValue(tableRef, (snapshot) => {
      // Object to store location objects
      var locationList = {};

      // Loop through each table in Firebase
      snapshot.forEach(element => {
        // Get key of location ID
        var locationKey = element.key;

        // Compare location's name with locationName
        if (element.val().name == locationName)
        {
          // If similar, assign database object in array
          locationList[locationKey] = element.val();
        }
      });

      try
      {
        // Success in retrieving list of locations
        resolve(sortClicks(locationList));
      }
      catch(error)
      {
        // Error in retrieving list of locations
        reject(error);
      }
    });
  });

  return promise;
}


// Method calls
increaseClicks(trendingLocationList, "Locations")
increaseClicks(newItineraryList, "Itineraries")