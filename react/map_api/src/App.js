// App.js creating react app for map page

import React, {useState, useEffect} from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api';

// import components
import List from './components/List/List';
import Map from './components/Map/Map';
import './style.css'
//import { useEffect } from 'react';

// create functional app component
// Grid size of the list should be 12 on big devices and the md=4 means that it will be of size 4 on your phone or medium devices whereas the map is bigger and will be of size 8
const App = () => {
    const [places, setPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null); // connect list and map

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({}); // empty bounds atm

    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

    // loading state for circular loading
    const [isLoading, setIsLoading] = useState(false);

    // rating filter
    const [filteredPlaces, setPlacesFiltered] = useState([]);

    // moved types from list to here
    // const [type, setType] = useState('restaurants');
    // const [rating, setRating] = useState('');

    // only gonna happen at start
    // obtain user's current location in order to determine the starting point
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude}}) => {
            setCoordinates({ lat: latitude, lng: longitude});
        })
    }, []);

    // only happens when type, coords, or bounds changes in any way
    useEffect(() => {
        if(bounds.sw && bounds.ne){// if the bounds exist then do all this 
            setIsLoading(true);

            // adjusted to pass in type to take into account not just restuarants
            getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
                //console.log(data);
                // check if locations have a name and review to avoid empty icons and cards
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0)); 
                setPlacesFiltered([]); // reset places filtered back to empty array
                setIsLoading(false);
            })
        }
    }, [type, bounds]); // pass in type

    // use effect for the rating filter
    // only changes when the rating changes aka the rating filter
    useEffect(() => {
        // if the rating of the place is larger than the rating of the currently selected place
        const filteredPlaces = places.filter((place) => place.rating > rating);
        setPlacesFiltered(filteredPlaces);
    }, [rating]);
    

    return (
        <>
            <CssBaseline />
            <Grid container spacing={0} style = {{width: '100%'}}>
                <div class="nav-column">
                    <img src="./images/quack-quack-go-logo.png" alt=""/>
                    <a href="home.html"><img src="./images/nav-home-icon.png" alt=""/>Home</a>
                    <a href="search.html" class="active"><img src="./images/nav-search-icon.png" alt=""/>Search</a>
                    <a href="itineraries.html"><img src="./images/nav-itineraries-icon.png" alt=""/>Itineraries</a>
                    <a href="about.html"><img src="./images/nav-about-icon.png" alt=""/>About</a>
                    <a href="support.html"><img src="./images/nav-support-icon.png" alt=""/>Support</a>
                    <img src="./images/searchduck.png" alt=""/>
                    <a href="login.html" class="logout-button"><img src="./images/nav-log-out-icon.png" alt=""/>Log Out</a>
                </div>
                <Grid item xs = {12} md = {5}>
                    <List 
                        // places={places}
                        // if there is filtered places, pass filteredplaces otherwise pass places
                        places = {filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type} // create these states inside app and passing them as props to list
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                        setCoordinates={setCoordinates}
                    />
                </Grid>
                <Grid item xs = {12} md = {5}>
                    {/* allow map to use the coordinates */}
                    <Map 
                        setCoordinates = {setCoordinates}
                        setBounds = {setBounds}
                        coordinates = {coordinates}
                        // places = {places}
                        places = {filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default App;