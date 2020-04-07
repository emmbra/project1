$(document).ready(function () {
  // set current day using moment.js -- referenced by weather function
  var currentDay = moment().format("LL");

  //invoke runWeather and runWeatherFiveDays functions to display default weather/5 day forecast on page load
  runWeather();
  runWeatherFiveDay();

  // on click event listener for search button
  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    $("#results-content").empty();
    var locationSearched = $("#location-searched").val().trim();
    $("#location-searched").val("");
    errorCheck(locationSearched);
    runWeather(locationSearched);
  });

  // function to check errors in city name. if city name contains anything but a-z or spaces, error modal pops up and code stops.
  function errorCheck(locationSearched) {
    var lettersOnly = /^[a-zA-Z][a-zA-Z ]*$/;
    if (!locationSearched.match(lettersOnly)) {
      $('.ui.basic.modal').modal('show');
      return;
    }
  }

  // function to retrieve current day's weather based on city searched for
  // set default city to San Francisco so page isn't blank on load
  function runWeather(locationSearched = "San Francisco") {
    // api request from https://openweathermap.org/api
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET",
    }).then(function (response) {
      $("#weather-content").empty();
      $(".currentCityDate").empty();
      // create variables and HTML elements
      var dailyForecastCard = $("<div>").addClass("ui centered card");
      var cityName = $("<span>")
        .attr("id", "weather-header")
        .text(response.name);
      var dateTime = $("<div>").text(currentDay).addClass("header");
      var currentContentCard = $("<div>").addClass("content");
      var weatherIcon = $("<img>")
        .attr("id", "weather-icon-lg")
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
      currentContentCard.append(
        weatherIcon,
        temperature,
        windSpeed,
        humidity
      );
      $(".currentCityDate").append(cityName);
      dailyForecastCard.append(dateTime);
      dailyForecastCard.append(currentContentCard);
      $("#weather-content").append(dailyForecastCard);
      // invoke other functions within the runWeather function for scoping
      runCriteria(latitude, longitude);
      runWeatherFiveDay(locationSearched);
    });
  }

  // function to retrieve 5 day forecast based on city searched for
  function runWeatherFiveDay(locationSearched = "San Francisco") {
    // api request from https://openweathermap.org/api
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${locationSearched}&appid=a9fa8e4a5cdb9ab82f25d7a62cad4dc7&units=imperial`,
      type: "GET",
    }).then(function (response) {
      $("#5-day-content").empty();
      // for loop to cycle through 5 day forecast api response and pull same time forecast (18:00:00) for each day
      for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.indexOf("18:00:00") !== -1) {
          // create variables and HTML elements
          // var fiveCardHolder = $("<div>").addClass("ui card");
          var fiveDayForecastCard = $("<div>").addClass("ui centered card");
          var contentCard = $("<div>").addClass("content");
          var descriptionCard = $("<div>").addClass("desciption");
          var formattedDate = moment(response.list[i].dt_txt).format("MMM D");
          var fiveDayCityName = $("<span>")
            .attr("id", "weather-header")
            .text(response.city.name);
            var contentDate = $("<div>").addClass("content");
          var fiveDayDate = $("<div>").text(formattedDate).addClass("header");
          var fiveDayIcon = $("<img>").attr("id", "weather-icon-sm").attr(
            "src",
            "https://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
          );
          var fiveDayTemp = $("<p>")
            .attr("id", "weather-description")
            .text("Temp: " + response.list[i].main.temp + "°F");
          var fiveDayHumidity = $("<p>")
            .attr("id", "weather-description")
            .text("Humidity: " + response.list[i].main.humidity + "%");
          // append created HTML elements
          descriptionCard.append(
            fiveDayIcon,
            fiveDayTemp,
            fiveDayHumidity
          );
          $(".currentCity").empty();
          $(".currentCity").append(fiveDayCityName);
          contentDate.append(fiveDayDate)
          contentCard.append(descriptionCard)
          
          fiveDayForecastCard.append(contentDate).append(contentCard);
          $("#5-day-content").append(fiveDayForecastCard);
        }
      }
    });
  }

  // function to retrieve trail run data based on user criteria and create HTML elements to append
  function runCriteria(latitude = 37.7749, longitude = -122.4194) {
    // need to feed in longitude/latitude or use default values or api request fails
    var maxDistance = $(".maxDistance").val(); // default is 30, range is 0-200
    var minDistance = $(".minDistance").val(); // default is 0, range is 0-200
    var maxResults = $(".result-dropdown").val(); // default is 10, range is 0-500
    var difficulty = $(".difficulty-dropdown").val();
    var runCriteriaURL = `https://www.trailrunproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&key=200717421-32b757164356f1ff9be99bc247820aea`;
    // appends api url based on user criteria selected
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
      var trails = response.trails;
      // for loop to cycle through trail run api response based on user maxResults and pull requested data
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
        if (difficulty === "green") {
          difficulty = "Easy";
        } else if (difficulty === "blue") {
          difficulty = "Medium";
        } else {
          difficulty = "Hard";
        }
        //create HTML elements
        var $resultsDiv = $("<div>").addClass("ui segment fluid results-card").attr("id", "results-card");
        var $imgSmall = $("<img>").attr("src", imgSmall).addClass('ui small left floated image results-img');
        var $aUrl = $(`<a href="` + trailLink + `">` + name + `</a>`).attr("id", "trail-header").attr("target", "_blank");
        var $pSummary = $("<p>").attr("id", "trail-description").text(summary);
        var $pDifficulty = $("<p>").attr("id", "trail-description");
        var $spanDiff = $("<span>").attr("id", "trail-descripTitle").text("Difficulty: ");
        var $spanDiffVari = $("<span>").text(difficulty);
        $pDifficulty.append(
          $spanDiff,
          $spanDiffVari
        );
        var $pStars = $("<p>").attr("id", "trail-description");
        var $spanStars = $("<span>").attr("id", "trail-descripTitle").text("Rating: ");
        var $spanStarsVari = $("<span>").text(stars + "/5");
        $pStars.append(
          $spanStars,
          $spanStarsVari
        );
        var $pLocation = $("<p>").attr("id", "trail-description");
        var $spanLocation = $("<span>").attr("id", "trail-descripTitle").text("Location: ");
        var $spanLocationVari = $("<span>").text(location);
        $pLocation.append(
          $spanLocation,
          $spanLocationVari
        );
        var $pLength = $("<p>").attr("id", "trail-description");
        var $spanLength = $("<span>").attr("id", "trail-descripTitle").text("Length: ");
        var $spanLengthVari = $("<span>").text(length + " miles");
        $pLength.append(
          $spanLength,
          $spanLengthVari
        );
        //append HTML elements to the page
        $("#results-content").append($resultsDiv);
        $resultsDiv.append($imgSmall, $aUrl, $pSummary, $pDifficulty, $pStars, $pLocation, $pLength);
      }
    });
  }
});

