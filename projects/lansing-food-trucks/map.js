L.mapbox.accessToken = "pk.eyJ1IjoibnJvbm5laSIsImEiOiJjajdod3JsdDYxbWN3MndvMnYxMjZtcWcxIn0.1L7H2sycCV3FwNH2hXP52A";
var INIT_BOUNDS = [[40.9840449469,-87.802734375], [47.036438503,-80.947265625]];

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

  var data = {"rows":[{"name":"Detroit Frankie's","location":"305 Beaver St (Ozone Brewing)","hours":"Tues – Sun: 4pm-9pm","altloc":"","featured":"FALSE","lat":"42.750831","lon":"-84.549322"},{"name":"El Oasis","location":"2501 E Michigan Ave","hours":"Mon – Sat: 9am-9pm; Sun: 9am-5pm","altloc":"600 S. Cedar St. (Tony’s Party Store) Mon – Sat: 10am-8pm","featured":"FALSE","lat":"42.733818","lon":"-84.516204"},{"name":"MI Pops","location":"Allen Street Farmer’s Market","hours":"Wed: 2:30pm-7pm","altloc":"South Lansing Farmer’s Market, 3pm-7pm; East Lansing Farmer’s Marker, 10am-2pm; Meridian Farmer’s Market, 8am-2pm (ever other week)","featured":"FALSE","lat":"42.730529","lon":"-84.52654"},{"name":"Meat","location":"No set location","hours":"<a href=’www.facebook.com/MEATBBQ’>Check Facebook</a> for locations and times.","altloc":"Old Town, Lansing","featured":"Carnivores wanted! All of our meats are slow-smoked for up to 18 hours until they are butter soft. They go perfectly with our house-made sides and sauces.; We Cater! Remember MEAT for your next party or event!","lat":"42.748193","lon":"-84.549435"},{"name":"Caribbean BBQ Truck","location":"1901 S Martin Luther King Jr Blvd","hours":"Fri – Sun: 7am-8pm","altloc":"","featured":"FALSE","lat":"42.712051","lon":"-84.56762"},{"name":"Clint’s Hot Dog Cart","location":"Near the Capitol","hours":"Mon – Sun: 11am-2pm","altloc":"","featured":"FALSE","lat":"42.732698","lon":"-84.554024"},{"name":"La Cocina Cubana","location":"901 N Larch St","hours":"Mon – Sat: 11am-9:30pm; Sun: 11am-4pm","altloc":"","featured":"FALSE","lat":"42.744168","lon":"-84.545122"},{"name":"Pie Hole Pizza Truck","location":"Near the Capitol on Allegan","hours":"Tues: 11am-1:30pm","altloc":"See social media for other times and locations","featured":"FALSE","lat":"42.732667","lon":"-84.554816"},{"name":"Nolo’s Soul","location":"S MLK Jr Blvd & W Holmes St","hours":"Sunday: Noon-6pm","altloc":"Corner of Hall St. and Madison Ave., Grand Rapids","featured":"FALSE","lat":"42.697569","lon":"-84.567529"},{"name":"Taqueria Tomatillos","location":"1434 E Jolly Rd","hours":"Mon – Wed: 11am-7pm; Thurs – Fri: 11am-9pm; Sat: 11am-6pm","altloc":"","featured":"FALSE","lat":"42.682574","lon":"-84.532419"},{"name":"Texas Jack’s","location":"S Cedar St & W Mt. Hope Ave","hours":"Mon – Sun: 11am-6pm","altloc":"","featured":"FALSE","lat":"42.711991","lon":"-84.547913"},{"name":"Zynda BBQ and Smoke Shack","location":"2778 E Grand River Ave","hours":"Mon – Fri: 11am-7pm","altloc":"","featured":"FALSE","lat":"42.727248","lon":"-84.453515"},{"name":"Fire and Rice","location":"Meridian Township Farmers Market","hours":"Saturday 8 a.m.-2 p.m","altloc":"See social media for other times and locations","featured":"FALSE","lat":"42.728743","lon":"-84.41411"},{"name":"Good Bites","location":"BAD Brewing","hours":"Mon – Thurs.: 3-9pm; Fri – Sat: 12-9:30pm; Sun: 10-2pm (“Sunday Funday” brunch menu); Sun: 3-7pm regular menu; <a href=”goodbitestruck.com” _target=”blank”>Full Schedule Online</a>\nEntire schedule online at goodbitestruck.com","altloc":"July 27th, 100 N Capitol Ave, Lansing, Farmers Market at the Capitol; 10am-2pm","featured":"FALSE","lat":"42.578512","lon":"-84.443343"},{"name":"Crave","location":"M21, just East of town","hours":"","altloc":"","featured":"FALSE","lat":"43.001307","lon":"-84.553552"},{"name":"Chuckie D's BBQ","location":"St. John’s VFW","hours":"Mon-Fri: 11am-2pm; Open until Labor Day","altloc":"After Labor Day they move to Uncle John's Cider Mill on the weekends","featured":"FALSE","lat":"43.023158","lon":"-84.563721"},{"name":"Las Flores Taco Truck","location":"Mill Street off of Main","hours":"Mon – Fri: 10am-8pm; Sat: 10am-5pm; Sun: Closed","altloc":"<a href=”facebook.com/LasFloresER” _target=”blank”>Find Us on Facebook.</a>","featured":"FALSE","lat":"42.513223","lon":"-84.654976"},{"name":"El Oasis Haslett","location":"Corner of Marsh & Haslett Roads","hours":"<a href=”https://facebook.com/ElOasisLLC/” _target=”blank”>See Facebook for More Info</a>","altloc":"","featured":"FALSE","lat":"42.747705","lon":"-84.408226"},{"name":"From Scratch Food Truck","location":"5000 Marsh Rd","hours":"<a href=”https://facebook.com/fromscratchfoodtruck/” _target=”blank”>See Facebook for More Info</a>","altloc":"","featured":"FALSE","lat":"42.725995","lon":"-84.413382"}]};

});
