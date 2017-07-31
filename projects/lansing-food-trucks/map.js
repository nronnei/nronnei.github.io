 L.mapbox.accessToken = "pk.eyJ1IjoibnJvbm5laSIsImEiOiJ2emt3WUY4In0.cRYAp7rDFZvRUBkExD5kqQ";

var map = L.mapbox.map('map', 'nronnei.781eb50d', {
  zoomControl: false,
  zoom: 11,
  center: [42.790613895161556, -84.50340270996094]
});

new L.control.zoom({position: 'bottomright'}).addTo(map);


map.on('ready', function() {



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
    // txt += "<a class='lh-copy fw4' href='" + feature.properties.website + "'>View Website</a>"
    txt += "</div>"
    return txt;
  }

  var foodTrucks = L.geoJson(ftData, {

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

map

var ftData = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.549322,42.750831]},"properties":{"name":"Detroit Frankie's","location":"305 Beaver St (Ozone Brewing)","hours":"Tues – Sun: 4pm-9pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.516204,42.733818]},"properties":{"name":"El Oasis","location":"2501 E Michigan Ave","hours":"Mon – Sat: 9am-9pm; Sun: 9am-5pm","alt_loc":"600 S. Cedar St. (Tony’s Party Store) Mon – Sat: 10am-8pm","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.52654,42.730529]},"properties":{"name":"MI Pops","location":"Allen Street Farmer’s Market","hours":"Wed: 2:30pm-7pm","alt_loc":"South Lansing Farmer’s Market, 3pm-7pm; East Lansing Farmer’s Marker, 10am-2pm; Meridian Farmer’s Market, 8am-2pm (ever other week)","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.549435,42.748193]},"properties":{"name":"Meat","location":"No set location","hours":"<a href=’www.facebook.com/MEATBBQ’>Check Facebook</a> for locations and times.","alt_loc":"Old Town, Lansing","featured":"Carnivores wanted! All of our meats are slow-smoked for up to 18 hours until they are butter soft. They go perfectly with our house-made sides and sauces.; We Cater! Remember MEAT for your next party or event!"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.56762,42.712051]},"properties":{"name":"Caribbean BBQ Truck","location":"1901 S Martin Luther King Jr Blvd","hours":"Fri – Sun: 7am-8pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.554024,42.732698]},"properties":{"name":"Clint’s Hot Dog Cart","location":"Near the Capitol","hours":"Mon – Sun: 11am-2pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.545122,42.744168]},"properties":{"name":"La Cocina Cubana","location":"901 N Larch St","hours":"Mon – Sat: 11am-9:30pm; Sun: 11am-4pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.554816,42.732667]},"properties":{"name":"Pie Hole Pizza Truck","location":"Near the Capitol on Allegan","hours":"Tues: 11am-1:30pm","alt_loc":"See social media for other times and locations","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.567529,42.697569]},"properties":{"name":"Nolo’s Soul","location":"S MLK Jr Blvd & W Holmes St","hours":"Sunday: Noon-6pm","alt_loc":"Corner of Hall St. and Madison Ave., Grand Rapids","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.532419,42.682574]},"properties":{"name":"Taqueria Tomatillos","location":"1434 E Jolly Rd","hours":"Mon – Wed: 11am-7pm; Thurs – Fri: 11am-9pm; Sat: 11am-6pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.547913,42.711991]},"properties":{"name":"Texas Jack’s","location":"S Cedar St & W Mt. Hope Ave","hours":"Mon – Sun: 11am-6pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.453515,42.727248]},"properties":{"name":"Zynda BBQ and Smoke Shack","location":"2778 E Grand River Ave","hours":"Mon – Fri: 11am-7pm","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.41411,42.728743]},"properties":{"name":"Fire and Rice","location":"Meridian Township Farmers Market","hours":"Saturday 8 a.m.-2 p.m","alt_loc":"See social media for other times and locations","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.443343,42.578512]},"properties":{"name":"Good Bites","location":"BAD Brewing","hours":"Mon – Thurs.: 3-9pm; Fri – Sat: 12-9:30pm; Sun: 10-2pm (“Sunday Funday” brunch menu); Sun: 3-7pm regular menu;\nEntire schedule online at goodbitestruck.com","alt_loc":"July 27th, 100 N Capitol Ave, Lansing, Farmers Market at the Capitol; 10am-2pm","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.553552,43.001307]},"properties":{"name":"Crave","location":"M21, just East of town","hours":"","alt_loc":"","featured":"FALSE"}},{"type":"Feature","geometry":{"type":"Point","coordinates":[-84.563721,43.023158]},"properties":{"name":"Chuckie D's BBQ","location":"St. John’s VFW","hours":"Mon-Fri: 11am-2pm; Open until Labor Day","alt_loc":"After Labor Day they move to Uncle John's Cider Mill on the weekends","featured":"FALSE"}}]};
