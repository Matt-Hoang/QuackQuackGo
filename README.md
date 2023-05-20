# QuackQuackGo

Our goal is to create a simple and informational tool for all travelers. To achieve this goal, QuackQuackGo (QQG) was developed. QQG is a web application that allows users to create and manage itineraries to plan trips conveniently. By allowing users to create their own itinerary, they can seamlessly make plans to places they want to visit. 

## Features

Core features of this web application includes:
- Itinerary Creation
- Location Search
- Pre and Post-Trip Checklists
- Bookmarking Itineraries
- Export Itinerary for Google My Maps

## Getting Started with Create React App

1.  Download the appropriate node for your device
    -  [Download Node here](https://nodejs.org/en/)
2. Open Terminal and type:
`npx create-react-app ./`
    - This should set up a react app for QQG.
    - Let it load (takes a while) and it will create a react app in the destination folder.
3. Install appropriate dependencies for React and Google Maps api
    - Type:
```
npm install @material-ui/core @material-ui/core @material-ui/icons @material-ui/lab @react-google-maps/api axios google-map-react --legacy-peer-deps
```

4. Delete unnecessary folders:
   - Delete src folder and public folder
5. Download code from repo
   - Drag and drop the public and src folders from Github to replace the deleted folders.
   - Replace json files too if needed
6. Project should be good to go, run `npm start` in terminal to start the app once all code has been implemented

## API Keys
All keys are accessed through a .env file which isn’t uploaded to the Github for security reasons.
- Trip Adviser Key
  1. Visit https:[//rapidapi.com/apidojo/api/travel-advisor ](//rapidapi.com/apidojo/api/travel-advisor) 
  2. Sign in with Google and click subscribe to test 
  3. Visit Endpoints tab to obtain key
- Google Maps API Key
  1. Visit [https://console.cloud.google.com/welcome](https://console.cloud.google.com/welcome)
  2. Sign in with Google and setup a billing account
  3. Search and enable the following APIs: Google Maps Javascript API, Places API, Geocode API
  4. Only need key for the Maps API which will call on the other api keys

- Create a .env file in the same place as the src and label it as:
```
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_RAPIDAPI_TRAVEL_API_KEY=
```
- Inserting your keys after the “=”

## Database Setup
Insert db setup instructions here (@MAT)


Copy paste the following chunk over the existing one within the app. 
- This should be located in the db.js files in both src and public folders. There is also another instance within /components/placedetails folder.
# Example
```
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBByrTU8VstkLf9CEambHHGUpHJJWro6nk",
  authDomain: "qqg2023.firebaseapp.com",
  projectId: "qqg2023",
  storageBucket: "qqg2023.appspot.com",
  messagingSenderId: "972979169781",
  appId: "1:972979169781:web:6e1717923e404a2467d8bc"
};
```

## Available Scripts

In the project directory, you can run:

### `npm start`

- Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

- The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

- Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

- The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

