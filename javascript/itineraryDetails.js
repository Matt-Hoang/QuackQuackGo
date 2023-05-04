import {db, ref, onValue, onAuthStateChanged, auth, push, get, query, remove, limitToLast, update} from "./db.js";

// Get location container element
const locationClass = document.getElementsByClassName("location-container")[0];
const itineraryPath = localStorage.getItem("itineraryPath");
const bookmark = document.getElementsByClassName("itin-bookmark")[0];

onAuthStateChanged(auth, (user) => {
  if (user) 
  {
    /*
    Display whether an itinerary is bookmarked or not by the user. We check if user's ID is the same as the user ID shown in itineraryPath. 
    We do this for one of two reasons:
      - User accesses itinerary from itineraries page and those itineraries are the user's own itineraries bookmarked or not
      - User accesses itinerary from homepage that may or may not be their itinerary
    */
    if (user.uid == itineraryPath.split("/")[1])
    {
      // If the DB path is from the bookmarked section, display it as bookmarked by default
      if (itineraryPath.split("/")[2] == "Bookmarked")
      {
        // Make bookmark filled
        bookmark.style.backgroundImage = `url("images/bookmark-filled.png")`;
      }
      else
      {
        // If the DB path is not from the bookmarked section, we check the itineraries section of the DB of the user
        get(ref(db, itineraryPath)).then((snapshot) => {
          const itinerary = snapshot.val();
  
          bookmark.style.backgroundImage = itinerary["bookmarked"] == "true" ? `url("images/bookmark-filled.png")`: `url("images/bookmark-empty.png")`;
        })
      }
    }
    else{
      bookmark.style.backgroundImage = `url("images/bookmark-empty.png")`
    }

    // Only show edit button for user's own itineraries, whether its bookmarked or not
    get(ref(db, `Users/${user.uid}/Itineraries`)).then((snapshot) => {
      const itinerariesKeys = Object.keys(snapshot.val());

      // Check if ID of itinerary ID matches up with user's own itinerary IDs
      if (itinerariesKeys.find(id => id == itineraryPath.split("/")[3]) != undefined)
      {
        displayEditButton();
      }
    })
    
    // reference of itinerary that user clicked on in itineraries.js in Firebase
    const itineraryIDRef = ref(db, itineraryPath);
    onValue(itineraryIDRef, (snapshot) => {
      const itineraryInfo = snapshot.val();

      displayInfo(itineraryInfo);
      displayLocations(itineraryInfo.locationList, user.uid);
      editCostInput();
      exportLocations(itineraryInfo.locationList);
      
    });


    // Bookmark click event listener
    document.getElementsByClassName("itin-bookmark")[0].addEventListener("click", function(e) {
      e.preventDefault();

      // If bookmark is not filled out, we bookmark the itinerary
      if (bookmark.style.backgroundImage != `url("images/bookmark-filled.png")`)
      {
        // Fill in  bookmark
        bookmark.style.backgroundImage = `url("images/bookmark-filled.png")`;

        // Get path to information of itinerary
        get(ref(db, itineraryPath)).then((snapshot) => {
          const itineraryInfo = snapshot.val();

          // Add itinerary to bookmarked column or itineraries column depending on if it's the user's own itineraries or not.
          addBookmarkedItinerary(user.uid, itineraryInfo, itineraryPath);

          // If the ID of the user is not the same as the user ID in itineraryPath, we add in locations
          if (user.uid != itineraryPath.split("/")[1])
          {
            const locationKeys = Object.keys(itineraryInfo["locationList"]);

            for(let i = 0; i < locationKeys.length; i++)
            {
              addLocationBookmarked(user.uid, itineraryInfo["locationList"][locationKeys[i]]);
            }
            
            window.location.href = "itineraries.html";
          }
          
          // Direct back to itineraries page
          window.location.href = "itineraries.html";

          // Alert message to show task is successfully done
          alert("Bookmarked Successfully!"); 
        });
      }
      else
      {
        // If the itinerary is bookmarked when we load in the itinerary details page and we want to unbookmark it, we have to remove it from the DB
        if (itineraryPath.split("/")[2] == "Bookmarked")
        {
          // Remove itineraries from bookmarked column in DB
          remove(ref(db, itineraryPath));
        }
        else
        {
          // If a user's itinerary is bookmarked and its unbookmarked, we change its bookmarked variable to "false"
          update(ref(db, itineraryPath), {
            "bookmarked": "false"
          });
        }

        // Unfill bookmark button
        bookmark.style.backgroundImage = `url("images/bookmark-empty.png")`;

        window.location.href = "itineraries.html";

        alert("Bookmarked successfully removed!");
      }
    })
  }
});

