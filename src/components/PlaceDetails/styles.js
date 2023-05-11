// place details styles.js

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import zIndex from '@material-ui/core/styles/zIndex';

export default makeStyles(() => ({
  chip: {
    margin: '5px 5px 5px 0',
  },
  subtitle: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px',
  },
  spacing: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  card: {
     alignItems: 'center', backgroundColor: '#FFF8E0', borderBottom:'1px solid', width:'none',
  },
  media: {
    minHeight: '150px',
    minWidth: '150px',
    border: '1px solid',
    borderRadius: '10px',
  },
  Content: {
    width: 'none',
  },

  modalButton: {
    position: 'fixed',
    zIndex: '-1',
  },

  // If user clicks anywhere outside of the menu, it will close the menu
  popupm: {
    backgroundColor: '#transparent',
    position: 'fixed',
    right: '25%',
    width: '67%',
    height: '100%',
  },

  // container for the pop up menu
  modalContainer: {
    maxWidth: '600px',
    width: '100%',
    position: 'fixed',
    top: '40%',
    left: '30%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    backgroundColor: '#FFF8E0',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.75)',
    zIndex: '+5',
  },

  searchduck: {
    width: '250px',
    objectFit: 'cover',
  },

  modalRight: {
    width: '100%',
  },
  
  closeButton: {
    position: 'fixed',
    top: '8px',
    right: '8px',
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '3rem',
    padding: '1rem 2rem',
  },

  buttonContainer: {
    display: 'flex',
    padding: '1rem 1rem',
    justifyContent: 'center',
    margin: '.5rem',
    alignItems: 'flex-end',
  },

  buttonPrimary: {
    backgroundColor: '#FFB039',
  },

  buttonOutline: {
    backgroundColor: '#A9BCD0',
  },

  buttonItin:{
    backgroundColor: '#FFE882',
    display: 'block',
    margin: '0 auto',
  },

  bold: {
    fontWeight: '600',
  },

  itin: {
    overflow: 'scroll',
    height: '150px',
    overflowX: 'hidden', // hide bottom scroll
  },
}));