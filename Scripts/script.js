/**
 * Author: Nataliia Stefurak
 * Date: October, 2017
 *
 * A College project, mapping application that shows you the existing wildlife centres depending on your search query
 * It also shows your current location
 * The application uses Google Maps and Google Places Srevices
 *
 * **/


// create some basic global variables
    var map = {};
    var markers = [];
    var place = [];
    var globalPos, infoWindow, image, query, userQuery, bounds;


    // onload event handler to create the initial map and map object
    function initMap() {
        // create a container to draw the map inside a <div>
        var mapCanvas = (document.getElementById("map-container"));

        // define some map properties
        var mapOptions = {
            center: {lat: 43.011987, lng: -81.200276},
            zoom: 7
        };

        // call the constructor to create a new map object
        // and then get your geo location
        map = new google.maps.Map(mapCanvas, mapOptions);

        //create new infoWindow object to get information about the place
        infoWindow = new google.maps.InfoWindow;

        // close infoWindow in case there are some open infoWindows
        google.maps.event.addListener(map, "click", function() {
            infoWindow.close();
        });

        //set new map position
        getLocation();

    }

    // Get and then set the map position based on the geo location
    function getLocation() {
        if (navigator.geolocation) {
            // showPosition is a reference to a JS function below
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    // helper function for getLocation()
    function showPosition(position) {
        globalPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        };

        //open infoWindow
        infoWindow.setPosition(globalPos);
        infoWindow.setContent('Here is your location');
        infoWindow.open(map);

        //center the map on the current position
        map.setCenter(globalPos);
    }


    // this event handler demonstrates Google Places service based on what you have typed in the search.
    // In my case It doesn't depend on your current position, however I am planning to incorporate this feature in future - either search for
    // wildlife centres near you (for instance, you find an injured groundhog and want to get to the nearest centre)
    // or just to search for them around the world

    function wildlifeCentres() {

        //check whether the value field is not empty
        // if it is not, proceed with the search
        if(document.getElementById("userQuery").value != "") {

            // delete any existing markers
            deleteMarkers();
            query = 'Wildlife centres';
            userQuery = document.getElementById("userQuery").value;

            //depending on what the user has typed, the title on the page will be changed
            document.querySelector(".new-heading").textContent = userQuery;

            // create a request object
            var request = {
                placeId: place.place_id,
                // location: globalPos,
                // radius: '100000',
                //again, it doesn't matter where you are, just search for the wildlife centres(query)
                // in the region user has chosen (userQuery)
                query: [ query + ' ' + userQuery ]
            };

            // create the service object
            var service = new google.maps.places.PlacesService(map);

            // perform a search based on the request object and callback
            service.textSearch(request, callback);

            // this is an inner callback function as referenced immediately above
            function callback(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++){
                        addMarker(results[i]);
                    }
                }
            }

            // display all the pins on the map
            displayAllMarkers(map);

    //if the user puts an empty value
        } else {alert ("Search field is empty! Put some value there.")}
    }

    // this function creates a marker object and adds the new marker (pin) to the marker array
    function addMarker(place) {

        // create a marker (pin) object, image - is a new pin icon (marker object property)
        image = 'Images/owl.png';

        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            //an owl icon for the pin:)
            icon: image
        });


        //"click" event listener for the marker
        google.maps.event.addListener(marker, "click", function(){

            document.getElementById("full-info").style.display = "block";


             //show information from the infoWindow in the side bar
            document.getElementById('place-name').textContent = place.name;
            document.getElementById('place-address').textContent = place.formatted_address;

            //show rating field only if a place has a rating, otherwise hide it
            if(place.rating){
                document.getElementById('place-rating').innerHTML = '<p style="color:#2b5876;display:inline;"> Rating: </p>' + place.rating;
            }

            //show the field only if a place has a rating, otherwise hide it
            if(place.opening_hours.open_now){
                document.getElementById('open-status').innerHTML = '<p style=" color:green;"> Open Now </p>';
            }
             else {
                 document.getElementById('open-status').innerHTML = '<p style="color:red;"> Closed Now </p>';
            }


        });


        // add a "dblclick" event handler to centre on the marker
        marker.addListener('dblclick', function() {
            map.setZoom(16);
            map.setCenter(marker.getPosition());
        });

        // push the marker object onto the markers array
        markers.push(marker);

        //use fitBound() to covel all visible markers
        bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }

        map.fitBounds(bounds);
    }// end addMarker() function


    // display all the marker objects (pins) in the marker array
    function displayAllMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // delete all map markers and init the markers array
    function deleteMarkers() {
        displayAllMarkers(null);
        markers = [];
    }

    //start search when the user press Enter
    function keyDown() {
        if (event.keyCode == 13) {
            document.getElementById('btnSearch').click();
        }
    }


