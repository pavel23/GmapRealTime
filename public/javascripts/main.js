
$(document).ready(function(){

    var socket = io.connect('http://localhost'), $document = $(document), icon = {
        redIcon: 'images/icon_map_1.png',
        yellowIcon: 'images/icon_map_2.png'
    }, positions = {}, map = {};

    socket.on('connect', function() { 

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){

                map = new GMaps({
                    el: '#map',
                    lat: 22.593726,
                    lng: -2.871101,
                    zoom: 2
                });

                map.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    icon: icon.redIcon
                });

                $document.on('mousemove', function() {
                    positions  = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    socket.emit('add:locations', positions);
                });

            }, function(error){
                console.log(error);
            }, { enableHighAccuracy: true } );
        }else{
            alert("Geolocalización no es compatible con este navegador");
        }

    });

    socket.on('user:locations', function (userId) {
        $document.data('user_id',userId);
    });

    socket.on('update:locations', function (locations) {
        console.log(map);
        if($document.data('user_id') in locations){
            delete locations[$document.data('user_id')];
        }


        for (var location in locations) {
                                map.addMarker({
                    lat: locations[location].latitude,
                    lng: locations[location].longitude,
                    icon: icon.yellowIcon
                });

        }

       //console.log(locations);
    });

});
