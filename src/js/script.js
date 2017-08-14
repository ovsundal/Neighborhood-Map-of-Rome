'use strict';

let map;
const initialLocations = [
    {
        "position": {lat: 58.970936, lng: 5.732062},
        "name": 'Døgnvill',
        "info": 'info for Døgnvill'
    },
    {
        "position": {lat: 58.970818, lng: 5.735233},
        "name": 'Steam Kaffebar',
        "info": 'info for Steam Kaffebar'
    },
    {
        "position": {lat: 58.970135, lng: 5.736521},
        "name": 'Thai Nong Khai As',
        "info": 'info for Thai Nong Khai As'
    },
    {
        "position": {lat: 58.971349, lng: 5.738650},
        "name": 'Mogul India',
        "info": 'info for Mogul India'
    },
    {
        "position": {lat: 58.972237, lng: 5.732062},
        "name": 'Delhi Bar & Restaurant',
        "info": 'info for Delhi Bar & Restaurant'
    }
];

class Location {
    constructor(data) {

        this.position = {
            "lat": data.position.lat,
            "lng": data.position.lng
        };
        this.name = data.name;
        this.info = data.info;
    }
}

let ViewModel = function () {

    let self = this;

    self.menuVisible = ko.observable(true);

    self.toggleMenu = function () {
        this.menuVisible(!this.menuVisible());
    };

    self.locationList = ko.observableArray([]);

    //add initial locations to an observable (data-bindable) array
    initialLocations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    self.currentLocation = ko.observable(self.locationList()[1]);

    self.setLocation = function (clickedLocation) {

        // debugger;
        for(let i = 0; i < self.locationList().length; i++) {

            //search for location clicked in observable array
            if(clickedLocation === self.locationList()[i]) {

                //set the found location as new current location
                self.currentLocation = ko.observable(self.locationList()[i]);

                //if infoWindow does not exist, create it.
                if(!self.infoWindow) {
                    self.infoWindow = new google.maps.InfoWindow();
                }
                // Change content and marker with new currentLocation
                self.infoWindow.setContent(self.currentLocation().name);
                self.infoWindow.open(map, self.currentLocation().marker);
            }
        }
    };

    self.createMarkers = function(item) {

        item.marker =  new google.maps.Marker({
            position: item.position,
            title: item.name,
            map: map,
            animation: google.maps.Animation.DROP
        });

        //add listener with bounce effect does not work when clicked. What is wrong in the code below?
        //QUESTION: This does not work - see error message in console
        // item.marker.addListener('click', toggleBounce());
        //
        // //todo add listener with bounce onclick here
        // function toggleBounce() {
        //     if (this.marker.getAnimation() !== null) {
        //         this.marker.setAnimation(null);
        //     } else {
        //         this.marker.setAnimation(google.maps.Animation.BOUNCE);
        //     }
        // }
    };

    self.createMarkersAndInfoWindow = function () {

        let marker;

        for(let i = 0; i < viewModel.locationList().length; i++) {

            let locationItem = viewModel.locationList()[i];

            //create the marker
            marker = new google.maps.Marker({
                position: locationItem.position,
                title: locationItem.name,
                map: map,
                animation: google.maps.Animation.DROP
            });

            //add it to location item
            locationItem.marker =  marker;

        }
    }
};

let viewModel = new ViewModel();

ko.applyBindings(viewModel);

//callback function for google map async load
window.mapCallback = function () {
    initMap();
    //QUESTION: Is this the right way to interact with viewmodel?
    viewModel.createMarkersAndInfoWindow();

};

function initMap() {

    const stavanger = {lat: 58.9700, lng: 5.7331};
    map = new google.maps.Map(document.getElementById('map'), {
        center: stavanger,
        zoom: 15,
        disableDefaultUI: true
    });
}


















