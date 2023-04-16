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

      displayTrendingLocations(itinerariesList);
      displayExploreLocations(itinerariesList);
    })

    const tripDisplayRef = ref(db, "Users/" + userID + "/Itineraries");
    get(tripDisplayRef).then((snapshot) => {
      const userTrips = snapshot.val(); 
      displayTrips(userTrips);
    });

    document.getElementById("edit-button").addEventListener("click", function() {
      localStorage.setItem("hasItinerary", "False");
    });
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
function displayTrendingLocations(itinerariesList) 
{   
  itinerariesList = sortClicks(itinerariesList);
  
  const top3Itineraries = itinerariesList.splice(0, 3);

  for (let i = 0; i < top3Itineraries.length; i++)
  {
    // Get each element's ID 
    var location = document.getElementById(`trending-locations-${i + 1}`);
    
    // Assign location name to element
    location.innerHTML = top3Itineraries[i][1].name;

    // Assign location image and CSS styling
    location.style.backgroundImage = `url('${top3Itineraries[i][1].image}')`;

    /*
    // Assign location image and CSS styling
    location.style.margin = "0px 25px";
    location.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 35%), 
    url('${locations[locationNames[i]].Image}')`;
    */
    addClicks(top3Itineraries[i][0], `trending-locations-${i + 1}`)
  }
}

/**
 * 
 * @param {*} itineraries - a JSON-formatted object of popular itineraries in the database
 */
function displayExploreLocations(itineraries)
{
  // List of all elements inside the new-itineraries class div
  const newItineraryList = document.getElementsByClassName("new-itineraries")[0].children;
  
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
    /*
    itinerary.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 35%), 
    url('${itineraries[itineraryNames[i]].Image}')`;
    */
    itinerary.style.backgroundImage = `url('${itineraries[randomItinerary][1].image}')`;
    
    itineraries.splice(randomItinerary, 1);

    addClicks(newItineraryList[i].id, newItineraryList[i].id)
  }
}

function addClicks(itineraryID, htmlID)
{
  document.getElementById(htmlID).addEventListener("click", function(e) {
    e.preventDefault();

    console.log("Clicked!");

    retrieveUserID(itineraryID).then(
      function(value)
      {
        var userIDItinerary = value;
        var updates = {};

        console.log(userIDItinerary);

        updates[`Users/${userIDItinerary}/Itineraries/${itineraryID}/stats/clicks`] = increment(1);

        update(ref(db), updates);
        
        localStorage.setItem("itineraryID", String(itineraryID));
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

/** Display all upcoming trips of that user
 * 
 * @param {*} accountTrips - An object of upcoming trips from the user 
 */
function displayTrips(accountTrips)
{ 
  accountTrips = sortDates(accountTrips);

  var rightColumnHome = document.getElementsByClassName("home-right-column")[0].children;
  var upcomingTripElement = rightColumnHome[2];

  for (let i = 0; i < accountTrips.length; i++)
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
    
          localStorage.setItem("itineraryID", String(accountTrips[i][0]));
          localStorage.setItem("userIDItinerary", String(userIDItinerary));

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
  tripList = Object.entries(tripList);
  
  const sortedDates = function(a, b) {
    const date1 = Math.abs(new Date(a[1].duration.start) - new Date());
    const date2 = Math.abs(new Date(b[1].duration.start) - new Date());

    return date1 - date2;
  }

  return tripList.sort(sortedDates);
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
