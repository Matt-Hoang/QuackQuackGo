// Map.jsx
import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';

const Map = ({setCoordinates, setBounds, coordinates, places, setChildClicked}) => {
    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)'); // mobile vairable is set to false if device is more than 600 pixals

    // const [childClicked, setChildClicked] = useState(null); // moved to parent component (app)

    // no longer need default coords
    //const coordinates = { lat: 0, lng: 0 };

    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact 
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}} // api key from google cloud TODO: convert to environmental var so it is secure
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                // set coords and set bounds to north east and south west
                onChange={(e) => {
                    setCoordinates({ lat: e.center.lat, lng: e.center.lng});
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw});
                }} // important in changing the map
                
                // added onClick
                onChildClick={(child) => setChildClicked(child)} // used when clicking on a restuarant or location on the map
            >
                {/* Display Location Icons on Map */}
                {places?.map((place, i) => (
                    <div
                        className={classes.markerContainer}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        {/* if on mobile / not on desktop */}
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color="primary" fontSize="large"/>
                            ) : (
                                <Paper  elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                                        {place.name}
                                    </Typography>
                                    {/* image for location icons */}
                                    <img 
                                        className={classes.pointer}
                                        src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                                        alt={place.name}
                                    />
                                    {/* Ensure readers can only read the ratings */}
                                    <Rating size="small" value={Number(place.rating)} readOnly />
                                </Paper>
                            )
                        }

                    </div>
                ))}

            </GoogleMapReact>
        </div>
    );
}

export default Map;