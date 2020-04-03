$(document).ready(function() {

    // set current day using moment.js -- referenced by weather function
    var currentDay = moment().format("LL");
    //invoke runWeather function to display default weather info on page load
    runWeather();

    // on click event listener for search button
    $("#submit-btn").on("click", function(event) {
      event.preventDefault();
      $("#results-content").empty();
      console.log("hello");
      var locationSearched = $("#location-searched")
        .val()
        .trim();
      $("#city-searched").val("");
      runWeather(locationSearched);

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
        var weatherIcon = $("<img>")
        .attr("id", "weather-icon").attr(
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
      // add runCriteria function to invoke
      runCriteria(latitude, longitude);
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
    function runCriteria(latitude= 37.7749, longitude=-122.4194) {
      // need to feed in longitude/latitude from geolocation or use default values or api request fails
      // reference latitude from geolocation 
      // reference longitude from geolocation 
      var maxDistance = $(".maxDistance").val(); // default is 30, range is 0-200
      var minDistance = $(".minDistance").val(); // default is 0, range is 0-200
      var maxResults = $(".result-dropdown").val(); // default is 10, range is 0-500
      var difficulty = $("#radio-form input[type='radio']:checked").val();

          // difficulty index -- colors to difficulty
            // Easy - Green
            // Interediate - Blue
            // Difficult, Very Difficult - Black
            
      // getLocation();
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
            // var trailCount = $maxResults.val();
            var $ulEl = $('<ul>');
            $('#results-content').append($ulEl);
            for (var i = 0; i < maxResults; i++) {

              //create variables referencing API data
              var name = trails[i].name;
              var summary = trails[i].summary;
              var difficulty = trails[i].difficulty;
              var stars = trails[i].stars;git stat
              var location = trails[i].location;
              var length = trails[i].length;
              var imgSmall = trails[i].imgSmall;
              var trailLink = trails[i].url;

              //create HTML elements
              var $li = $('<li>');
              var $strong = $('<strong>').text(name);
              var $pSum = $('<p>').text("Summary: " + summary);
              var $pDiffi = $('<p>').text("Difficulty: " + difficulty);
              var $pSta = $('<p>').text("Rating: " + stars);
              var $pLoc = $('<p>').text("Location: " + location);
              var $pLen = $('<p>').text("Length: " + length);
              var $imgSm = $('<img>').attr('src', imgSmall);
              var $aUrl = $('<a>').attr('href', trailLink).text(trailLink);
              
              //append HTML elements to the page
              $ulEl.append($li);
              $li.append(
                $strong,
                $pSum,
                $pSta,
                $pLoc,
                $pLen,
                $imgSm,
                $aUrl
              );
            }
            
    })
  }
  runCriteria();
  });