function totalCostCalc()
{
  const locations = locationClass.children;
  var totalCost = 0;

  for(let i = 0; i < locations.length; i++)
  {
    const locationCost = locations[i].getElementsByClassName("location-cost")[0].children[0]
    
    var cost = locationCost.placeholder == undefined ? locationCost.innerHTML : locationCost.placeholder;
  
    cost = cost.replace("$", "");

    totalCost += Number(cost);
  }

  document.getElementById("itinerary-total-cost").innerHTML = `$${totalCost}`;
  update(ref(db, itineraryPath + "/stats"), {
    "totalCost": totalCost
  });
}

function editCostInput()
{
  const locations = locationClass.children;

  for(let i = 0; i < locations.length; i++)
  {
    try
    {
      const costElement = document.getElementById(`location-cost-${i + 1}`);
      costElement.addEventListener("keypress", function(e) {
        if (e.key == "Enter")
        {
          e.preventDefault();

          var cost = costElement.value;

          console.log(cost)
          get(ref(db, itineraryPath + "/locationList")).then((snapshot) => {
            const locations = snapshot.val();
            const locationKey = Object.keys(locations)[i];

            update(ref(db, `${itineraryPath}/locationList/${locationKey}`), {
              "locationCost": cost
            });

            totalCostCalc();
          });
        }
      });
    }
    catch(error)
    {
      
    }
  }
}

/** Function that displays the edit button for users to edit their itinerary. It's only displayed for the user's own itineraries that are bookmarked or not
 * 
 * @param {*} userID - ID of user
 */
function displayEditButton()
{
  // Button container class
  const buttonContainer = document.getElementsByClassName("button-container")[0];

  // <a> element in HTML
  const aElement = document.createElement("a");

  // When clicked on, it goes to itineraryEdit.html
  aElement.href = "itineraryEdit.html";
  
  // <div> element in HTML
  const divElement = document.createElement("div");

  // Assign div element properties
  divElement.className = "itin-button";
  divElement.innerHTML = "Edit";

  // Append to <a> element
  aElement.appendChild(divElement);

  // Append to button class
  buttonContainer.appendChild(aElement);

  // edit-button click event listener
  document.getElementsByClassName("itin-button")[1].addEventListener("click", function() {
    // Lets the itinerary edit page know that the user is editing an existing itinerary
    localStorage.setItem("hasItinerary", "True");

    // Send path of itinerary to itinerary edit page
    localStorage.setItem("itineraryPath", String(itineraryPath))

    // Redirect page to itinerayEdit.html
    window.location.href = "itineraryEdit.html";  
  });
}

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
  const bg = document.getElementById("bg-pic");

  // reformat date (YYYY/MM/DD --> Month Day, Year)
  const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  
  const startDate = itineraryInfo.duration.start;
  const endDate = itineraryInfo.duration.end;

  const startMonth = months[Number(startDate.substring(startDate.indexOf("-") + 1, startDate.lastIndexOf("-")))];
  const startDay = Number(startDate.substring(startDate.lastIndexOf("-") + 1));
  const startYear = Number(startDate.substring(0, startDate.indexOf("-")));

  const endMonth = months[Number(endDate.substring(endDate.indexOf("-") + 1, endDate.lastIndexOf("-")))];
  const endDay = Number(endDate.substring(endDate.lastIndexOf("-") + 1));
  const endYear = Number(endDate.substring(0, endDate.indexOf("-")));

  // Set date and name with information from ID in database
  title.innerText = itineraryInfo.name;
  date.innerText = startMonth + " " + startDay + ", " +  startYear + " - " + endMonth + " " + endDay + ", " + endYear;
  origin.innerText = itineraryInfo.origin;
  bg.src = itineraryInfo.image;
  
  // set background image and delete css for it in css
}

/** Display all locations stored in itinerary that user clicked on in itineraries page
 * 
 * @param {*} locationList - list of locations from itinerary
 */
function displayLocations(locationList, userID)
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

    const cost = locationList[locationIDs[i]].locationCost == "" ? "$0" : `$${locationList[locationIDs[i]].locationCost}`

    if (userID == itineraryPath.split("/")[1])
    {
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
                              <input type="number" placeholder="${cost}" id="location-cost-${i + 1}"></h4></div>`;
    }
    else
    {
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
                              <h5 id="location-cost-${i + 1}">$${locationList[locationIDs[i]].locationCost}</h5>`;    
    }
    
    // Append div element class to container
    locationClass.appendChild(element);
  }
}

