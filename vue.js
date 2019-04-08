var app = new Vue({
  el: '#app',
  data: {
    stops: [],
    numStops: 10,
    latitude: 0,
    longitude: 0
  },
  methods: {
    computeStopDistance: function ()
    {
      for (let i = 0; i < this.stops.length; i ++)
      {
        this.stops[i].distance = this.getDistance(this.latitude, this.longitude, this.stops[i].lat, this.stops[i].lon);
      }
    },
    getDistance: function(userLatitude, userLongitude, stopLatitude, stopLongitude)
    {
      // Pythagrean theorem:
      let a = (userLatitude - stopLatitude);
      let b = (userLongitude - stopLongitude);
      let dist = Math.sqrt(a**2 + b**2);

      // Each degree is ~ 69 miles
      return( dist * 69 ).toFixed(2);
    }
  },

  created: function () {
    fetch('https://utils.pauliankline.com/stops.json')
      .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // for (i in myJson) {
    //   app.stops[i] = myJson[i];
    // }
    //
    // Here was the problem. The way computed property works is that
    // it will be re computed whenever the variables it depends to are
    // changed. In your previous approach, the variables do not really
    // change, i.e. it is still the same array, but you are just inserting
    // value to it (the base address memory of the variable is still the same).
    // So, the computed property is not recomputed because
    // it does not see that you change the variable. By assigning app.stops = myJson,
    // you are actally changing the variable (the base address memory), thus the computed property
    // actually gets re computed. Furthermore, since filteredStops also
    // depends on numStops, then whenever you change the variable
    // numStops, it will get re computed.

    // Thank you Oqi! That really helped me understand what was happening.
    app.stops = myJson
  })

  if ("geolocation" in navigator) {
    function geo_success(position) {
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude;      
      this.computeStopDistance();
    }
    function geo_error() {
      alert("Sorry, no position available.");
    }
    var geo_options = {
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 27000
    };
    var wpid = navigator.geolocation.watchPosition(geo_success.bind(this), geo_error, geo_options);
  }
  else {
    console.log("Unable to detect user location :'(");
  };
  },

  computed: {
    filteredStops: function() {

      this.stops.sort(function(a, b){return a.distance - b.distance});
      // let arr = [];
      // for ( i = 0; i < this.numStops; i++)
      // {
      //   arr.push(this.stops[i]);
      // }
      // console.log(arr);
      // return arr;
      //
      // There is a simpler function in Javascript called slice, which take the subset of an
      // array.
      return this.stops.slice(0, this.numStops)
    }
  }
})
