// list.js file

import React, {useState, useEffect, createRef} from 'react'; // new imports to work with location icons
import SearchIcon from '@material-ui/icons/Search'
import { InputBase, CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

import useStyles from './styles';
import { Autocomplete } from '@react-google-maps/api';

const List = ({ places, childClicked, isLoading, type, setType, rating, setRating, setCoordinates }) => {
    const classes = useStyles();
    // const [type, setType] = useState('restaurants');
    // const [rating, setRating] = useState('');
    const [elRefs, setElRefs] = useState([]); // element references, empty at start cause no places

    // use state for auto fill feature in search
    const [autocomplete, setAutocomplete] = useState(null);
    const onLoad = (autoc) => setAutocomplete(autoc); // call autocomplete when load

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat(); // from google maps documentation
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoordinates({ lat, lng }); // change coordinates to the location that was searched
    }

    // added by chris: on click references to get auto scroll feature to work
    // upon clicking an icon on the map, it will scroll to the location on the list
    useEffect(() => {
        // construct array equal to amount of places
        // return references or if the ref doesnt exist, create one
        const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());
        setElRefs(refs);
    // eslint-disable-next-line
    }, [places]); // want to call places field every time it is changed 

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                Search <img src="images/search-icon.png" alt="" className={classes.searchimg}/>
                <h5 className={classes.subtitle}>Let's create an itinerary!</h5>
            </div>
            
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
            {/* Button feature to filter by type of locations */}
            <FormControl className={classes.formControl}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)}> {/* switching between options */}
                    <MenuItem value="restaurants">Restaurants</MenuItem>
                    <MenuItem value="attractions">Attractions</MenuItem>
                    <MenuItem value="hotels">Hotels</MenuItem>
                </Select>
            </FormControl>
            
            {/* Option to filter locations by google ratings */}
            <FormControl className={classes.formControl}>
                <InputLabel>Rating</InputLabel>
                <Select value={rating} onChange={(e) => setRating(e.target.value)}> {/* switching between options */}
                    <MenuItem value={0}>All</MenuItem>
                    <MenuItem value={3}>Above 3.0</MenuItem>
                    <MenuItem value={4}>Above 4.0</MenuItem>
                    <MenuItem value={4.5}>Above 4.5</MenuItem>
                </Select>
            </FormControl>
            {/* Search box feature */}
            <FormControl className={classes.formControl2}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                <InputBase placeholder="Find a starting point..." classes={{root:classes.inputRoot, input: classes.inputInput}} />
                </div>
            </Autocomplete>
            </FormControl>
            {/* should take in locations as a reference get auto click working. */}
            <Grid container spacing= {3} className = {classes.list}>
                {/* places?. means that if that place exists, then map over them */}
                {/* ^^take full size of width container regardless of device size*/}
                {places?.map((place, i) => (
                    <Grid ref={elRefs[i]} item key={i} xs={12}>
                        <PlaceDetails 
                            selected={Number(childClicked) === i}
                            refProp={elRefs[i]} 
                            place={place} 
                            />
                    </Grid>
                ))}
            </Grid>
            </>
            )}
        </div>
    );
}

export default List;