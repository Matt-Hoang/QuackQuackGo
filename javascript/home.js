import {db, ref, onValue, update, increment, get, onAuthStateChanged, auth} from "./db.js";

onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    const userID = user.uid;

    // display user account information
    displayAccount(userID);

    const userRef = ref(db, "Users");
    get(userRef).then((snapshot) => {
      const users = snapshot.val();
      var itinerariesList = getAllItineraries(users);

      displayTrendingLocations(itinerariesList, userID);
      displayExploreLocations(itinerariesList, userID);
    })

    const tripDisplayRef = ref(db, "Users/" + userID + "/Itineraries");
    get(tripDisplayRef).then((snapshot) => {
      const userTrips = snapshot.val(); 
      displayTrips(userTrips);
    });
  }
  else
  {
    window.location.href = "login.html";
  }
});

function displayAccount(accountID)
{
  // Reference of a user's account information from the database
  const accountRef = ref(db, `Users/${accountID}/AccountInfo`);

  get(accountRef).then((snapshot) => {
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
function displayTrendingLocations(itinerariesList, userID) 
{   
  itinerariesList = sortClicks(itinerariesList);
  const top3Itineraries = itinerariesList.toSpliced(3);

  console.log(top3Itineraries)
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
  for (let i = 0; i < newItineraryList.length; i++)
  {
    const randomItinerary = Math.floor(Math.random() * newItineraryList.length);

    newItineraryList[i].id = itineraries[randomItinerary][0];

    var itinerary = document.getElementById(newItineraryList[i].id);
    var title = document.getElementById(`new-itineraries-${i + 1}-title`);
    var rating = document.getElementById(`new-itineraries-${i + 1}-rating`);

    // Assign title from itinerary list
    title.innerHTML = itineraries[randomItinerary][1].name;

    // Assign rating from itineraries object
    rating.innerHTML = Number(itineraries[randomItinerary][1].stats.rating).toPrecision(2);

    // Assign location image and CSS styling
    itinerary.style.backgroundImage = `url('${itineraries[randomItinerary][1].image}')`;

    itineraries.splice(randomItinerary, 1);

    document.getElementById(newItineraryList[i].id).addEventListener("click", function(e) {
      e.preventDefault();

      console.log("Clicked!");

      retrieveUserID(newItineraryList[i].id).then(
        function(value)
        {
          var userIDItinerary = value;
          var updates = {};

          console.log(userIDItinerary);

          updates[`Users/${userIDItinerary}/Itineraries/${newItineraryList[i].id}/stats/clicks`] = increment(1);

          update(ref(db), updates);
          
          localStorage.setItem("itineraryID", String(newItineraryList[i].id));
          localStorage.setItem("userIDItinerary", String(userIDItinerary));

          window.location.href = "itineraryDetails.html";
        },
        function(error)
        {
          console.error(error);
        }
      )
    });
  }
}

/** Display all upcoming trips of that user
 * 
 * @param {*} accountTrips - An object of upcoming trips from the user 
 */
function displayTrips(accountTrips)
{
  const itineraryIDs = Object.keys(accountTrips);

  var rightColumnHome = document.getElementsByClassName("home-right-column")[0].children;
  var upcomingTripElement = rightColumnHome[2];

  for (let i = 0; i < itineraryIDs.length; i++)
  {
    var aElement = document.createElement("a");
    aElement.href = "";
    aElement.id = `trip-${i + 1}`;
    aElement.innerHTML = `<img src="" id="trip-picture-${i + 1}" alt="">
                          <div>
                              <h4 id="trip-${i + 1}-title"></h4>
                              <h5 id="duration-trip-${i + 1}"></h5>
                          </div>`;
    
    upcomingTripElement.appendChild(aElement);

    // Image element 
    var image = document.getElementById(`trip-picture-${i + 1}`);
    
    // Format date
    const date = accountTrips[itineraryIDs[i]].duration.start + " - " + accountTrips[itineraryIDs[i]].duration.end;
    
    // Set image
    image.src = accountTrips[itineraryIDs[i]].image;

    // Set name of trip and duration
    document.getElementById(`trip-${i + 1}-title`).innerHTML = accountTrips[itineraryIDs[i]].name;
    document.getElementById(`duration-trip-${i + 1}`).innerHTML = date;
  }
}

function getAllItineraries(users)
{
  const userIDs = Object.keys(users);
  var itinerariesList = [];

  for(let i = 0; i < userIDs.length; i++)
  {
    var itineraries = Object.entries(users[userIDs[i]].Itineraries);

    for(let i = 0; i < itineraries.length; i++)
    {
      itinerariesList.push(itineraries[i]);
    }
  }

  return itinerariesList;
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
function increaseLocationClicks(elementList)
{
  for (let i = 0; i < elementList.length; i++)
  {
    // EventListner for clicks based on element ID
    document.getElementById(elementList[i].id).addEventListener("click", function(e) {
      e.preventDefault();

      // Get location name based on ID
      var name = document.getElementById(elementList[i].id).innerHTML;
      
      // The "Consuming code" of a Promise
      retrieveLocation(ref(db, tableRef), name).then(
        function(value) 
        {
          // Get 0th element of object, which is the highest click count location
          var location = Object.keys(value)[0];
          
          console.log(`Now adding click to ${name}!`);

          // Update click in Firebase
          updateClick(`${tableRef}/${location}/stats/clicks`);
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

function retrieveUserID(itineraryID)
{
  let promise = new Promise(function(resolve, reject) {
    onValue(ref(db, "Users"), (snapshot) => {
      var users = Object.entries(snapshot.val());
      var foundUserID = "";

      for(let i = 0; i < users.length; i++)
      {
        const userItinerary = Object.entries(users[i][1].Itineraries);
  
        for(let j = 0; j < userItinerary.length; j++)
        {
          if (itineraryID == String(userItinerary[j][0]))
          {
            foundUserID = users[i][0];
          }
        }
      }
      try
      {
        resolve(foundUserID);
      }
      catch(error)
      {
        reject(error)
      }
    })
  })

  return promise;
}