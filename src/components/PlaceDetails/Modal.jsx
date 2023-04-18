import React, { useState, useEffect } from "react";
import searchduck from "./searchduck.png";
import useStyles from "./styles";
import { db, ref, get } from "./db.js";

const Modal = ({ open, onClose, placeName, placeAddy }) => {
  const classes = useStyles();
  
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    // get user ID the typical way
    const userID = "5P1tWJRUipSv248dfuAdiLQlkpO2";
    const itinerariesRef = ref(db, `Users/${userID}/Itineraries`);

    get(itinerariesRef).then((snapshot) => {
        const itineraries = snapshot.val();
        const itineraryIDs = Object.keys(itineraries);
        const itinerariesList = [];

        for(let i = 0; i < itineraryIDs.length; i++)
        {
            itinerariesList.push(<button className={classes.buttonItin}
                                  onClick={() => {
                                    const itineraryID = itineraryIDs[i];
                                  }}>
                                    {itineraries[itineraryIDs[i]].name}
                                 </button>);
        }
        
        setItineraries(itinerariesList);


    });
  }, []);

  if (!open) return null;

  return (
    <div onClick={onClose} className={classes.popupm}>
      <div
        onClick={(e) => {
          e.stopPropagation(); // will stop modal from closing on itself (taken from documentation)
        }}
        className={classes.modalContainer}
      >
        <img src={searchduck} alt="" className={classes.searchduck} />
        <div className={classes.modalRight}>
          {/* closing the popup */}
          <p onClick={onClose} className={classes.closeButton}>
            X
          </p>
          {/* Content text of popup */}
          <div className={classes.content}>
            <h1> Select an Itinerary! </h1>
          </div>
          <div className={classes.itin}>
            {itineraries}
          </div>
          <div className={classes.buttonContainer}>
            <button className={classes.buttonPrimary}
             onClick={() => {
              
             }}>
              <span className={classes.bold}>YES</span>, add to itinerary
            </button>
            <button onClick={onClose} className={classes.buttonOutline}>
              <span className={classes.bold}>CANCEL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;