$(document).ready(function() {


  // global variables
  // default values for lat/lon in case user does not provide permission to know their geolocation
  // needed so api request to trailruns doesn't break
  var latitude = 37.7749;
  var longitude = -122.4194;

  //invoke runWeather function to display default weather info on page load
  runWeather();



  // function to retrieve current day's weather and create HTMl elements
  // set default city to San Francisco so page isn't blank on load
  function runWeather(citySearched = "San Francisco") {
    citySearched.preventDefault();
    //api request from https://openweathermap.org/api
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET"
    }).then(function(response) {
        console.log(response);
      $("#weather-container-placeholder").empty();

      // make variables and HTML elements
      var dailyForecastCard = $("<div>").addClass("card");
      var dailyForecastCardBody = $("<div>").addClass("card-body");
      var cityName = $("<h5>")
        .addClass("card-title")
        .text(response.name + ":");
      var dateTime = $("<span>").text(" " + currentDay);
      var weatherIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      var windSpeed = $("<p>")
        .addClass("card-text")
        .text("Wind Speed: " + response.wind.speed + "MPH");
      var humidity = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + response.main.humidity + "%");
      var temperature = $("<p>")
        .addClass("card-text")
        .text("Temperature: " + response.main.temp + "°F");

      // append HTML elements
      cityName.append(dateTime);
      dailyForecastCardBody.append(
        cityName,
        weatherIcon,
        temperature,
        windSpeed,
        humidity
      );
      dailyForecastCard.append(dailyForecastCardBody);
      $("#weather-container-placeholder").append(dailyForecastCard);
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
}


  // function to retrieve trail run data based on user criteria and create HTML elements to append
  function runCriteria(event) {
    //need to feed in longitude/latitude from geolocation api?
    //nest apis: geolocation > trails?
    

    event.preventDefault();


    // reference latitude from geolocation 
    // reference longitude from geolocation 
    var maxDistance = target html // default is 30, range is 0-200
    var minDistance = target html // default is 0, range is 0-200
    var maxResults = target html // default is 10, range is 0-500
    var minRating = target html // default is 0, range is 0-4

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

    //api request from https://www.trailrunproject.com/data


    $.ajax({
        url: runCriteriaURL,
        type: "GET"
      }).then(function(response) {
          console.log(response);
          //
  }
}

  // function to query user's geolocation and display map


  // on click event listener for search button
  $("#search-btn-placeholder").on("click", function() {
    var citySearched = $("#city-searched-placeholder")
      .val()
      .trim();
    $("#city-searched").val("");
    runWeather(citySearched);
  });


});
