import React, { useState, useEffect } from "react";
import searchduck from "./searchduck.png";
import useStyles from "./styles";
import { db, ref, get, onAuthStateChanged, auth } from "./db.js";

const Modal = ({ open, onClose, placeName, placeAddy}) => {
  const classes = useStyles();
  
  const [itineraries, setItineraries] = useState([]);
  const [userID, mySetUserID] = useState(null);

  const [test1, setTest1] = useState([]);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user)
      {
        // get user ID the typical way
        
        const itinerariesRef = ref(db, `Users/${user.uid}/Itineraries`);

        get(itinerariesRef).then((snapshot) => {
            const itineraries = snapshot.val();

            // console.log(itineraries)
            const itineraryIDs = Object.keys(itineraries);
            const itinerariesList = [];

            for(let i = 0; i < itineraryIDs.length; i++)
            {
                itinerariesList.push(<button className={classes.buttonItin}
                                      onClick={() => handleItinerarySelect(itineraryIDs[i], user.uid)}>  
                                        {itineraries[itineraryIDs[i]].name}
                                    </button>);
            }
            
            setItineraries(itinerariesList);

            const handleItinerarySelect = (itinerary, userID) => {
              setTest1(itinerary, userID);
            }
        }); 
      }
    });

    
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        mySetUserID(userID);
      } else {
        mySetUserID(null);
      }
    });
  }, []);

  const handleAddToItinerary = (itinerary, userID) => {
    localStorage.setItem("itineraryPath", `Users/${userID}/Itineraries/${itinerary}`);
    localStorage.setItem("title", placeName);
    localStorage.setItem("address", placeAddy);
    localStorage.setItem("hasItinerary", "True");
    window.location.href = "itineraryEdit.html";
    alert("Address added successfully!");
  }

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
            onClick={() => handleAddToItinerary(test1, userID)}
             >
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