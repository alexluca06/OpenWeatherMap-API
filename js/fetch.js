// Information to connect at OpenWeatherAPI

const apiKey = '47eb0be30a3951ed99fa339633c75998';
const openWeatherMap = 'https://api.openweathermap.org/data/2.5/weather?';

// HTML Components
const input = document.querySelector('#city');
const resultField = document.querySelector('.weather');
const button = document.querySelector('#btn');
const getLocation = document.querySelector('#get-location');

/**
 * Get information from OpenWeatherMap API about the weather
 * @param {string} url 
 * @returns {JSON} response from API 
 */
const currentWeatherData = async (url) => {
    

    try {
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            resultField.innerHTML = '<div><img src="./images/loading.gif"></div>'; // show loading
            return jsonResponse;
        }
        
        resultField.innerHTML = '<h2 class= "fs-1"> Oh, nooo... Please enter a real city! </h2>';
        
    } catch (error) {
        console.log(error);
    }
    
}
/**
 * Get the specific image for every weather type(sunny, cloudly, rainy etc)
 * and time(night or day) based on weatherType, sunrise and sunset variables
 * got it from API
 * 
 * @param {string} weatherType 
 * @param {number} sunriseUnix 
 * @param {number} sunsetUnix 
 * @returns {string} path to an image
 */
const getImageWeather = (weatherType, sunriseUnix, sunsetUnix) => {

    const time = new Date();  // actual time
    const sunrise = new Date(sunriseUnix * 1000);  // get sunrise time
    const sunset = new Date(sunsetUnix * 1000);  // get sunset time
   
    let image = '';

    if(weatherType === 'Clear') {

        if(time.getHours() >= sunrise.getHours() && time.getHours() <= sunset.getHours()) {
            image = './images/sun.png';
        } else {
            image = './images/night.png';
        }

    } else if(weatherType === 'Clouds') {
        
        if(time.getHours() >= sunrise.getHours() && time.getHours() <= sunset.getHours()) {
            image = './images/cloudy.png';
        } else {
            image = './images/cloudy_night.png';
        }

    } else if(weatherType === 'Rain') {
        
        if(time.getHours() >= sunrise.getHours() && time.getHours() <= sunset.getHours()) {
            image = './images/rain.png';
        } else {
            image = './images/rain_night.png';
        }

    } else if(weatherType === 'Snow') {
        image = './images/snow.png';
    } 

    return image;
}

/**
 * Get an HTML snippets and replace some value {{value}} with data from API
 * 
 * @param {string} string  // html file that must be modified
 * @param {string} propName  // what I want to modify into html file 
 * @param {*} propValue  // the value which replace the old value
 * @returns {string}  // html file modified
 */
const insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

/**
 * Render data in index.html(<div class="weather">) with information about 
 * weather received from OpenWeatherMap API
 * 
 * @param {Object()} response 
 */
const renderData = (response) => {
    if(response.error) {
        resultField.innerHTML = '<p>something went wrong! :((</p>'
    } else {
        
        // Get the snippet weather.html from server
        fetch("./snippets/weather.html")
            .then((res) => {
                if(res.ok) {
                    html = res.text().then((weatherHTML) => {

                        const weatherType = response.weather[0].main;
                        const sunrise = response.sys.sunrise;
                        const sunset = response.sys.sunset;
                        const image = getImageWeather(weatherType, sunrise, sunset);
                        const visibility = response.visibility / 1000; // meters to km
                        let content = weatherHTML;
                        content = insertProperty(content,'city', response.name);
                        content = insertProperty(content,'country', response.sys.country);
                        content = insertProperty(content,'image', image);
                        content = insertProperty(content,'weatherType', response.weather[0].main);
                        content = insertProperty(content,'weatherDescription', response.weather[0].description);
                        content = insertProperty(content,'temperature', Math.floor(response.main.temp));
                        content = insertProperty(content,'maxTemp', response.main.temp_max);
                        content = insertProperty(content,'minTemp', response.main.temp_min);
                        content = insertProperty(content,'humidity', response.main.humidity);
                        content = insertProperty(content,'visibility', visibility);
                        content = insertProperty(content,'pressure', response.main.pressure);                
                        resultField.innerHTML = content;  // put data on the index.html page
                        input.value = '';  // clear the input content after reaching the data 
                    
                    });
            }
            
        })
        .catch( (error) => {
            console.log(error);
        });
    }
}

/**
 * This function is called when the button is pressed. It calls
 * the asynchronous function currentWeatherData() to take information from
 * API about the weather from a specific city got it from user
 * 
 * @param {Event()} event
 */
const getWeatherReport = function (event) {
    
    event.preventDefault();  // Important!!
    const  url = openWeatherMap + 'q=' + input.value + '&appid=' + apiKey + '&units=metric';

    // Clear result box
    while(resultField.firstChild) {
        resultField.removeChild(resultField.firstChild);
    }

    // Call async function and render on page the results
    currentWeatherData(url)
        .then((weatherData) => {
            renderData(weatherData);
        })
        .catch((error) => {
            console.log(error);
        });
        

}

/**
 * Get user location and call currentWeatherData() to get information from API
 * about the weather from user's location
 * @param {Event()} event 
 */
const getUserLocation = function (event) {
    
    event.preventDefault();  // Important!!
    
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    /**
     *  A callback function that takes a GeolocationPosition object as its sole
     * input parameter. 
     */
    function success(pos) {
        const crd =  pos.coords;
        const url = openWeatherMap + `lat=${crd.latitude}&lon=${crd.longitude}`+ '&appid=' + apiKey + '&units=metric';
        // Call async function and render on page the results
        currentWeatherData(url)
            .then((weatherData) => {
                renderData(weatherData);
        });
        
    }
    
    /**
     *  An optional callback function that takes a GeolocationPositionError object
     * as its sole input parameter. 
     */
    function error(err) {
        alert(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

button.addEventListener('click', getWeatherReport);
getLocation.addEventListener('click', getUserLocation);