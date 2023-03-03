import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, query, get } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
export { push, ref, update, increment, onValue, limitToLast, query, set, get, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut };

const firebaseConfig = {
  apiKey: "AIzaSyCIe_m8KoEs0d9tucnrfTk2i9DUNT-Tul4",
  authDomain: "quackquackgo1.firebaseapp.com",
  databaseURL: "https://quackquackgo1-default-rtdb.firebaseio.com",
  projectId: "quackquackgo1",
  storageBucket: "quackquackgo1.appspot.com",
  messagingSenderId: "363901786588",
  appId: "1:363901786588:web:f5f0ce5b5bb1bcd7761719",
  measurementId: "G-K28VQ77K1M"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get Database Object with app
export const db = getDatabase(firebaseApp);

export const auth = getAuth();

export function pushAccountItinerary(accountID, itineraryName, start, end, imagePic)
{
  push(ref(db, "Users/" + accountID + "/Itineraries"), {
    "name": itineraryName,
    "duration": {
      "start": start,
      "end": end
    },
    image: imagePic
  });
}

export function pushBookmarkedItinerary(accountID, itineraryName, start, end, image)
{
  push(ref(db, "Users/" + accountID + "/Bookmarked"), {
    "name": itineraryName,
    "duration": {
      "start": start,
      "end": end
    },
    image: image
  });
}

export function pushUserItineraryLocations(accountID, itineraryID, locationName, address, date)
{
  push(ref(db, `Users/${accountID}/Itineraries/${itineraryID}/locationList`), {
    "address": address,
    "stats": {
      "clicks": 0
    },
    "image": "images/defaults/default-itineraries-background.jpg",
    "name": locationName,
    "rating": 0.0,
    "date": date
  });
}

/** When updating account information, we update it in Firebase
 * 
 * @param {*} accountID - ID of the user in Firebase
 * @param {*} profilePictureImage - User's profile picture image to upload in Firbease
 * @param {*} fullName - Full name of user
 * @param {*} username - username of user
 * @param {*} email - Email of user
 * @param {*} password - Password of user
 */
export function updateAccountInfo(accountID, profilePictureImage, fullName, username, email, password)
{
  set(ref(db, "Users/" + accountID + "/AccountInfo"), {
    "fullName": fullName, 
    "username": username, 
    "email": email, 
    "password": password, 
    "profilePicture": profilePictureImage
  });
}

/** Pushes itinerary into Firebase
 * 
 * @param {*} image - image of the itinerary
 * @param {*} itineraryName - name of the itinerary
 */
export function pushItinerary(itineraryName, image)
{
  push(ref(db, "Itineraries"), {
    "stats": {
      "clicks": 0
    },
    "image": image,
    "name": itineraryName,
    "locations": "",
    "rating": 0.0
  });
}


/** Pushes location into Firebase
 * 
 * @param {*} locationName - Name of the location
 * @param {*} image - Image of the location
 */
export function pushLocation(locationName, image)
{
  push(ref(db, "Locations"), {
    "address": "",
    "stats": {
      "clicks": 0
    },
    "image": image,
    "name": locationName,
    "rating": 0.0
  });
}

/** Updates number of clicks for a given location or itinerary using Firebase Realtime Database
 * 
 * @param {*} locationRef - Reference of location or itinerary's click in database
 */
export function updateClick(locationRef)
{
  var updates = {};
  updates[locationRef] = increment(1);

  update(ref(db), updates);
}

// Test functions to push data into Firebase programmatically

/*
pushItinerary("Anaheim Adventure", "images/temp-anaheim.png")
pushItinerary("Big Bear Trip", "images/temp-big-bear.png")
pushItinerary("CSULB", "images/temp-csulb.png")
pushItinerary("Las Vegas", "images/temp-vegas.png")
*/


/*
pushLocation("Cebu, Philippines", "images/temp-cebu-philippines.png")
pushLocation("Seoul, South Korea", "images/temp-seoul-korea.png")
pushLocation("Kyoto, Japan", "images/temp-kyoto-japan.png")
*/

//Adding in accounts


const userIDRef = query(ref(db, "Users"), limitToLast(1));

get(userIDRef).then((snapshot) => {
  const userID = Object.keys(snapshot.val())[0];
  
  /*
  pushAccountItinerary(userID, "New York Trip", "Mar. 11", "Mar. 16", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "Tokyo Trip", "Nov. 8", "Dec. 8", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "SD Road Trip", "Jan. 5", "Jan. 20", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "Orlando Theme Parks", "Jul. 4", "Jul. 4", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "Potential SF Trip", "Aug. 4", "Aug. 10", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "Manila Summer", "Oct. 12", "Oct. 31", "images/defaults/default-itineraries-background.jpg");
  pushAccountItinerary(userID, "CS BS", "Apr. 1", "Apr. 1", "images/defaults/default-itineraries-background.jpg");
  
  pushBookmarkedItinerary(userID, "Anaheim Adventure", "Jan. 1", "Jan. 1", "images/defaults/default-itineraries-background.jpg")
  pushBookmarkedItinerary(userID, "Big Bear Trip", "Feb. 1", "Feb. 1", "images/defaults/default-itineraries-background.jpg")
  pushBookmarkedItinerary(userID, "LS CS BS 2", "Mar. 1", "Mar. 1", "images/defaults/default-itineraries-background.jpg")
  pushBookmarkedItinerary(userID, "Sin City", "Apr. 1", "Apr. 1", "images/defaults/default-itineraries-background.jpg")
  */

  /*
  const itineraryID = query(ref(db, `Users/${userID}/Itineraries`), limitToLast(1));

  get(itineraryID).then((snapshot) => {
    const itineraryID = Object.keys(snapshot.val())[0];

    pushUserItineraryLocations(userID, itineraryID, "Senso-ji Temple", "3-1-1 Kudan-kita, Chiyoda-ku, Tokyo, 102-8246, Japan", "Jan. 1")
    pushUserItineraryLocations(userID, itineraryID, "Shibuya Crossing", "2 Dogenzaka, Shibuya-ku, Tokyo, 150-0043, Japan", "Jan. 3")
    pushUserItineraryLocations(userID, itineraryID, "Takeshita Street", "1 Chome Jingumae, Shibuya City, Tokyo 150-0001, Japan", "Jan. 5")
    pushUserItineraryLocations(userID, itineraryID, "Roppongi Hills Mori Tower", "6 Chrome-10-1 Roppongi, Minato City, Tokyo 106-0032, Japan", "Jan. 7")

  })
  */
  
  
})






