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

    self.currentLocation = ko.observable(self.locationList()[0]);

    self.setLocation = function (clickedLocation) {
        self.currentLocation(clickedLocation);
        console.log(self.currentLocation());
    };

    //add markers and location windows
    self.populateMapWithMarkers = function () {
        this.locationList().forEach(function (item) {

            //create infowindow
            let infowindow = new google.maps.InfoWindow({
                content: item.info
            });

            //create markers
            let marker = new google.maps.Marker({
                position: item.position,
                title: item.name,
                map: map,
                animation: google.maps.Animation.DROP
            });
            //todo: implement this
            //add unique listener to marker, from https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example

            // google.maps.event.addListener(marker, 'click', (function (marker, i) {
            //     return function () {
            //         infowindow.setContent()
            //     }
            // }));

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        });
    }

    self.createMarkers = function(item) {

        item.marker =  new google.maps.Marker({
            position: item.position,
            title: item.name,
            map: map,
            animation: google.maps.Animation.DROP
        });

        //todo add listener with bounce onclick here
    }
};

let viewModel = new ViewModel();

ko.applyBindings(viewModel);

//callback function for google map async load
//QUESTION: Is this the right way to interact with viewmodel?
window.mapCallback = function () {
    initMap();

    //create markers
    viewModel.locationList().forEach(function (item) {
        viewModel.createMarkers(item);
    });

};

function initMap() {

    const stavanger = {lat: 58.9700, lng: 5.7331};
    map = new google.maps.Map(document.getElementById('map'), {
        center: stavanger,
        zoom: 15,
        disableDefaultUI: true
    });
}
