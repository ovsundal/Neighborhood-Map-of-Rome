'use strict';

let map;
let viewModel;
let infoWindow;
let currentMarker;
let service;
let warnedUserOfApiCallbackError = false;

const initialLocations = [
    {
        "geometry": {
            "location": {"lat": 58.970936, "lng": 5.732062}
        },
        "name": "Døgnvill Burger Stavanger",
        "formatted_address": "Skagen 13, 4006 Stavanger, Norway",
        "rating": 4.5,
        "types": "bar, restaurant, food, point_of_interest, establishment, "
    },
    {
        "geometry": {
            "location": {"lat": 58.970818, "lng": 5.735233}
        },
        "name": "Steam Kaffebar Stavanger",
        "formatted_address": "Klubbgata 5, 4013 Stavanger, Norway",
        "rating": 4.4,
        "types": "cafe, food, store, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.970135, "lng": 5.736521}
        },
        "name": "Thai Nong Khai As",
        "formatted_address": "Smedgata 7, 4013 Stavanger, Norway",
        "rating": 4.5,
        "types": "restaurant, food, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.971349, "lng": 5.738650}
        },
        "name": "Mogul India Restaurant",
        "formatted_address": "Verksgata 9, 4013 Stavanger, Norway",
        "rating": "4.6",
        "types": "restaurant, food, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.972237, "lng": 5.732062}
        },
        "name": "Delhi Bar & Restaurant",
        "formatted_address": "Kirkegata 36, 4006 Stavanger, Norway",
        "rating": 3.9,
        "types": "restaurant, bar, food, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.969254, "lng": 5.727093}
        },
        "name": "Comfort Hotel Square",
        "formatted_address": "Løkkeveien 41, 4008 Stavanger, Norway",
        "rating": 4.2,
        "types": "lodging, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.970708, "lng": 5.744269}
        },
        "name": "Scandic Stavanger City Hotel",
        "formatted_address": "Reidar Berges Gate 7, 4013 Stavanger, Norway",
        "rating": 4.2,
        "types": "lodging, point_of_interest, establishment,"
    },
    {
        "geometry": {
            "location": {"lat": 58.971122, "lng": 5.735619}
        },
        "name": "Myhregaarden Hotel",
        "formatted_address": "Nygata 24, 4006 Stavanger, Norway",
        "rating": 3.6,
        "types": "lodging, point_of_interest, establishment, "
    },
    {
        "geometry": {
            "location": {"lat": 58.970747, "lng": 5.735958}
        },
        "name": "Arkaden Torgterrassen",
        "formatted_address": "Klubbgata 5, 4013 Stavanger, Norway",
        "rating": 3.9,
        "types": "shopping_mall, point_of_interest, establishment, "
    },
    {
        "geometry": {
            "location": {"lat": 58.969797, "lng": 5.728003}
        },
        "name": "Straen Senteret",
        "formatted_address": "Lars Hertervigs gate 6, 4005 Stavanger, Norway",
        "rating": 3.8,
        "types": "shopping_mall, point_of_interest, establishment, "
    },
    {
        "geometry": {
            "location": {"lat": 58.971772, "lng": 5.737264}
        },
        "name": "Magasinblaa",
        "formatted_address": "Verksgata 2, 4013 Stavanger, Norway",
        "rating": 3.8,
        "types": "shopping_mall, point_of_interest, establishment, "
    }
];

class Location {
    constructor(data) {

        this.locationVisible = ko.observable(true);

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
        this.marker = new google.maps.Marker({
            position: this.geometry.location,
            title: this.name,
            map: map,
            animation: google.maps.Animation.DROP
        });
        this.marker.addListener('click', () => {

            viewModel.setLocation(this);
            setInfoWindowAndTriggerBounce();
        });

        //get data from FourSquare
        queryFourSquare(this);

        viewModel.locationList.push(this);
    }
}

