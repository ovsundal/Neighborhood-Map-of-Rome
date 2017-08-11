// first goal: display a list with location names using Knockout.js (add the map later)

let initialLocations = [
    {
        "position": {lat: 58.970936, lng: 5.732062},
        "name": 'Døgnvill'
    },
    {
        "position": {lat: 58.970818, lng: 5.735233},
        "name": 'Steam Kaffebar'
    },
    {
        "position": {lat: 58.970135, lng: 5.736521},
        "name": 'Thai Nong Khai As'
    },
    {
        "position": {lat: 58.971349, lng: 5.738650},
        "name": 'Mogul India'
    },
    {
        "position": {lat: 58.972237, lng: 5.732062},
        "name": 'Delhi Bar & Restaurant'
    },
    {
        "position": {lat: 58.973484, lng: 5.734870},
        "name": 'Norwegian Petroleum Museum'
    }
];

let Location = function (data) {

    this.position = ko.observable({
        "lat": data.position.lat,
        "lng": data.position.lng
    });
    this.name = ko.observable(data.name);
};

let ViewModel = function () {

    let self = this;

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.setLocation = function(clickedLocation) {

        self.currentLocation(clickedLocation);

    };

};

ko.applyBindings(new ViewModel());






// hard coded Array of location objects
// https://github.com/udacity/ud864/blob/master/Project_Code_5_BeingStylish.html#L150

// initMap function (later)
// https://developers.google.com/maps/documentation/javascript/examples/map-simple

// Location constructor similiar to the Cat constructor form the JavaScript Design Patterns course (optional)

// ViewModel constructor
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models
// In the ViewmModel create an observableArray with location objects
// this.locations = ko.observableArray(locations); // if you do not want to use a Location constructor
// Separating Out the Model video lesson:
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34284402380923
// Adding More Cats video lesson
// https://classroom.udacity.com/nanodegrees/nd001/parts/e87c34bf-a9c0-415f-b007-c2c2d7eead73/modules/271165859175461/lessons/3406489055/concepts/34648186930923

// Instantiate the ViewModel
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// The difference between defining the ViewModel as a function expression or defining the viewModel as an object literal:
// https://discussions.udacity.com/t/text-not-updating-with-search-box/182886/6

// Apply the bindings aka activate KO
// http://knockoutjs.com/documentation/observables.html#mvvm-and-view-models#activating-knockout


// $( document ).ready(function() {
// //initialize function
//     initMap();
// });
//
// //model data
// //Question: I don't really understand how different components in this project fits together. Am i supposed to
// //obtain information from other APIs (f.e. wikipedia) and add that info to this array?
// let markerContainer = ko.observableArray([
//     {
//         "position": {lat: 58.970936, lng: 5.732062},
//         "title": 'Døgnvill'
//     },
//     {
//         "position": {lat: 58.970818, lng: 5.735233},
//         "title": 'Steam Kaffebar'
//     },
//     {
//         "position": {lat: 58.970135, lng: 5.736521},
//         "title": 'Thai Nong Khai As'
//     },
//     {
//         "position": {lat: 58.971349, lng: 5.738650},
//         "title": 'Mogul India'
//     },
//     {
//         "position": {lat: 58.972237, lng: 5.732062},
//         "title": 'Delhi Bar & Restaurant'
//     },
//     {
//         "position": {lat: 58.973484, lng: 5.734870},
//         "title": 'Norwegian Petroleum Museum'
//     }
// ]);
//
// function initMap() {
//
//     //create map
//     let stavanger = {lat: 58.9700, lng: 5.7331};
//     let map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 15,
//         center: stavanger
//     });
//
//         //QUESTION: Why is this loop run twice?
//     //add markers to map
//     for (let i = 0; i < markerContainer().length; i++) {
//         let marker = new google.maps.Marker({
//             position: markerContainer()[i].position,
//             map: map,
//             title: markerContainer()[i].title
//         });
//
//     //add infowindows to markers
//         let infoWindow = new google.maps.InfoWindow({
//             content: markerContainer()[i].title
//         });
//
//         marker.addListener('click', function() {
//             infoWindow.open(map, marker);
//         });
//
//         //append marker location to listview
//         $(".sidebar-nav").append('<li><a href="#">' + markerContainer()[i].title + '</a></li>');
//     }
// }
//
//
// //Question: Why can't i move input and searchBox into initMap (new google.maps.places.SearchBox(input) returns undefined
// function initAutocomplete() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: -33.8688, lng: 151.2195},
//         zoom: 13,
//         mapTypeId: 'roadmap'
//     });
//
//     // Create the search box and link it to the UI element.
//     var input = document.getElementById('pac-input');
//     var searchBox = new google.maps.places.SearchBox(input);
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//
//     // Bias the SearchBox results towards current map's viewport.
//     map.addListener('bounds_changed', function() {
//         searchBox.setBounds(map.getBounds());
//     });
//
//     var markers = [];
//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.
//     searchBox.addListener('places_changed', function() {
//         var places = searchBox.getPlaces();
//
//         if (places.length == 0) {
//             return;
//         }
//
//         // Clear out the old markers.
//         markers.forEach(function(marker) {
//             marker.setMap(null);
//         });
//         markers = [];
//
//         // For each place, get the icon, name and location.
//         var bounds = new google.maps.LatLngBounds();
//         places.forEach(function(place) {
//             if (!place.geometry) {
//                 console.log("Returned place contains no geometry");
//                 return;
//             }
//             var icon = {
//                 url: place.icon,
//                 size: new google.maps.Size(71, 71),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(17, 34),
//                 scaledSize: new google.maps.Size(25, 25)
//             };
//
//             // Create a marker for each place.
//             markers.push(new google.maps.Marker({
//                 map: map,
//                 icon: icon,
//                 title: place.name,
//                 position: place.geometry.location
//             }));
//
//             if (place.geometry.viewport) {
//                 // Only geocodes have viewport.
//                 bounds.union(place.geometry.viewport);
//             } else {
//                 bounds.extend(place.geometry.location);
//             }
//         });
//         map.fitBounds(bounds);
//     });
// }