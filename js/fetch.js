// Information to connect at OpenWeatherAPI

const apiKey = '47eb0be30a3951ed99fa339633c75998';
const openWeatherMap = 'https://api.openweathermap.org/data/2.5/weather?';

// HTML Components
const city = document.querySelector('#city');
const resultField = document.querySelector('.weather');
const button = document.querySelector('#btn');
const getLocation = document.querySelector('#get-location');

/**
 * Get the data from Open Weather Map API. Return jsonResponse
 */

const currentWeatherData = async () => {
    const url = openWeatherMap + 'q=' + city.value + '&appid=' + apiKey;
    try {
        const response = await fetch(url);
        if(response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        alert('Wrong Input. Please enter a real city!');
    } catch (error) {
        console.log(error);
    }
}

/**
 * Render information on HTML page 
 */
const renderData = (res) => {
    if(res.error) {
        resultField.innerHTML = '<p>something went wrong! :((</p>'
    } else {
        resultField.innerHTML = res.weather[0].main;
    }
}

/**
 * This function is called when the button is pressed. It calls
 * the asynchronous function currentWeatherData
 */
const getResults = function (event) {
    
    event.preventDefault();  // Important!!

    // Clear result box
    while(resultField.firstChild) {
        resultField.removeChild(resultField.firstChild);
    }

    // Call async function and render on page the results
    currentWeatherData()
        .then((weatherData) => {
            renderData(weatherData);
    });

}


 
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
        const crd = pos.coords;
    
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
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

button.addEventListener('click', getResults);
getLocation.addEventListener('click', getUserLocation);
  