class ViewModel {
    constructor() {

        let self = this;

        self.menuVisible = ko.observable(true);
        self.searchBarText = ko.observable("");
        self.locationList = ko.observableArray([]);
        self.currentLocation = ko.observable(self.locationList()[0]);
        self.filterAll = ko.observable(true);
        self.filterEatDrink = ko.observable(false);
        self.filterShopping = ko.observable(false);
        self.filterHotel = ko.observable(false);
        self.locationVisible = ko.observable(true);

        self.toggleMenu = () => {
            this.menuVisible(!this.menuVisible());
        };
        self.toggleFilterAll = () => {

            //make sure only one filter can be active at a time
            if (!this.filterAll()) {
                this.filterAll(!this.filterAll());
                this.filterEatDrink(false);
                this.filterShopping(false);
                this.filterHotel(false);
            } else {
                this.filterAll(!this.filterAll());
            }
            self.applyFilter();
        };
        self.toggleFilterEatDrink = () => {

            if (!this.filterEatDrink()) {
                this.filterEatDrink(!this.filterEatDrink());
                this.filterAll(false);
                this.filterShopping(false);
                this.filterHotel(false);
            } else {
                this.filterEatDrink(!this.filterEatDrink());
            }
            self.applyFilter();
        };
        self.toggleFilterShopping = () => {

            if (!this.filterShopping()) {
                this.filterShopping(!this.filterShopping());
                this.filterAll(false);
                this.filterEatDrink(false);
                this.filterHotel(false);
            } else {
                this.filterShopping(!this.filterShopping());
            }
            self.applyFilter();
        };
        self.toggleFilterHotel = () => {

            if (!this.filterHotel()) {
                this.filterHotel(!this.filterHotel());
                this.filterAll(false);
                this.filterEatDrink(false);
                this.filterShopping(false);
            } else {
                this.filterHotel(!this.filterHotel());
            }
            self.applyFilter();
        };
        self.applyFilter = () => {

            self.locationList().forEach((location) => {

                //all items starts of not shown. If any filters are toggled, see if location.type string matches
                //any items in the filterlist. If so, set it visible

                let category = location.types;
                location.locationVisible(false);
                location.marker.setVisible(false);

                //if all is selected, make everything visible
                if (this.filterAll()) {
                    location.locationVisible(true);
                    location.marker.setVisible(true);
                }
                else if (this.filterEatDrink()) {
                    //check if location category contains word 'food', if so - show
                    if (category.includes('food')) {
                        location.locationVisible(true);
                        location.marker.setVisible(true);
                    }
                }
                else if (this.filterShopping()) {
                    //check if location category contains word 'shopping_mall', if so - show
                    if (category.includes('shopping_mall')) {
                        location.locationVisible(true);
                        location.marker.setVisible(true);
                    }
                }
                else if (this.filterHotel()) {
                    //check if location category contains word 'lodging', if so - show
                    if (category.includes('lodging')) {
                        location.locationVisible(true);
                        location.marker.setVisible(true);
                    }
                } else;
            })
        };
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
        self.toggleFilterMenu = () => {
            // from https://www.w3schools.com/w3css/w3css_dropdowns.asp
            let x = document.getElementById("filter-dropdown-list");
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
            } else {
                x.className = x.className.replace(" w3-show", "");
            }
        };
        self.resetList = () => {
            //remove markers
            self.locationList().forEach((item) => {
                item.marker.setMap(null);
            });

            self.locationList.removeAll();

            populateInitialLocations();
        }
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
            //manipulate the object so it's easier to instantiate
            let types = '';
            let locationIsUnique = true;

            results[i].types.forEach((item) => {
                types += item + ', ';
            });
            results[i].types = types;
            results[i].geometry.location.lat = results[i].geometry.location.lat();
            results[i].geometry.location.lng = results[i].geometry.location.lng();

            //check that location already doesn't exist
            viewModel.locationList().forEach((item) => {
                if (item.name === results[i].name) {
                    locationIsUnique = false;
                }
            });

            if (locationIsUnique) {
                new Location(results[i]);
            }
        }
    }
}

function queryFourSquare(locationObject) {

    const URL = 'https://api.foursquare.com/v2/venues/search?';
    const CLIENT_ID = 'client_id=H0DPCUF1O2QSSN5ROACITLMGVXAKHEBQKHP3ZUIGA52SO0MN';
    const CLIENT_SECRET = '&client_secret=RFM11R3CXO2JQPO305ZQP25E3OIEXRS2TNTOBSEDVAB5C1J4';
    const DATE = '&v=20170818';
    const LATLNG = '&ll=58.97,5.73';
    const QUERY = '&query=' + locationObject.name;
    const FULL_SEARCH_STRING = URL + CLIENT_ID + CLIENT_SECRET + DATE + LATLNG + QUERY;

    $.ajax({
        url: FULL_SEARCH_STRING,
        context: locationObject
    })
        .done(function(cb) {
            try {
                cb.response.venues[0].contact.formattedPhone ?
                    this.phone = cb.response.venues[0].contact.formattedPhone : this.phone = 'No data available';
            } catch (e) {
                this.phone = 'No data available';
            }
            try {
                this.url = cb.response.venues[0].url ?
                    this.url = cb.response.venues[0].url : this.url = 'No data available';
            } catch (e) {
                this.url = 'No data available';
            }
        })
        .fail(function() {
            //improve UX by only alerting user of API fail once
            if(!warnedUserOfApiCallbackError) {
                alert('Error, could not get data from foursquare');
                warnedUserOfApiCallbackError = true;
            }

            this.phone = 'Could not retrieve data';
            this.url = 'Could not retrieve data';
    });
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

    //zoom to clicked marker
    map.panTo(viewModel.currentLocation().marker.getPosition());
}

function buildContentStringForInfoWindow(location) {
    return '<u>Data from Google maps</u>' + '</br></br>' +
        location.name + '</br>' +
        location.address + '</br>' +
        'Rating: ' + location.rating + '</br>' +
        '#' + '<i>' + location.types + '</i>' + '</br></br>' +
        '<u>Data from FourSquare</u>' + '</br></br>' +
        'Phone: ' + location.phone + '</br>' +
        'url: ' + location.url;
}

function googleMapsFailed() {
    alert('Error - Google maps failed to load');
}



