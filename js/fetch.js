// Information to connect at OpenWeatherAPI

const apiKey = '47eb0be30a3951ed99fa339633c75998';
const openWeatherMap = 'https://api.openweathermap.org/data/2.5/weather?';

// HTML Components
const input = document.querySelector('#city');
const resultField = document.querySelector('#weather');
const button = document.querySelector('#btn');
const getLocation = document.querySelector('#get-location');


/**
 * Get the data from Open Weather Map API. Return jsonResponse
 */
const currentWeatherData = async (url) => {
    

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
const renderData = (response) => {
    if(response.error) {
        resultField.innerHTML = '<p>something went wrong! :((</p>'
    } else {
        const city = response.name;
        const country = response.sys.country;
        const weatherType = response.weather[0].main;
        const weatherDescription = response.weather[0].description;
        const temperature = Math.floor(response.main.temp);
        const maxTemp = Math.floor(response.main.temp_max);
        const minTemp = Math.floor(response.main.temp_min);
        const humidity = response.main.humidity;
        const visibility = response.visibility;
        resultField.innerHTML = `<h2>${city}, ${country}</h2>`;
        resultField.innerHTML += `<h3>${temperature}</h3>`;
        resultField.innerHTML += `<h3>${weatherType}</h3>`;
        resultField.innerHTML += `<h3>${weatherDescription}</h3>`;
        resultField.innerHTML += `<h3>${maxTemp}</h3>`;
        resultField.innerHTML += `<h3>${minTemp}</h3>`;
        resultField.innerHTML += `<h3>${humidity}</h3>`;
        resultField.innerHTML += `<h3>${visibility}</h3>`;
    }
}

/**
 * This function is called when the button is pressed. It calls
 * the asynchronous function currentWeatherData
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
            console.log(weatherData);
            renderData(weatherData);
    });
    

}

button.addEventListener('click', getWeatherReport);

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

//getUserLocation();
getLocation.addEventListener('click', getUserLocation);