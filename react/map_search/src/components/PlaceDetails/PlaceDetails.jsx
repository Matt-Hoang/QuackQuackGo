// place details.js

import React, { useState } from 'react';
import { Box, Typography, Button, Card,  CardMedia, CardContent, CardActions, Chip} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Rating from '@material-ui/lab/Rating';

import useStyles from './styles';

import Modal from './Modal'; // pop up menu for adding to itin creation

// take in place from List
// update: pass in selected icon and refprop
const PlaceDetails = ({ place, selected, refProp }) => {
    
    // added by chris: auto scroll feature for clicking on location
    if (selected) refProp?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    //if (selected) setTimeout(function () {refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });}, 100);

    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false); // false means show the button, true means hide

    return (
        // elevation gives a nice shadow effect on the card
        <Card elevation={0} className={classes.card}>
            <CardMedia 
                className={classes.media}
                // if the place has a photo, then use their photo image 
                // given url is placeholder image
                image={place.photo ? place.photo.images.large.url :'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg' }
                title={place.name}
           />
           <CardContent className={classes.Content}>
                <Typography gutterBottom variant="h5">{place.name}</Typography>
                <Box display="flex" justifyContent="space-between">
                    {/* provide price level for specific place ($, $$, or $$$ etc) */}
                    <Rating size="flex" value={Number(place.rating)} readOnly/>
                    <Typography gutterBottom variant="subtitle1">out of {place.num_reviews} reviews</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">Price</Typography>
                    <Typography gutterBottom variant="subtitle1">{place.price_level}</Typography>
                </Box>

                {/* display address (IMPORTANT) */}
                {place?.address && (
                    <Typography gutterBottom variant="subtitle2" color="textSecondary" className={classes.subtitle}> 
                        <LocationOnIcon /> {place.address}
                    </Typography>
                )}
                {/* display phone number if available */}
                {place?.phone && (
                    <Typography gutterBottom variant="subtitle2" color="textSecondary" className={classes.spacing}> 
                        <PhoneIcon/> {place.phone}
                    </Typography>
                )}
                <CardActions>
                    {/* _blank will open the url in a new tab rather than our website */}
                    <Button size="small" color="primary" onClick={()=> window.open(place.website,'_blank')}>
                        Website
                    </Button>
                    <Button size="small" color="primary" onClick={()=> window.open(place.web_url,'_blank')}>
                        More Info
                    </Button>
                    <Button size="small" color="primary" onClick={() => setOpenModal(true)}>
                        Add to Itinerary
                    </Button>
                    <Modal open={openModal} onClose={() => setOpenModal(false)} className={classes.modalButton}/>
                </CardActions>
           </CardContent>
        </ Card>
    );
}

export default PlaceDetails;