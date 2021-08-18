var prevdayUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

depth_list = [];
magnitude_list = [];

var geojson;

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  return (magnitude) * 5;
}

function circleColor(depth) {
  if (depth < 1) {
    return "#03f0fc"
  }
  else if (depth < 10) {
    return "#03befc"
  }
  else if (depth < 25) {
    return "#03a5fc"
  }
  else if (depth < 60) {
    return "#0384fc"
  }
  else if (depth < 100) {
    return "#0367fc"
  }
  else {
    return "#031cfc"
  }
}

// Perform a GET request to the query URL
d3.json(prevdayUrl).then(function(data) {

    var features = data.features;
    
    earthquakeMarkers = [];
    var markers = L.markerClusterGroup()
    
    for (var i = 0; i < features.length; i++) {

        var place = features[i].properties.place;
        var lng = features[i].geometry.coordinates[0];
        var lat = features[i].geometry.coordinates[1];
        var depth = features[i].geometry.coordinates[2];
        var magnitude = features[i].properties.mag;
        var time = features[i].properties.time;

        depth_list.push(depth);
        magnitude_list.push(magnitude);

        var d = new Date(time);
        var formattedDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
        var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
        var formattedTime = hours + ":" + minutes;
    
        formattedDate = formattedDate + " " + formattedTime;

        
        markers.addLayer(
            L.circleMarker([lat,lng], {
              fillOpacity: 0.75,
              color: "white",
              fillColor: circleColor(depth),
              radius: markerSize(magnitude)
            })
            .bindPopup("Location:  " + place
            + ".<br> Time occured:  " + formattedDate 
            + ".<br> Magnitutde:  " + magnitude 
            + ".<br> Depth:  " + depth + ".")
        );
        earthquakeMarkers.push(markers);
    };

    var earthquakeLayer = L.layerGroup(earthquakeMarkers);
  
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakeLayer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [streetmap, earthquakeLayer]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  myMap   
});