/** Bookmarks the main information of an itinerary.
 * 
 * @param {*} userID - ID of user
 * @param {*} itineraryInfo - information of itinerary
 * @param {*} itineraryPath - path of itinerary in DB
 */
function addBookmarkedItinerary(userID, itineraryInfo, itineraryPath)
{
  // Split path by "/" to access certain DB locations
  const pathList = itineraryPath.split("/");

  /*
  We bookmark an itinerary differently based on two different scenarios:
    - if the user ID is the same user ID in itineraryPath, we want to update the "bookmarked" variable since the itinerary does not exist in the "Bookmarked" column in the DB of a user.
      This is done to avoid updating two different paths of the same itineraries in it
    - if the user ID is not the same user ID in itineraryPath, we add its information to the "Bookmarked" section of the DB of a user
  */
  if (userID == pathList[1])
  {
    update(ref(db, itineraryPath), {
      "bookmarked": "true"
    });
  }
  else
  {
    push(ref(db, `Users/${userID}/Bookmarked`), {
      "image": itineraryInfo["image"],
      "name": itineraryInfo["name"],
      "origin": itineraryInfo["origin"],
      "locationList": "",
      "stats": {
        "clicks": itineraryInfo["stats"].clicks,
        "totalCost": itineraryInfo["stats"].totalCost  
      },
      "userID": itineraryPath.split("/")[1]  
    });

    get(query(ref(db, `Users/${userID}/Bookmarked`), limitToLast(1))).then((snapshot) => {
      const itineraryID = Object.keys(snapshot.val())[0];
      update(ref(db, `Users/${userID}/Bookmarked/${itineraryID}`), {
        duration: {
          "start": itineraryInfo["duration"]["start"],
          "end": itineraryInfo["duration"]["end"]
        }
      });
    })
  }
}

/** Function that adds in the locations of an itinerary that is going to be bookmarked
 * 
 * @param {*} userID - ID of user
 * @param {*} locationInfo - information of the location
 */
function addLocationBookmarked(userID, locationInfo)
{
  get(query(ref(db, `Users/${userID}/Bookmarked`), limitToLast(1))).then((snapshot) => {
    const itineraryID = Object.keys(snapshot.val())[0];
    
    console.log(itineraryID);
    push(ref(db, `Users/${userID}/Bookmarked/${itineraryID}/locationList`), {
      "address": locationInfo["address"],
      "date": locationInfo["date"],
      "locationCost": locationInfo["locationCost"],
      "locationName": locationInfo["locationName"],
      "time": locationInfo["time"]
    });
  });
}

var kmlData = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<kml xmlns="http://www.opengis.net/kml/2.2">' +
        '<Document>'
/*=== Export to Google Maps ===*/
function exportLocations(locationList)
{
  // Array of all location IDs from itinerary
  const locationIDs = Object.keys(locationList);
  var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15 
      });
  
  // This is the map bounds so that it can fit all the locations into view
  var bounds = new google.maps.LatLngBounds();

  // This is used to calculate the center b/w all locations
  var geocoder = new google.maps.Geocoder();
  
  // This is used to create a KML file
  
  var kml = new google.maps.KmlLayer();
  kml.setMap(map);
  var lat = 0;
  var lon = 0;
  console.log(locationIDs.length);
  // Get array of locations in itinerary  
  for (let i = 0; i < locationIDs.length; i++)
  {
    geocoder.geocode({ 'address': locationList[locationIDs[i]].address }).then(({results},k) => {
      var location = results[0].geometry.location;
      bounds.extend(location);
      var marker = new google.maps.Marker({
                  map: map,
                  position: location,
                  title: locationList[locationIDs[i]].locationName
                });
                marker.setMap(map);
      lat = lat + marker.getPosition().lat();
      lon = lon + marker.getPosition().lng();
      kmlData += '<Placemark>' +
      '<name>'+ locationList[locationIDs[i]].locationName+'</name>'+
      '<Point>' +
      '<coordinates>' + marker.getPosition().lng() + ',' + marker.getPosition().lat() +'</coordinates>' +
      '</Point>' +
      '</Placemark>';
      
      if (i == (locationIDs.length - 1)){
        kmlData += '</Document>' +'</kml>';
        var blob = new Blob([kmlData], {type: 'application/vnd.google-earth.kml+xml'});
         //console.log(kmlData);
        var url = URL.createObjectURL(blob);
        map.fitBounds(bounds);
        var link = document.getElementById('export-button');
        link.setAttribute('href', url);
        link.setAttribute('download', "itinerary.kml");
      }
    }); 
  
  }
}

