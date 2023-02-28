//This is a function to change the user profile picture
//Need to update this so that it can upload to database
var loadFile = function (event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
  }; 
  
