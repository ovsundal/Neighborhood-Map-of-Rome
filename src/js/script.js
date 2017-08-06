$( document ).ready(function() {
//initialize function
    initMap();
});

//model data
let markerContainer = ko.observableArray([
    {
        "position": {lat: 58.970936, lng: 5.732062},
        "title": 'Døgnvill'
    },
    {
        "position": {lat: 58.970818, lng: 5.735233},
        "title": 'Steam Kaffebar'
    },
    {
        "position": {lat: 58.970135, lng: 5.736521},
        "title": 'Thai Nong Khai As'
    },
    {
        "position": {lat: 58.971349, lng: 5.738650},
        "title": 'Mogul India'
    },
    {
        "position": {lat: 58.972237, lng: 5.732062},
        "title": 'Delhi Bar & Restaurant'
    },
    {
        "position": {lat: 58.973484, lng: 5.734870},
        "title": 'Norwegian Petroleum Museum'
    }
]);

function initMap() {

    //create map
    let stavanger = {lat: 58.9700, lng: 5.7331};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: stavanger
    });

        //QUESTION: Why is this loop run twice?
    //add markers to map
    for (let i = 0; i < markerContainer().length; i++) {
        let marker = new google.maps.Marker({
            position: markerContainer()[i].position,
            map: map,
            title: markerContainer()[i].title
        });

    //add infowindows to markers
        let infoWindow = new google.maps.InfoWindow({
            content: markerContainer()[i].title
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        //append marker location to listview
        $(".sidebar-nav").append('<li><a href="#">' + markerContainer()[i].title + '</a></li>');
    }
}

