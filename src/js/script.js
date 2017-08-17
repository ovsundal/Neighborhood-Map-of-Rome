'use strict';

let map;
let viewModel;
let infoWindow;
let currentMarker;
let service;

const initialLocations = [
    {
        "geometry": {
            "location": {lat: 58.970936, lng: 5.732062}
        },
        "name": 'Døgnvill',
        "info": 'info for Døgnvill'
    }
    ,
    {
        "geometry": {
            "location": {lat: 58.970818, lng: 5.735233}
        },
        "name": 'Steam Kaffebar',
        "info": 'info for Steam Kaffebar'
    },
    {
        "geometry": {
            "location": {lat: 58.970135, lng: 5.736521}
        },
        "name": 'Thai Nong Khai As',
        "info": 'info for Thai Nong Khai As'
    },
    {
        "geometry": {
            "location": {lat: 58.971349, lng: 5.738650}
        },
        "name": 'Mogul India',
        "info": 'info for Mogul India'
    },
    {
        "geometry": {
            "location": {lat: 58.972237, lng: 5.732062}
        },
        "name": 'Delhi Bar & Restaurant',
        "info": 'info for Delhi Bar & Restaurant'
    }
];

class Location {
    constructor(data) {

        let self = this;

        //data from google maps
        this.name = data.name;
        this.address = data.formatted_address;
        this.types = data.types;
        this.rating = data.rating;

        this.geometry = {
            location: {
                "lat": data.geometry.location.lat,
                "lng": data.geometry.location.lng
            }
        };


        // this.info = data.info;

        //data from foursquare


        //create marker
        this.marker = new google.maps.Marker({
            position: this.geometry.location,
            title: this.name,
            map: map,
            animation: google.maps.Animation.DROP
        });

        this.marker.addListener('click', () => {

            viewModel.setLocation(self);
            setInfoWindowAndTriggerBounce();
        });

        //get data from www.FourSquare.com
        // queryFourSquare(this);

        //push the item into the observablearray
        viewModel.locationList.push(this);
    }
}

class ViewModel {
    constructor() {

        let self = this;

        self.menuVisible = ko.observable(true);
        self.searchBarText = ko.observable("");
        self.locationList = ko.observableArray([]);

        self.toggleMenu = () => {
            this.menuVisible(!this.menuVisible());
        };

        self.currentLocation = ko.observable(self.locationList()[0]);

        self.setLocation = (clickedLocation) => {

            for (let i = 0; i < self.locationList().length; i++) {
                //search for location clicked in observable array
                if (clickedLocation === self.locationList()[i]) {

                    //set the found location as new current location
                    self.currentLocation = ko.observable(self.locationList()[i]);
                    setInfoWindowAndTriggerBounce();
                }
            }
        };
    };
}

//callback function for google map async load
window.mapCallback = () => {

    //if google maps loaded successfully
    if (typeof google === 'object' && typeof google.maps === 'object') {
        initMap();
        initAutoComplete();
        service = new google.maps.places.PlacesService(map);

        viewModel = new ViewModel();
        ko.applyBindings(viewModel);

        populateInitialLocations();
    } else {
        alert('Error, google maps could not load');
    }
};

function initMap() {

    const stavanger = {lat: 58.9700, lng: 5.7331};
    map = new google.maps.Map(document.getElementById('map'), {
        center: stavanger,
        zoom: 15,
        disableDefaultUI: true
    });
}

function initAutoComplete() {

    let input = document.getElementById('searchBox');
    // let input = viewModel.searchBarText();

    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    let infowindow = new google.maps.InfoWindow();


    autocomplete.addListener('place_changed', () => {
        infowindow.close();

        let place = autocomplete.getPlace();
        let searchString;

        if (!place.geometry) {
            //A non-autocomplete query was made. Use input field value as search string
            searchString = viewModel.searchBarText();
        } else {
            searchString = place.name + ' ' + place.formatted_address;
        }

        queryGoogleMaps(searchString);
    });
}

function queryGoogleMaps(query) {

    const stavanger = new google.maps.LatLng(58.97, 5.73);

    let request = {
        location: stavanger,
        query: query
    };

    service.textSearch(request, callbackGoogleMaps);
}

function callbackGoogleMaps(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            debugger;
            let types = '';
            //put categories associated with result into one string
            results[i].types.forEach((item) => {

                types += item + ', ';
            });
            results[i].types = types;
            debugger;
            results[i].geometry.location.lat = results[i].geometry.location.lat();
            results[i].geometry.location.lng = results[i].geometry.location.lng();

            new Location(results[i]);
        }
    }
}

function populateInitialLocations() {
    initialLocations.forEach((locationItem) => {
        new Location(locationItem);
    });
}

function setInfoWindowAndTriggerBounce() {

    if (currentMarker) {
        currentMarker.setAnimation(null);
    }

    //if infoWindow does not exist, create it.
    if (!infoWindow) {
        infoWindow = new google.maps.InfoWindow();
    }

    let contentString = buildContentStringForInfoWindow(viewModel.currentLocation());

    // Change content and marker with new currentLocation
    // infoWindow.setContent(viewModel.currentLocation().name);
    infoWindow.setContent(contentString);

    infoWindow.open(map, viewModel.currentLocation().marker);

    //make marker bounce
    currentMarker = viewModel.currentLocation().marker;

    if (viewModel.currentLocation().marker.getAnimation() !== null) {
        viewModel.currentLocation().marker.setAnimation(null);
    } else {
        viewModel.currentLocation().marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function buildContentStringForInfoWindow(location) {
    return '<u>Data from Google maps</u>' + '</br></br>' +
        location.name + '</br>' +
        location.address + '</br>' +
        'Rating: ' + location.rating + '</br></br>' +
        'Keywords: ' + '<i>' + location.types + '</i>' + '</br>' +
        location.postalCode + ' ' + location.city + '</br></br>' +
        'Phone: ' + location.phone + '</br>' +
        location.url;
}

function queryFourSquare(locationObject) {

    const URL = 'https://api.foursquare.com/v2/venues/search?';
    const CLIENT_ID = 'client_id=13H0KQ15M5RIOAEHKB11UVWGJMSLDD3GJE2WHNZYZGY2WWLT';
    const CLIENT_SECRET = '&client_secret=D0FE0QLWIPPSTJEETRUM0IKURTWV1XD5W1WDTW20C5KW33OZ';
    const DATE = '&v=20170818';
    const LATLNG = '&ll=58.97,5.73';
    const QUERY = '&query=' + locationObject.name;

    const FULL_SEARCH_STRING = URL + CLIENT_ID + CLIENT_SECRET + DATE + LATLNG + QUERY;

    $.ajax({
        url: FULL_SEARCH_STRING,
        context: locationObject
    })
        .done(function (data) {

       // this.name = data.response.venues[0].name;
       this.address = data.response.venues[0].location.address;
       this.phone = data.response.venues[0].contact.formattedPhone;
       this.postalCode = data.response.venues[0].location.postalCode;
       this.city = data.response.venues[0].location.city;
       this.url = data.response.venues[0].url;
    })
        .fail(() => {
            alert('Could not load data from FourSquare');
        });

}




