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

  for (let i = 0; i < 3; i++)
  {
    // Get each element's ID 
    var location = document.getElementById(`trending-locations-${i + 1}`);
    
    // Assign location name to element
    location.innerHTML = top3Itineraries[i][1].name;

    // Assign location image and CSS styling
    location.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%),
    url('${top3Itineraries[i][1].image}')`;

    addClicks(top3Itineraries[i][0], `trending-locations-${i + 1}`, userID)
  }
}

/**
 * 
 * @param {*} itineraries - a JSON-formatted object of popular itineraries in the database
 */
function displayExploreLocations(itineraries, userID)
{
  // List of all elements inside the new-itineraries class div
  const newItineraryList = document.getElementsByClassName("new-itineraries")[0].children;
  
  for (let i = 0; i < newItineraryList.length; i++)
  {
    const randomItinerary = Math.floor(Math.random() * itineraries.length);

    newItineraryList[i].id = itineraries[randomItinerary][0];

    var itinerary = document.getElementById(newItineraryList[i].id);
    var title = document.getElementById(`new-itineraries-${i + 1}-title`);

    // Assign title from itinerary list
    title.innerHTML = itineraries[randomItinerary][1].name;

    // Assign location image and CSS styling
    itinerary.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%),
    url('${itineraries[randomItinerary][1].image}')`;
    
    itineraries.splice(randomItinerary, 1);

    addClicks(newItineraryList[i].id, newItineraryList[i].id, userID)
  }
}

function addClicks(itineraryID, htmlID, user)
{
  document.getElementById(htmlID).addEventListener("click", function(e) {
    e.preventDefault();

    retrieveUserID(itineraryID).then(
      function(value)
      {
        var userIDItinerary = value;
        var updates = {};

        updates[`Users/${userIDItinerary}/Itineraries/${itineraryID}/stats/clicks`] = increment(1);

        update(ref(db), updates);
        
        // Check if itinerary already exists in user's bookmarked or itinerary section for bookmarking
        get(ref(db, `Users/${user}/Bookmarked`)).then((snapshot) => {
          const bookmarks = snapshot.val() == null ? {}: snapshot.val();
          const bookmarkIDs = Object.keys(bookmarks);

          for(let i = 0; i < bookmarkIDs.length; i++)
          {
            // Compare IDs of both itineraries
            if (bookmarks[bookmarkIDs[i]].userID == userIDItinerary)
            {
              console.log(`${bookmarks[bookmarkIDs[i]].userID} and ${userIDItinerary} are equal!`)

              get(ref(db, `Users/${userIDItinerary}/Itineraries/${itineraryID}`)).then((snapshot2) => {
                const itinerary = snapshot2.val();
                
                // Compare the name of both itineraries
                if (itinerary["name"] == bookmarks[bookmarkIDs[i]].name)
                {
                  localStorage.setItem("itineraryPath", `Users/${user}/Bookmarked/${bookmarkIDs[i]}`);
                  window.location.href = "itineraryDetails.html";
                }
              })
            }
          }

          localStorage.setItem("itineraryPath", `Users/${userIDItinerary}/Itineraries/${itineraryID}`);
          window.location.href = "itineraryDetails.html";
        })

        
      },
      function(error)
      {
        console.error(error);
      }
    )
  });
}

/** Display all upcoming trips of that user
 * 
 * @param {*} accountTrips - An object of upcoming trips from the user 
 */
function displayTrips(accountTrips)
{ 
  var tripCount;
  if (accountTrips == null) {
    tripCount = 0;
  } 
  else {
    tripCount = accountTrips.length;
  }

  accountTrips = sortDates(accountTrips);

  var rightColumnHome = document.getElementsByClassName("home-right-column")[0].children;
  var upcomingTripElement = rightColumnHome[2];

  for (let i = 0; i < tripCount; i++)
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
    const date = accountTrips[i][1].duration.start;
    
    // Set image
    image.src = accountTrips[i][1].image;

    // Set name of trip and duration
    document.getElementById(`trip-${i + 1}-title`).innerHTML = accountTrips[i][1].name;
    document.getElementById(`duration-trip-${i + 1}`).innerHTML = date;

    document.getElementById(`trip-${i + 1}`).addEventListener("click", function(e) {
      e.preventDefault();
      console.log("Clicked!");

      retrieveUserID(accountTrips[i][0]).then(
        function(value)
        {
          var userIDItinerary = value;
    
          localStorage.setItem("itineraryID", `Users/${userIDItinerary}/Itineraries/${accountTrips[i][0]}`);
          localStorage.setItem("userID", String(userIDItinerary));

          window.location.href = "itineraryDetails.html";
        },
        function(error)
        {
          console.error(error);
        }
      )
    })
  }
}

function getAllItineraries(users)
{
  const userIDs = Object.keys(users);
  var itinerariesList = [];

  for(let i = 0; i < userIDs.length; i++)
  {
    var itineraries;
    // make sure user itin is not undefined (user has no itins)
    if (users[userIDs[i]].Itineraries != undefined) {
      itineraries = Object.entries(users[userIDs[i]].Itineraries);
    }   

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
function sortClicks(itinerariesList)
{
  const sortedArray = function(a, b) {
    const click1 = a[1].stats.clicks;
    const click2 = b[1].stats.clicks;

    return click2 - click1;
  }

  itinerariesList.sort(sortedArray);
  return itinerariesList;
}

function sortDates(tripList)
{
  if (tripList != null) {
    tripList = Object.entries(tripList);  
        
    const sortedDates = function(a, b) {
      const date1 = Math.abs(new Date(a[1].duration.start) - new Date());
      const date2 = Math.abs(new Date(b[1].duration.start) - new Date());

      return date1 - date2;
    }

    return tripList.sort(sortedDates);
  }
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
        var userItinerary;
        if (users[i][1].Itineraries != undefined) {
          userItinerary = Object.entries(users[i][1].Itineraries);
        }
        
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