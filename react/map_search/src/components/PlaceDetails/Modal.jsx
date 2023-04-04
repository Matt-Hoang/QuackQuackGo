// Modal.js (pop up menu file)

import React from "react";
import searchduck from "./searchduck.png"

import useStyles from './styles';

const Modal = ({open, onClose}) => {
    const classes = useStyles();

    if (!open) return null
    
    return (
        <div onClick={onClose} className={classes.popupm}>
            <div onClick={(e) => {
                e.stopPropagation() // will stop modal from closing on itself (taken from documentation)
            }} className={classes.modalContainer}>
                <img src={searchduck} alt="" className={classes.searchduck}/>
                <div className={classes.modalRight}>
                    {/* closing the popup */}
                    <p onClick={onClose} className={classes.closeButton}>X</p>
                    {/* Content text of popup */}
                    <div className={classes.content}>
                        <h1> Select an Itinerary! </h1>
                    </div>
                    <div className={classes.itin}>
                        <button className={classes.buttonItin} >Itinerary 1</button>
                        <button className={classes.buttonItin} >Itinerary 2</button>
                        <button className={classes.buttonItin} >Itinerary 3</button>
                        <button className={classes.buttonItin} >Itinerary 4</button>
                        <button className={classes.buttonItin} >Itinerary 5</button>
                        <button className={classes.buttonItin} >Itinerary 1</button>
                        <button className={classes.buttonItin} >Itinerary 2</button>
                        <button className={classes.buttonItin} >Itinerary 3</button>
                        <button className={classes.buttonItin} >Itinerary 4</button>
                        <button className={classes.buttonItin} >Itinerary 5</button>
                        <button className={classes.buttonItin} >Itinerary 1</button>
                        <button className={classes.buttonItin} >Itinerary 2</button>
                        <button className={classes.buttonItin} >Itinerary 3</button>
                        <button className={classes.buttonItin} >Itinerary 4</button>
                        <button className={classes.buttonItin} >Itinerary 5</button>
                    </div>
                    <div className={classes.buttonContainer}>
                    <button className={classes.buttonPrimary}>
                        <span className={classes.bold}>YES</span>, add to itinerary
                    </button>
                    <button onClick={onClose} className={classes.buttonOutline}>
                        <span className={classes.bold}>CANCEL</span>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal