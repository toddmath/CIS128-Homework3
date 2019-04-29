    // Event Listener on page load
    $( document ).ready(function() {
      // Initialize backstretch hero slideshow
      $.backstretch([
        "img/freestocks-org-485685-unsplash.jpg",
        "img/mink-mingle-424587-unsplash.jpg",
        "img/ciprian-boiciuc-193062-unsplash.jpg",
        "img/susan-holt-simpson-799094-unsplash.jpg",
        "img/zhen-hu-674293-unsplash.jpg"
      ], {duration: 3000, fade: 750});

      // Initialize mdb WOW class for scroll revealed animations
      new WOW().init();

      // Create dark switch event listener
      const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
      var root = document.querySelector(':root');
      var rootStyles = getComputedStyle(root);

      // Create function to switch theme from darkmode to regular-
      function switchTheme(e) {
        if (e.target.checked) {
          document.documentElement.setAttribute('data-theme', 'dark');  // Set theme to dark-mode
          localStorage.setItem('theme', 'dark');  // Store preference in localStorage
        } else {
        document.documentElement.setAttribute('data-theme', 'light');  // Set theme to regular-mode
        localStorage.setItem('theme', 'light');  // Store preference in localStorage
        }
      }

      // Add event listener for theme switcher
      toggleSwitch.addEventListener('change', switchTheme, false);

      // Create variable in localStorage ONLY if theme preference is dark-mode
      const currentTheme = localStorage.getItem('theme');

      // If the localStorage has variable, then assume it's dark-mode and switch to it on
      if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
          if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
          }
      }

      // Function with callback request to get_coords()
      function getloc() {
        navigator.geolocation.getCurrentPosition(get_coords, if_error);

      // Function to get user's latitude and longitude
      function get_coords(position) {
        latitude = position.coords.latitude;  // Create var for user's latitude
        longitude = position.coords.longitude;  // Create var for user's longitude

        prettyLat = latitude.toFixed(4);  // Round latitude to 4 decimal places
        prettyLong = longitude.toFixed(4); // Round longitude to 4 decimal places

        console.log('Latitude is ' + latitude + ' and longitude is ' + longitude);
        $("#locLat").text(prettyLat); // Fill <p> alert element with formatted latitide
        $("#locLong").text(prettyLong); // Fill <p> alert element with formatted longitude
      }

    // Function for location error catching and error logging
    function if_error(err) {
      if (err.code == 1) {
        console.log('err.code == 1 -> User Denied');
        alert('User Denied');
      }
      if (err.code == 2) {
        console.log('err.code == 2 -> Position unavailable');
        alert('Position unavailable');
      }
      if (err.code == 3) {
        console.log('err.code == 3 -> Timeout');
        alert('Timeout');
      }
    }
  }
  getloc();  // Call getLoc()
    });

      // Function to create Google map and direction panel
      function regular_map() {
      var count;

      // Create a location on map with you're latitude and longitude
      var var_location = new google.maps.LatLng(latitude, longitude);

      // Initialize Google Directions and call it's renderer
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();

      // Create a location on map for ABC Toys
      var var_shop_location = new google.maps.LatLng(37.534928, -122.332982);

      // Create location variable with "you're" location and ABC Toy's
      var locations = [
        ['You', latitude, longitude],
        ['Shop', 37.534928, -122.332982]
      ];

      $("#origin-input").val(var_location);
      $("#destination-input").val(var_shop_location);

      // Create info window for ABC Toys
      //var infowindow_store =  new google.maps.InfoWindow({
      //  content: "ABC Toy Store!!"
      //});
      // Bind ABC info window to it's marker and the main map
      //infowindow_store.open(var_map, var_shop_marker);

      // Create an info window for "You're" marker when clicked
      //var infowindow_you = new google.maps.InfoWindow({
      //  content: "Your current location."
      //});
      // Bind "you're" info window to both "you're" marker and the main map
      //infowindow_you.open(var_map, var_marker);

      // Map options
      var var_mapoptions = {
        mapTypeControl: false,
        center: var_location,
        zoom: 11
      };

      // Initialize map variable and bind it to div with class=map-container
      var var_map = new google.maps.Map(document.getElementById("map-container"),
        var_mapoptions);

      // Initialize directions panel and bind it to div with class=directionsPanel
      directionsDisplay.setPanel(document.getElementById('directionsPanel'));

      // Initialize directions to our main map (draw route on map)
      directionsDisplay.setMap(var_map);

      // Initialize marker for "You're" location
      //var var_marker = new google.maps.Marker({
      //  position: var_location,
      //  map: var_map,
      //  title: "You",
      //  animation: google.maps.Animation.DROP
      //});

      var var_marker = window.setTimeout(function() {
          new google.maps.Marker({
            position: var_location,
            map: var_map,
            animation: google.maps.Animation.DROP,
            title: "You"
          });
        }, 2000);

      // Initialize marker for ABC shops
      var var_shop_marker = new google.maps.Marker({
        position: var_shop_location,
        map: var_map,
        title: "ABC Toys",
        animation: google.maps.Animation.BOUNCE,
        icon: './shop.png'
      });

      // Create driving direction request between you and ABC Toys
      var var_directionsrequest = {
        origin: var_location,
        destination: var_shop_location,
        travelMode: 'DRIVING',
        region: 'US'
      };

      // Event Listener to zoom in on ABC marker when clicked
      var_shop_marker.addListener('click', function() {
        var_map.setZoom(15);
        var_map.setCenter(var_shop_marker.getPosition());
      });

      new AutocompleteDirectionsHandler(var_map);

    // Initialize Google directions
    directionsService.route(var_directionsrequest, function(response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
      }
    });
  }

  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationId = null;
    this.travelMode = 'DRIVING';
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    // Specify just the place data fields that you need.
    originAutocomplete.setFields(['place_id']);

    var destinationAutocomplete =
      new google.maps.places.Autocomplete(destinationInput);
    // Specify just the place data fields that you need.
    destinationAutocomplete.setFields(['place_id']);

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      destinationInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
  }

  // Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
  id, mode) {
var radioButton = document.getElementById(id);
var me = this;

radioButton.addEventListener('click', function() {
  me.travelMode = mode;
  me.route();
});
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
  autocomplete, mode) {
var me = this;
autocomplete.bindTo('bounds', this.map);

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();

  if (!place.place_id) {
    window.alert('Please select an option from the dropdown list.');
    return;
  }
  if (mode === 'ORIG') {
    me.originPlaceId = place.place_id;
  } else {
    me.destinationPlaceId = place.place_id;
  }
  me.route();
});
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route(
      {
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
      },
      function(response, status) {
        if (status === 'OK') {
          me.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
};


    // Initialize maps
    google.maps.event.addDomListener(window, 'load', regular_map);

    // Event listener For map idle (finished loading or thrown error)
    google.maps.event.addListenerOnce(regular_map, 'idle', function(){
      $("#map-container").removeClass("spinner");
    });

     // We add a DOM event here to show an alert if the DIV containing the
    // map is clicked.
    //google.maps.event.addDomListener(document.getElementById("map-container"), 'click', function() {
    //  window.alert('After allowing location services, if map not loading, you must reload the page.');
    //});

    // Event Listener for screen width
    $(window).resize(function(ev){
      var wW = $(window).width();  // Initialize screen width variable
      if (wW <= 640) {
        $(".edge-header").hide();  // if mobile device hide purple header
        $("#freebird").removeClass("free-bird");  // also remove it's class to fix padding
      } else {
        $(".edge-header").show();  // if not mobile show purple header
        $("freebird").addClass("free-bird");  // also restore it's class
      }
    });