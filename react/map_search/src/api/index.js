// index.js for API
// all api's 
import axios from 'axios'; // library to make api calls

//const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'
//from RapidAPI Travel Adviser Code: 
// https://rapidapi.com/apidojo/api/travel-advisor

// function will be called in App.js
// adjusted getPlacesData to take into account of the filters
export const getPlacesData =  async (type, sw, ne) => {
    try{
        // creating request
        // destructure the data twice to get to our restaurants 
        // type represents restaurant, hotels or attractions depending on what the user clicks
        const {data: {data}} = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
          //url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'
          // bottom left, top right longitude and latitudes
          params: {
            bl_latitude: sw.lat,
            tr_latitude: ne.lat,
            bl_longitude: sw.lng,
            tr_longitude: ne.lng,
          },
          headers: { // ToDo: change keys to environmental variables
            // Uncomment api key only when needed to save number of requests
            'X-RapidAPI-Key': '8ffc2dc14fmshf00253b4403177ap1a2145jsnf253a228d907',
            //'X-RapidAPI-Key': '366e21fde4msh4087d0e10f14fe5p106270jsn726dd047af90', // capped
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        });

        return data;
    } 

    catch (error) {
        console.log(error)
    }
}