$(document).ready(function () {
  // set current day using moment.js -- referenced by weather function
  var currentDay = moment().format("LL");

  //invoke runWeather and runWeatherFiveDays functions to display default weather info on page load
  runWeather();
  runWeatherFiveDay();

  // on click event listener for search button
  $("#submit-btn").on("click", function (event) {
    event.preventDefault();
    $("#results-content").empty();
    console.log("hello");
    var locationSearched = $("#location-searched").val().trim();
    $("#city-searched").val("");
    runWeather(locationSearched);
  });

  // function to retrieve current day's weather and create HTMl elements
  // set default city to San Francisco so page isn't blank on load
  function runWeather(locationSearched = "San Francisco") {
    //api request from https://openweathermap.org/api
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET",
    }).then(function (response) {
      console.log(response);
      $("#weather-content").empty();
      // make variables and HTML elements
      var dailyForecastCard = $("<div>").addClass("ui card");
      var cityName = $("<p>")
        .attr("id", "weather-header")
        .text(response.name + ": ");
      var dateTime = $("<span>").text(currentDay);
      var weatherIcon = $("<img>")
        .attr("id", "weather-icon")
        .attr(
          "src",
          "https://openweathermap.org/img/w/" +
            response.weather[0].icon +
            ".png"
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
      var latitude = response.coord.lat;
      var longitude = response.coord.lon;
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

      // invoke other functions within the runWeather function
      runCriteria(latitude, longitude);
      runWeatherFiveDay(locationSearched);
    });
  }

  // function to retrieve 5 day forecast based on city searched for
  function runWeatherFiveDay(locationSearched = "San Francisco") {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET",
    }).then(function (response) {
      console.log(response);
      $("#5-day-content").empty();
      // for loop to cycle through 5 day forecast api response and pull same time forecast (18:00:00) for each day
      for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.indexOf("18:00:00") !== -1) {
          // create HTML elements
          var fiveDayForecastCard = $("<div>").addClass("ui card");
          var formattedDate = moment(response.list[i].dt_txt).format("LL");
          var fiveDayCityName = $("<p>")
            .attr("id", "weather-header")
            .text(response.city.name + ": ");
          var fiveDayDate = $("<span>").text(formattedDate);
          var fiveDayIcon = $("<img>").attr("id", "weather-icon").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              response.list[i].weather[0].icon +
              ".png"
          );
          var fiveDayTemp = $("<p>")
            .attr("id", "weather-description")
            .text("Temperature: " + response.list[i].main.temp + "°F");
          var fiveDayHumidity = $("<p>")
            .attr("id", "weather-description")
            .text("Humidity: " + response.list[i].main.humidity + "%");

          // append created HTML elements
          fiveDayCityName.append(fiveDayDate);
          fiveDayForecastCard.append(
            fiveDayCityName,
            fiveDayIcon,
            fiveDayTemp,
            fiveDayHumidity
          );
          $("#5-day-content").append(fiveDayForecastCard);
        }
      }
    });
  }

  // Do we need the geolocation here anymore since we pull lat/lon from the weather API?

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
  function runCriteria(latitude = 37.7749, longitude = -122.4194) {
    // need to feed in longitude/latitude or use default values or api request fails
    var maxDistance = $(".maxDistance").val(); // default is 30, range is 0-200
    var minDistance = $(".minDistance").val(); // default is 0, range is 0-200
    var maxResults = $(".result-dropdown").val(); // default is 10, range is 0-500
    var difficulty = $("#radio-form input[type='radio']:checked").val();

    // difficulty index -- colors to difficulty
    // Easy - Green
    // Intermediate - Blue
    // Difficult, Very Difficult - Black

    // getLocation();
    var runCriteriaURL = `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=200717421-32b757164356f1ff9be99bc247820aea`;
    if (maxDistance) {
      runCriteriaURL += `&maxDistance=${maxDistance}`;
    }
    if (minDistance) {
      runCriteriaURL += `&minLength=${minDistance}`;
    }
    if (maxResults) {
      runCriteriaURL += `&maxResults=${maxResults}`;
    }
    if (difficulty) {
      runCriteriaURL += `&difficulty=${difficulty}`;
    }
    //api request from https://www.trailrunproject.com/data
    $.ajax({
      url: runCriteriaURL,
      type: "GET",
    }).then(function (response) {
      console.log(response);
      var trails = response.trails;
      // var trailCount = $maxResults.val();
      var $ulEl = $("<ul>");
      $("#results-content").append($ulEl);
      for (var i = 0; i < maxResults; i++) {
        //create variables referencing API data
        var name = trails[i].name;
        var summary = trails[i].summary;
        var difficulty = trails[i].difficulty;
        var stars = trails[i].stars;
        var location = trails[i].location;
        var length = trails[i].length;
        var imgSmall = trails[i].imgSmall;
        var trailLink = trails[i].url;

        //create HTML elements
        var $li = $("<li>").addClass("ui card");
        var $pTrailName = $("<p>").attr("id", "trail-header").text(name);
        var $pSummary = $("<p>").attr("id", "trail-description").text("Summary: " + summary);
        var $pDifficulty = $("<p>").attr("id", "trail-description").text("Difficulty: " + difficulty);
        var $pStars = $("<p>").attr("id", "trail-description").text("Rating: " + stars +"/5");
        var $pLocation = $("<p>").attr("id", "trail-description").text("Location: " + location);
        var $pLength = $("<p>").attr("id", "trail-description").text("Length: " + length + "miles");
        var $imgSmall = $("<img>").attr("src", imgSmall);

        var $aUrl = $(`<a href="` + trailLink + `">` + name + `</a>`)
        // var $aUrl = $("<a>").attr("href", trailLink).innerHTML(name);

        //append HTML elements to the page
        $ulEl.append($li);
        $li.append($pTrailName, $pSummary, $pStars, $pLocation, $pLength, $imgSmall, $aUrl);
      }
    });
  }
  // runCriteria();
});
