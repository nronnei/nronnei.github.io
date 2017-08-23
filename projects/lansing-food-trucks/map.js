L.mapbox.accessToken = "pk.eyJ1IjoibnJvbm5laSIsImEiOiJ2emt3WUY4In0.cRYAp7rDFZvRUBkExD5kqQ";
var DATA_URL = "http://gsx2json.com/api?id=1tVJHa9wUZPIfctVJI6k-dwyUjF67VdMA1D70WSi-CBw&integers=false&columns=false";
var INIT_BOUNDS = [[40.9840449469,-87.802734375], [47.036438503,-80.947265625]];

function getData(theUrl, callback) {

  var xhr = new XMLHttpRequest();

  var handler = function(response) {
    if (response.target.readyState == 4 && response.target.status == 200) {
      return callback(JSON.parse(response.target.responseText));
    } else {
    }
  }

  if(xhr) {
    xhr.open('GET', DATA_URL, true);
    xhr.onload = handler;
    xhr.send();
  }
};

function FeatureCollection(data) {

  if (data.length < 1) {
     throw new TypeError("Failed to create FeatureCollection, invalid input.");
  }

  var collection = {
   "type": "FeatureCollection",
   "features": []
  };

  var i = 0;
  for (truck of data) {
    collection.features.push(Feature(truck, i));
    i++;
  }

  return collection;

};

function Feature(truck, id) {

  if (typeof(truck) !== 'object') {
   throw new TypeError("Failed to create Feature, invalid JSON input.");
  }
  if(truck.hasOwnProperty('length')) {
   throw new TypeError("Failed to create Feature, invalid JSON input.");
  }

  return {
   "type": "Feature",
   "geometry": {
     "type": "Point",
     "coordinates": [truck.lon, truck.lat]
   },
   "properties": {
     "id": id,
     "name": truck.name,
     "location": truck.location,
     "hours": truck.hours,
     "alt_loc": truck.altloc,
     "featured": truck.featured,
   }
  };

};

function genContent(feature) {
  let txt = "<div class='custom-content tc'>";
  txt += "<h2>" + feature.properties.name + "</h2>";
  txt += "<h3 class='location'>" + feature.properties.location + "</h3>";
  let hours = feature.properties.hours.split(";");
  txt += "<h3 class='subheading'>Hours</h3>";
  for (var i = 0; i < hours.length; i++) {
    txt += "<p>" + hours[i] + "</p>"
  }
  if (feature.properties.alt_loc != "") {
    let alt_loc = feature.properties.alt_loc.split(";");
    txt += "<h3 class='subheading'>Other Locations</h3>";
    for (var i = 0; i < alt_loc.length; i++) {
      txt += "<p>" + alt_loc[i] + "</p>";
    }
  }
  if (feature.properties.featured.toLowerCase() != 'false') {
    txt += "<h3 class='subheading'>About MEAT</h3>";
    let featured = feature.properties.featured.split(";");
    for (var i = 0; i < featured.length; i++) {
      txt += "<p>" + featured[i] + "</p>";
    }
  }
  txt += "</div>"
  return txt;
}

var map = L.mapbox.map('map', 'nronnei.781eb50d', {
  zoomControl: false
});

new L.control.zoom({position: 'bottomright'}).addTo(map);


map.on('ready', function() {

  map.fitBounds(INIT_BOUNDS);

  var foodTrucks;
  getData(DATA_URL, function(data) {
    var ftData = FeatureCollection(data.rows);
    foodTrucks = L.geoJson(ftData, {

      pointToLayer: function(feature, latlng) {

        var markerStyle;

        // Choose icon based on feature.properties.featured
        if (feature.properties.featured.toLowerCase() != 'false') {

          markerStyle = L.icon({
            iconUrl: 'ft-featured-icon.png',
          	iconRetinaUrl: 'ft-featured-icon@2x.png',
          	iconSize: [48, 47],
          	iconAnchor: [22, 23],
            popupAnchor: [0, -28]
          });

        } else {

          markerStyle = L.icon({
            iconUrl: 'ft-icon.png',
          	iconRetinaUrl: 'ft-icon@2x.png',
          	iconSize: [48, 48],
          	iconAnchor: [24, 24],
          	popupAnchor: [0, -28]
          });

        }

        return L.marker(latlng, {icon: markerStyle});

      },
      onEachFeature: function(feature, layer) {

        layer.bindPopup(
          genContent(feature),
          {
          closeOnClick: true,
          className: 'custom',
          maxWidth: 400,
          minWidth: 175
        });

      }

    });

    foodTrucks.addTo(map);
    map.fitBounds(foodTrucks.getBounds());
  });




});
