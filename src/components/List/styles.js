import { alpha, makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0), 
    width:'25%',
    marginBottom: '30px', 
    border: 'solid',
    backgroundColor: '#FFF8E0',
    borderWidth: '0px',
    padding: '5px',
  },
  formControl2: {
    margin: theme.spacing(0), 
    width: '50%',
    marginBottom: '30px', 
    border: 'solid',
    backgroundColor: '#FFF8E0',
    borderWidth: '1px',
    padding: '5px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    height: '600px', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  container: {
    padding: '25px',
    backgroundColor: '#FFF8E0',
    height:'100vh',
    borderRadius: '35px 0px 0px 35px',
    width: 'none'
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    margin: theme.spacing(0), 
    height: '80vh', 
    overflow: 'auto', 
    padding:'10px' ,
    borderTop: 'solid',
    borderWidth: '2px',
    padding: '5px',
    width: 'none', 
  },
  search: {
    position: 'relative',
    marginTop: '13px',
    minWidth: 300, 
  },
  searchIcon: {
    padding: theme.spacing(0, 0), 
    height: '100%', 
    position: 'absolute', 
    pointerEvents: 'none', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0), 
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, 
    transition: theme.transitions.create('width'), 
    width: '100%', [theme.breakpoints.up('md')]: { width: '20ch' },
  },
  title: {
    fontSize: '30px', fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '15px',
    marginBottom: '15px',
  },
  searchimg: {
    height: '30px',
    margin: '0px 10px',
}

}));