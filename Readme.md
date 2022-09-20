# OpenWeatherMap API v1.0

## Description:
        This application gets weather information from an API -OpenWeatherMap API-
    about a city got it from user as input or from user's location(Geolocation WebAPIs).
        
        Application flow:
            1. User enter a city and press 'Get Info' bottom or press 'In your location'
        as the app to get user's location and sent it to the API through the fetch request;
            
            2. A fetch request is sent it to the API when a bottom is press;

            3. If the response is received without errors(200 HTTP CODE), the application 
        extract relevant data, then they are processed and displayed on the web page;


## Used Technologies:
    
    1. HTML + Bootstrap/CSS
    2. JavaScript:
        * Promises(async...await)
        * Fetch
        * WebAPIs/3rd-Party API
        * Regex
        * Anonymous function
        * DOM
    3. HTTP request
    4. Browser-sync

## Setup:

    1. You need to create an account on OpenWeatherMap API site to get API key
    2. Put the key in line 3(const apiKey)
    3. Install browser-sync: sudo apt install browser-sync(because you need a server)
    4. Run browser-sync: browser-sync start --server --directory --files "*" 
