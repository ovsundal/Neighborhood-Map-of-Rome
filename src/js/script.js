'use strict';

let map;
let service;
let viewModel;
let infoWindow;
let currentMarker;

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

        this.geometry = {
            location: {
                "lat": data.geometry.location.lat,
                "lng": data.geometry.location.lng
            }
        };
        this.name = data.name;
        this.info = data.info;

        //create marker
        this.marker = new google.maps.Marker({
            position: this.geometry.location,
            title: this.name,
            map: map,
            animation: google.maps.Animation.DROP
        });

        //todo add listener to createMarker function
        // QUESTION: listener below returns ..."read property 'apply' of undefined"...What is wrong?
        // this.marker.addListener('click', function() {
        //     viewModel.setLocation();
        //     setInfoWindowAndTriggerBounce()
        // });

        //get data from www.FourSquare.com
        queryFourSquare(this);

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
    initMap();
    initAutoComplete();

    viewModel = new ViewModel();
    ko.applyBindings(viewModel);

    //populate listview with initial locations
    initialLocations.forEach((locationItem) => {
        new Location(locationItem);
    });

    service = new google.maps.places.PlacesService(map);


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
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
        }

        //make latlng compatible with Location objects
        place.geometry.location.lat = place.geometry.location.lat();
        place.geometry.location.lng = place.geometry.location.lng();

        new Location(place);
    });
}

function searchForData() {

    service.textSearch(viewModel.searchBarText, searchCallback());
}

function searchCallback(results, status) {
    debugger;
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((result) => {
            createMarker(result);
        });
    }
}

function setInfoWindowAndTriggerBounce() {

    if (currentMarker) {
        currentMarker.setAnimation(null);
    }

    //if infoWindow does not exist, create it.
    if (!infoWindow) {
        infoWindow = new google.maps.InfoWindow();
    }

    let contentString = buildContentString(viewModel.currentLocation());

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

//build content string for infowindow
function buildContentString(location) {
    return location.name + '</br>' +
        location.address + '</br>' +
        location.postalCode + ' ' + location.city + '</br>' + '</br>' +
        'Phone: ' + location.phone + '</br>' +
        location.url;
}

//when enter is pressed on search bar, launch search
//pretty much like this, but no jquery (use event binding)
$(document).keypress(function (e) {
    if (e.which === 13) {
        searchForData();
    }
});

//todo  need to have error handling and filtering of the result


function queryFourSquare(locationObject) {

    const URL = 'https://api.foursquare.com/v2/venues/search?';
    const CLIENT_ID = 'client_id=13H0KQ15M5RIOAEHKB11UVWGJMSLDD3GJE2WHNZYZGY2WWLT';
    const CLIENT_SECRET = '&client_secret=D0FE0QLWIPPSTJEETRUM0IKURTWV1XD5W1WDTW20C5KW33OZ';
    const DATE = '&v=20170818';
    const LATLNG = '&ll=58.97,5.73';
    const QUERY = '&query=' + locationObject.name;

    const searchString = URL + CLIENT_ID + CLIENT_SECRET + DATE + LATLNG + QUERY;

    $.ajax({
        url: searchString,
        context: locationObject
    })
        .done(function (data) {

       this.name = data.response.venues[0].name;
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




