import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, push, ref, update, increment, onValue, set, limitToLast, query, get, orderByChild, orderByKey, orderByValue } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential,EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
export { push, ref, update, orderByChild, orderByKey, orderByValue, increment, onValue, limitToLast, query, set, get, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential,EmailAuthProvider };

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

export function createAccount(fullName, email, location, username)
{
  push(ref(db, "Users"), {
    "AccountInfo": {
      "fullName": fullName,
      "email": email,
      "location": location,
      "profilePicture": "images/profile-picture.jpeg",
      "username": username
    },
    "Bookmarked": "",
    "CheckList": "",
    "Itineraries": ""
  });
}

export function pushUserItineraryBM(userID, name, image, startDate, endDate)
{
  push(ref(db, `Users/${userID}/Bookmarked`), {
    "duration": {
      "start": startDate,
      "end": endDate
    },
    "image": image,
    "name": name,
    "locationList": "",
    "stats": {
      "rating": 0.0,
      "clicks": 0
    }
  });
}

export function pushLocation(address, image, name, rating, clicks)
{
  push(ref(db, `Locations`), {
    "address": address,
    "image": image,
    "name": name,
    "rating": rating,
    "click": clicks
  })
}

// pushUserItinerary(userID, name, image, startDate, endDate)
//pushUserItinerary( "5P1tWJRUipSv248dfuAdiLQlkpO2", "test", "test", new Date("2023-03-18"), new Date("2023-03-27"))
/*
pushLocation("Cebu, Philippines", "images/temp-cebu-philippines.png")
pushLocation("Seoul, South Korea", "images/temp-seoul-korea.png")
pushLocation("Kyoto, Japan", "images/temp-kyoto-japan.png")
*/

/*
Create test accounts
createAccount("test1", "test1@gmail.com", "test", "test1");
createAccount("test2", "test2@gmail.com", "test", "test2");
createAccount("test3", "test3@gmail.com", "test", "test3");
createAccount("test4", "test4@gmail.com", "test", "test4");
*/

// Create Locations for itineraries up above
/*
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB-Go4oI-rAPo_p", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB-Go4oI-rAPo_p", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB-Go4oI-rAPo_p", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB-Go4oI-rAPo_p", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB0JGboHaQLksTL", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB0JGboHaQLksTL", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB0JGboHaQLksTL", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB0JGboHaQLksTL", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Haa", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Haa", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Haa", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Haa", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Hab", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Hab", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Hab", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGHLY3MhzKM68gx", "-NPfRlB1YDJMvLur8Hab", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgCSrqhFcI1U4Al", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgCSrqhFcI1U4Al", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgCSrqhFcI1U4Al", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgCSrqhFcI1U4Al", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhU", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhU", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhU", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhU", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhV", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhV", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhV", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhV", "123 test4", "Jan. 4", "test4");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhW", "123 test1", "Jan. 1", "test1");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhW", "123 test2", "Jan. 2", "test2");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhW", "123 test3", "Jan. 3", "test3");
pushLocationItinerary("-NPfOxGJXkoZrDD5UaZZ", "-NPfRrgDt4bc4BdImAhW", "123 test4", "Jan. 4", "test4");
*/
