$(document).ready(function() {
 
// global variables
  // default values for lat/lon in case user does not provide permission to know their geolocation
  // needed so api request to trailruns doesn't break

  var latitude = 37.7749;
  var longitude = -122.4194;

  // set current day using moment.js -- referenced by weather function
  var currentDay = moment().format("LL");

  //invoke runWeather function to display default weather info on page load
  runWeather();

  // on click event listener for search button
  $("#submit-btn").on("click", function() {
    console.log("hello");
    var locationSearched = $("#location-searched")
      .val()
      .trim();
    $("#city-searched").val("");
    runWeather(locationSearched);
    // add runCriteria function to invoke
    
  });


  // function to retrieve current day's weather and create HTMl elements
  // set default city to San Francisco so page isn't blank on load
  function runWeather(locationSearched = "San Francisco") {
    // locationSearched.preventDefault();
    //api request from https://openweathermap.org/api
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET"
    }).then(function(response) {
        console.log(response);
      $("#weather-content").empty();
      // make variables and HTML elements
      var dailyForecastCard = $("<div>").addClass("ui card fluid");
      var cityName = $("<p>")
        .attr("id", "weather-header")
        .text(response.name + ": ");
      var dateTime = $("<span>").text(currentDay);
      var weatherIcon = $("<img>").attr("id", "weather-icon").attr(
        "src",
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      var windSpeed = $("<p>")
        .attr("id", "weather-description")
        .text("Wind Speed: " + response.wind.speed + "MPH");
      var humidity = $("<p>")
        .attr("id", "weather-description")
        .text("Humidity: " + response.main.humidity + "%");
      var temperature = $("<p>")
        .attr("id", "weather-description")
        .text("Temperature: " + response.main.temp + "°F");
      // append HTML elements
      cityName.append(dateTime);
      dailyForecastCard.append(
        cityName,
        weatherIcon,
        temperature,
        windSpeed,
        humidity
      );
      $("#weather-content").append(dailyForecastCard);
    });
  }


  // built in DOM geolocation
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
}
  function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);
}
//   function to retrieve trail run data based on user criteria and create HTML elements to append

  function runCriteria(event) {
    // need to feed in longitude/latitude from geolocation or use default values or api request fails
    // reference latitude from geolocation 
    // reference longitude from geolocation 
    var $maxDistance = $(".maxDistance") // default is 30, range is 0-200
    var $minDistance = $(".minDistance") // default is 0, range is 0-200
    var $maxResults = $(".ui fluid dropdown") // default is 10, range is 0-500
    var $minRating = "" // default is 0, range is 0-4, this is star rating, may not need
    var $difficulty = $(".difficulty")
        // difficulty index -- colors to difficulty
          // Easy - Green
          // Interediate - Blue
          // Difficult, Very Difficult - Black

    getLocation();

    var runCriteriaURL = `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=200717421-32b757164356f1ff9be99bc247820aea`
  
    if (maxDistance) {
        runCriteriaURL += `&maxDistance=${maxDistance}`;
    }
    if (minDistance) {
        runCriteriaURL += `&minLength=${minDistance}`;
    }
    if (maxResults) {
        runCriteriaURL += `&maxResults=${maxResults}`;
    }
    if (minRating) {
        runCriteriaURL += `&minStars=${minRating}`;
    }
    if (difficulty) {
      runCriteriaURL += `&difficulty=${difficulty}`;
  }
    //api request from https://www.trailrunproject.com/data
    $.ajax({
        url: runCriteriaURL,
        type: "GET"
      }).then(function(response) {
          console.log(response);
          
          var trails = response.trails;
          var trailCount = $maxResults.val();

          var $ulEl = $('<ul>');
          $('.results-content').append($ulEl);

          for (let i = 0; i <= trailCoun; i++) {
            var name = trails[i].name;
            var summary = trails[i].summary;
            var difficulty = trails[i].difficulty;
            var stars = trails[i].stars;
            var location = trails[i].location;
            var length = trails[i].length;
            var imgSmall = trails[i].imgSqSmall;
            var url = trails[i].url;
            var $li = $('<li>');
            var $strong = $('<strong>').text(name);
            var $pSum = $('<p>').text(summary);
            var $pSta = $('<p>').text(stars);
            var $ploc = $('<p>').text(location);
            var $imglen = $('<p>').text(stars);
            var $aUrl = $('<p>').text(stars);
            
          }
          //append html elements to the page
  })
}

runCriteria();
});