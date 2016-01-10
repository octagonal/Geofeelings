var firebaseRef = new Firebase("https://geofeelings.firebaseio.com/");
var geoFire = new GeoFire(firebaseRef);
var ref = geoFire.ref(); 

geoFire.set("some_key", [37.79, -122.41]).then(function() {
  console.log("Provided key has been added to GeoFire");
}, function(error) {
  console.log("Error: " + error);
});

geoFire.get("some_key").then(function(location) {
  if (location === null) {
    console.log("Provided key is not in GeoFire");
  }
  else {
    console.log("Provided key has a location of " + location);
  }
}, function(error) {
  console.log("Error: " + error);
});

/*
var myDataRef = new Firebase('https://torrid-inferno-8068.firebaseio.com/');
$('#messageInput').keypress(function (e) {
	if (e.keyCode == 13) {
		var name = $('#nameInput').val();
		var text = $('#messageInput').val();
		myDataRef.push({name: name, text: text});
		$('#messageInput').val('');
	}
});
myDataRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
});
function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
}
*/

/* Initializes Google Maps */
function initializeMap() {
  // Get the location as a Google Maps latitude-longitude object
  var loc = new google.maps.LatLng(37.785326, -122.405696);

  // Create the Google Map
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: loc,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create a draggable circle centered on the map
  var circle = new google.maps.Circle({
    strokeColor: "#6D3099",
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: "#B650FF",
    fillOpacity: 0.35,
    map: map,
    center: loc,
    radius: ((10) * 1000),
    draggable: true
  });

  //Update the query's criteria every time the circle is dragged
  var updateCriteria = _.debounce(function() {
    var latLng = circle.getCenter();
    console.log(latLng.lat());
    /*
    geoQuery.updateCriteria({
      center: [latLng.lat(), latLng.lng()],
      radius: radiusInKm
    });
   */
  }, 10);
  google.maps.event.addListener(circle, "drag", updateCriteria);
}

