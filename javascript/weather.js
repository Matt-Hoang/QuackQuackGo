apiKey = "f74ce17bfb6dc167b635e5d8812f57f7"

let weather = {
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city 
            + "&units=imperial&appid=" 
            + apiKey
        ).then((response) => response.json())
        .then((data) =>this.displayWeather(data));
    },
    displayWeather: function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity} = data.main;
        const { speed } = data.wind;
        console.log( name, icon,description,temp,humidity,speed);
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/"+ icon +".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity +"%";
        document.querySelector(".wind").innerText = "Wind: " + speed +" mph";
        document.querySelector(".weather").classList.remove("loading")
    },
    search:function() {
        this.fetchWeather(document.querySelector(".search-bar").value)
        document.querySelector(".search-bar").value = ""
    }
}

document
    .querySelector(".search button")
    .addEventListener("click", function() {
        weather.search();
})

document.querySelector(".search-bar").addEventListener("keyup",function(event){
    if (event.key == "Enter"){
        weather.search();
    }
})

function getPosition() {
    // Simple wrapper
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}
async function main() {
    var position = await getPosition();  // wait for getPosition to complete
    console.log(position);
    const location = await fetch(
        "http://api.openweathermap.org/geo/1.0/reverse?lat="
        + position.coords.latitude 
        + "&lon=" 
        + position.coords.longitude 
        + "&appid="
        + apiKey
    )
    var data = await location.json();
    weather.fetchWeather(data[0].name);
}
main();