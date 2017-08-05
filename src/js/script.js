$( document ).ready(function() {

<!-- Menu Toggle Script -->
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function initMap() {
    let stavanger = {lat: 58.9700, lng: 5.7331};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: stavanger
    });
}

//initialize function
initMap();

});