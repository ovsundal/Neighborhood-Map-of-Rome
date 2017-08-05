$( document ).ready(function() {

<!-- Menu Toggle Script -->
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

    let markerContainer = [
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
    ];

function initMap() {
    let stavanger = {lat: 58.9700, lng: 5.7331};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: stavanger
    });

    //add markers to map
    for (let i = 0; i < markerContainer.length; i++) {
        let marker = new google.maps.Marker({
            position: markerContainer[i].position,
            map: map,
            title: markerContainer[i].title
        });
    }

}

//initialize function
initMap();

});