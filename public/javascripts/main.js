  var socket = io.connect('http://localhost');
  socket.on('news', function(data) {
  	console.log(data);
  	socket.emit('my other event', {
  		my: 'data'
  	});
  });


  var geolocation = function() {
  	var success = 1;

  	function displayPosition(position) {
  		success = 1;
  		console.log(position);
  		return {
  			success: success,
  			position: {
  				latitude: position.coords.latitude,
  				longitude: position.coords.longitude
  			}
  		};


  	}

  	function displayError(error) {
  		success = 0;
		var errors = {
			1: 'Permission denied',
			2: 'Posición no disponible',
			3: 'Solicitud de tiempo de espera'
		};

		return {
			success: success,
			message: errors[error.code]
		}

  	}


  	return {
  		init: function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(displayPosition, displayError, { enableHighAccuracy: true } );
			}else{
				alert("Geolocalización no es compatible con este navegador");
			}

  			
  		}
  	}
  }



  $(document).ready(function() {
  	var icon = {
  		redIcon: 'images/icon_map_1.jpg',
  		yellowIcon: 'images/icon_map_2.jpg'
  	};


  	var map = new GMaps({
  		el: '#map',
  		lat: 22.593726,
  		lng: -2.871101,
  		zoom: 2
  	});




geolocation().init();



  	map.addMarker({
  		lat: -11.8951199,
  		lng: -77.0354304,
  		icon: icon.redIcon,
  		title: 'Marker with InfoWindow'
  	})
  })