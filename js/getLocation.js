const getUserLocation = function (event) {
    
    //event.preventDefault();  // Important!!
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

    console.log( navigator.geolocation.getCurrentPosition(success, error, options));
}
