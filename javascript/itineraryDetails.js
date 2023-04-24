import {db, ref, onValue} from "./db.js";

// Get location container element
const locationClass = document.getElementsByClassName("location-container")[0];

// Get user ID (only if user clicked on it from home.js)
const userIDItinerary = localStorage.getItem("userIDItinerary");
const itineraryID = localStorage.getItem("itineraryID");

console.log(userIDItinerary);
console.log(itineraryID)

// reference of itinerary that user clicked on in itineraries.js in Firebase
const itineraryIDRef = ref(db, `Users/${userIDItinerary}/Itineraries/${itineraryID}`);
onValue(itineraryIDRef, (snapshot) => {
  const itineraryInfo = snapshot.val();

  displayInfo(itineraryInfo);
  displayLocations(itineraryInfo.locationList);
  exportLocations(itineraryInfo.locationList);
})

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
                            <div class="location-cost">
                                <h4>$0</h4>
                            </div>
                        </div>`;
    
    // Append div element class to container
    locationClass.appendChild(element);
  }
}

document.getElementsByClassName("itin-button")[1].addEventListener("click", function() {
  localStorage.setItem("hasItinerary", "True");
  window.location.href = "itineraryEdit.html";  
});


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
