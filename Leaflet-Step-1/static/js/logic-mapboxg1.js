mapboxgl.accessToken = API_KEY;
var myMap = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [0, 0],
zoom: 1
});
 
// Add the control to the map.
myMap.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl
})
);

var prevdayUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(prevdayUrl).then(function(data) {
  
   features = data.features;

   for (var i = 0; i < features.length; i++) {

    var place = features[i].properties.place;
    var lng = features[i].geometry.coordinates[0];
    var lat = features[i].geometry.coordinates[1];
    var depth = features[i].geometry.coordinates[2];
    var magnitude = features[i].properties.mag;
    var time = features[i].properties.time;

    var d = new Date(time);
    var formattedDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes;

    formattedDate = formattedDate + " " + formattedTime;

    var popup = new mapboxgl.Popup()
    //.setText(place + ":  magnitutde = " + magnitude + " and depth = " + depth);
    .setHTML("Location:  " + place
    + ".<br> Time occured:  " + formattedDate 
    + ".<br> Magnitutde:  " + magnitude 
    + ".<br> Depth:  " + depth + ".");

    new mapboxgl.Marker()
    .setLngLat([lng,lat])
    .setPopup(popup)
    .addTo(myMap);
    }
});



