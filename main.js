var key = "BGwjEAj6b67WSIQnTiClj6aND2JjNKwx";
var openWeatherKey = "057ea05bc9005063c0e92dab1ff6b0c1";
// var sunny = ["Sunny", "Mostly Sunny", "Partly Sunny"];
// var night = ["Clear", "Mostly Clear"];

var cloudy = {
  Cloudy: 0,
  "Partly cloudy": 0,
  "Clouds and sun": 0,
  "Intermittent clouds": 0,
  "Mostly cloudy": 0,
  "Mostly cloudy w/ Flurries": 0,
  "Partly sunny w/ Flurries": 0,
  "Mostly cloudy w/ Snow": 0,
};
var nightCloudy = {
  "Partly cloudy": 0,
  "Intermittent clouds": 0,
  "Hazy moonlight": 0,
  "Mostly cloudy": 0,
  "Mostly cloudy w/ Flurries": 0,
  "Partly sunny w/ Flurries": 0,
  "Mostly cloudy w/ Snow": 0,
  Cloudy: 0,
};

var rain = {
  Showers: 0,
  "Mostly cloudy w/ Showers": 0,
  "Partly sunny w/ Showers": 0,
  Rain: 0,
  Sleet: 0,
};
var rainNight = {
  "Mostly cloudy w/ Snow": 0,
  "Mostly cloudy w/ Flurries": 0,
  "Mostly cloudy w/ Showers": 0,
  "Partly cloudy w/ Showers": 0,
  Rain: 0,
  Sleet: 0,
};
var thunder = {
  "Partly sunny w/ T-Storms": 0,
  "Mostly cloudy w/ T-Storms": 0,
  Thunderstorm: 0,
  Thunderstorms: 0,
  "T-Storms": 0,
};
var thunderNight = {
  "Mostly cloudy w/ T-Storms": 0,
  Thunderstorm: 0,
  Thunderstorms: 0,

  "T-Storms": 0,
  "Partly cloudy w/ T-Storms": 0,
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    return true;
  } else {
    return false;
  }
}

function showPosition(position) {
  console.log(position.coords.latitude, position.coords.longitude);
  $.ajax({
    // Our sample url to make request
    url: `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${openWeatherKey}`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      $.ajax({
        // Our sample url to make request
        url: `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${key}&q=${data[0]["name"]}`,
        // Type of Request
        type: "GET",

        // Function to call when to
        // request is ok
        success: function (dataa) {
          console.log(dataa);
          var selected = [
            dataa[0]["Key"],
            dataa[0]["LocalizedName"],
            dataa[0]["AdministrativeArea"]["LocalizedName"],
            dataa[0]["Country"]["LocalizedName"],
          ];
          selectFromSuggestions(selected);
        },

        // Error handling
        error: function (error) {
          console.log(`Error ${error}`);
        },
      });
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

// Convert to fahrenheit
// function convertToFahren() {
//     console.log("i m here");

// }
$(document).ready(function () {
  var windowsize = $(window).width();
  if (windowsize < 800) {
    //if the window is greater than 440px wide then turn on jScrollPane..
    $(".sideMain").insertBefore(".mainWidgets");
  }
  getLocation();
});

$("#cityQuery").keyup(function (e) {
  if ($("#cityQuery").val().length == 0) {
    $(".citySuggestions").css("display", "none");
  } else {
    $(".citySuggestions").css("display", "block");
    $(".addResultsHere").html("");
  }

  qLoading(true);
  clearTimeout($.data(this, "timer"));
  if (e.keyCode == 13) getCityAutocomplete();
  else $(this).data("timer", setTimeout(getCityAutocomplete, 500));
});

function getCityAutocomplete() {
  var cityQ = $("#cityQuery").val();
  $.ajax({
    // Our sample url to make request
    url: `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${key}&q=${cityQ}`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      //   console.log(data);
      var results = [];
      for (let i = 0; i < data.length; i++) {
        var city = {};
        city["key"] = data[i]["Key"];
        city["city"] = data[i]["LocalizedName"];
        city["state"] = data[i]["AdministrativeArea"]["LocalizedName"];
        city["country"] = data[i]["Country"]["LocalizedName"];
        results.push(city);
      }
      qLoading(false);
      searchResultFiller(results.slice(0, 5));

      console.log(results);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function qLoading(call) {
  if (call) {
    $(".qLoading").show();
  } else {
    $(".qLoading").hide();
  }
}
function searchResultFiller(results) {
  var suggestionDiv = $(".addResultsHere");
  suggestionDiv.html("");
  if (results.length == 0) {
    suggestionDiv.append('<p class="noResults">no results found</p>');
  } else {
    for (let i = 0; i < results.length; i++) {
      suggestionDiv.append(
        `<div onclick=\"selectFromSuggestions([${results[i]["key"]},'${results[i]["city"]}','${results[i]["state"]}',
        '${results[i]["country"]}'])\" class='qCityBox'><div class='qCityData'><p class='qCityName'>${results[i]["city"]}</p><p class='qCityDetails'>${results[i]["state"]}, ${results[i]["country"]}</p></div><i class='ti ti-map-pin'></i></div>`
      );
    }
  }
}

function selectFromSuggestions(selected) {
  $(".citySuggestions").css("display", "none");
  $("#cityQuery").val(selected[1] + ", " + selected[2] + ", " + selected[3]);
  //   fetchForecast(selected[0], selected[1]);
  //   fetchProbs(selected[0]);
  //   fetchHorlyForecast(selected[0]);
  //   featch5DaysForecast(selected[0]);
  //   getLatLong();
}

function fetchForecast(id, location) {
  console.log(id, location);
  $.ajax({
    // Our sample url to make request
    url: `https://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${key}&details=true`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      var timezone = data[0].LocalObservationDateTime.slice(-6).replace(
        ":",
        ""
      );
      var time = new Date(data[0].EpochTime * 1000);
      var timee = moment(time).utcOffset(timezone).format("hh:mm A");
      var dateLong = moment(time)
        .utcOffset(timezone)
        .format("dddd, Do MMMM, YYYY");
      var monthLong = moment(time).utcOffset(timezone).format("Do MMMM");
      var currentHour = moment(time).utcOffset(timezone).format("H");
      var greeting = "";
      if (currentHour >= 3 && currentHour < 12) {
        greeting = "Good Morning";
      } else if (currentHour >= 12 && currentHour < 15) {
        greeting = "Good Afternoon";
      } else if (currentHour >= 15 && currentHour < 20) {
        greeting = "Good Evening";
      } else {
        greeting = "Good Night";
      }
      console.log(greeting, currentHour);

      var temp = data[0]["Temperature"]["Metric"]["Value"];
      var hum = data[0]["RelativeHumidity"];
      var windSpeed = data[0]["Wind"]["Speed"]["Metric"]["Value"];
      var weatherText = data[0]["WeatherText"];
      var isDayTime = data[0]["IsDayTime"];
      var logoMain = weatherIcon(weatherText, isDayTime);

      var forecast = {
        location,
        dateLong,
        monthLong,
        temp,
        weatherText,
        windSpeed,
        hum,
        logoMain,
        timee,
        greeting,
      };
      setForecast(forecast);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function setForecast(forecast) {
  console.log(forecast);
  $("#location1").text(forecast["location"]);
  $("#location").text(forecast["location"]);
  $(".dateMain").text("Today, " + forecast["monthLong"]);
  $(".tempMainMain").text(forecast["temp"] + "°C");
  $(".dayTypeMain").text(forecast["weatherText"]);
  $("#windSpeed").text(forecast["windSpeed"] + " km/h");
  $("#hum").text(forecast["hum"] + " %");
  $(".mainImg").attr("src", `./src/${forecast["logoMain"]}.png`);
  $(".time").text(forecast["timee"]);
  $(".day").text(forecast["dateLong"]);
  $("#greetingText").text(forecast["greeting"]);
}
function weatherIcon(weatherText, isDayTime) {
  var logoMain = "";
  if ((weatherText in cloudy) & (isDayTime == true)) {
    logoMain = "cloudyDay";
  } else if ((weatherText in rain) & (isDayTime == true)) {
    logoMain = "rainDay";
  } else if ((weatherText in thunder) & (isDayTime == true)) {
    logoMain = "thunderDay";
  } else if ((weatherText in nightCloudy) & (isDayTime == false)) {
    logoMain = "cloudyNight";
  } else if ((weatherText in rainNight) & (isDayTime == false)) {
    logoMain = "rainNight";
  } else if ((weatherText in thunderNight) & (isDayTime == false)) {
    logoMain = "thunderNight";
  } else {
    if (isDayTime == true) {
      logoMain = "sunny";
    } else {
      logoMain = "night";
    }
  }
  return logoMain;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function getLatLong() {
  var q = $("#cityQuery").val();
  $.ajax({
    // Our sample url to make request
    url: `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${openWeatherKey}`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      getAQI(data[0]["lat"], data[0]["lon"]);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function getAQI(lat, lon) {
  $.ajax({
    // Our sample url to make request
    url: `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherKey}`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      // Where 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
      var title = "";
      var text = "";
      var color = "";
      var lightColor = "";
      var aqi = data["list"][0]["main"]["aqi"];
      if (aqi == 1) {
        color = "#09c768";
        lightColor = "#09c76812";
        title = "Good";
        text = "A perfect day for a walk!";
      } else if (aqi == 2) {
        var color = "#99CC33";
        var lightColor = "#99CC3312";
        title = "Fair";
        text = "You need not worry!";
      } else if (aqi == 3) {
        var color = "#FFCC00";
        var lightColor = "#FFCC0012";
        title = "Moderate";
        text = "Avoid crowdy places!";
      } else if (aqi == 4) {
        var color = "#FF9966";
        var lightColor = "#FF996612";
        title = "Poor";
        text = "Prefer staying inside!";
      } else {
        var color = "#E10000";
        var lightColor = "#E1000012";
        text = "Please wear a mask and avoid going outside.";
        title = "Very Poor";
      }
      console.log(data["list"][0]["components"]["pm2_5"]);
      $("#pm2")
        .text(data["list"][0]["components"]["pm2_5"])
        .css("color", color);
      $("#so2").text(data["list"][0]["components"]["so2"]).css("color", color);
      $("#no2").text(data["list"][0]["components"]["no2"]).css("color", color);
      $("#o3").text(data["list"][0]["components"]["o3"]).css("color", color);
      $("#co").text(data["list"][0]["components"]["co"]).css("color", color);
      $("#pm2_").css("color", color);
      $("#so2_").css("color", color);
      $("#no2_").css("color", color);
      $("#o3_").css("color", color);
      $("#co_").css("color", color);
      $("#AQITitle").text(title);
      $("#AQITitle").css("color", color);
      $("#AQIText").text(text);
      $(".AQIcardLight").css("background-color", lightColor);
      $(".AQIicon").css("color", color);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function fetchProbs(id) {
  console.log(id);
  $.ajax({
    // Our sample url to make request
    url: `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${id}?apikey=${key}&details=true&metric=true`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      //   const yourUnixEpochTime = 1695963780 * 1000;
      //   // Create moment object from epoch and convert to format:
      //   const formattedTime = moment(yourUnixEpochTime)
      //     .utcOffset("+0200")
      //     .format("dddd, MMMM Do, YYYY hh:mm A");
      //   console.log(formattedTime);

      console.log(new Date(1696053600 * 1000));
      var timezone = data.Headline.EffectiveDate.slice(-6).replace(":", "");
      var sunRiseTime = new Date(data.DailyForecasts[0].Sun.EpochRise * 1000);
      var sunRiseTimee = moment(sunRiseTime)
        .utcOffset(timezone)
        .format("hh:mm A");
      var sunSetTime = new Date(data.DailyForecasts[0].Sun.EpochSet * 1000);
      var sunSetTimee = moment(sunSetTime)
        .utcOffset(timezone)
        .format("hh:mm A");
      console.log(sunRiseTimee, sunSetTimee);
      var rain = data["DailyForecasts"][0]["Day"]["PrecipitationProbability"];
      var clouds = data["DailyForecasts"][0]["Day"]["CloudCover"];
      var thunder = data["DailyForecasts"][0]["Day"]["ThunderstormProbability"];
      var snow = data["DailyForecasts"][0]["Day"]["SnowProbability"];
      $("#cloudyProb").text(clouds + "%");
      $("#rainProb").text(rain + "%");
      $("#thunderProb").text(thunder + "%");
      $("#snowProb").text(snow + "%");
      $("#UVindex").text(data.DailyForecasts[0].AirAndPollen[5].Value);
      $(".probabilityText").text(data.Headline.Text);
      $("#sunRiseTime").text(sunRiseTimee);
      $("#sunSetTime").text(sunSetTimee);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function fetchHorlyForecast(id) {
  console.log(id);
  $.ajax({
    // Our sample url to make request
    url: `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${id}?apikey=${key}&details=true&metric=true`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      $("#appendHereHours").html("");
      var hourForecast = [];
      for (let index = 0; index < data.slice(0, 5).length; index++) {
        var hourData = {};
        var timezone = data[index].DateTime.slice(-6).replace(":", "");
        var time = new Date(data[index].EpochDateTime * 1000);
        var hour = moment(time).utcOffset(timezone).format("hh:mm A");
        var rain = data[index]["RainProbability"];
        var temp = data[index].Temperature.Value;
        var wind = data[index].Wind.Speed.Value;
        hourData = { hour, temp, wind, rain };
        hourForecast.push(hourData);

        $("#appendHereHours").append(`<div class=\"timeTempBox\">
                                      <div class="flexCenter">
                                          <i class="ti ti-clock-hour-4"></i>
                                          <p>${hour}</P>
                                      </div>
                                      <div class="flexCenter">
                                          <i class="ti ti-temperature"></i>
                                          <p>${temp}°C</p>
                                      </div>
                                      <div class="flexCenter">
                                          <i class="ti ti-cloud-rain"></i>
                                          <p>${rain}%</p>
                                      </div>
                                  </div>`);
      }
      console.log(hourForecast);
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}

function featch5DaysForecast(id) {
  console.log(id);
  $.ajax({
    // Our sample url to make request
    url: `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=${key}&details=true&metric=true`,
    // Type of Request
    type: "GET",

    // Function to call when to
    // request is ok
    success: function (data) {
      console.log(data);
      var dayForecast = [];
      $(".daysForecast").html("");
      for (let index = 0; index < data.DailyForecasts.length; index++) {
        var day = {};
        var timezone = data.DailyForecasts[index].Date.slice(-6).replace(
          ":",
          ""
        );
        var time = new Date(data.DailyForecasts[index].EpochDate * 1000);
        var dayShort = moment(time).utcOffset(timezone).format("dddd");
        var temp = data.DailyForecasts[index].Temperature.Maximum.Value;
        var weatherText = data.DailyForecasts[index].Day.IconPhrase;
        var icon = weatherIcon(weatherText, true);
        day = { dayShort, temp, icon };
        $(".daysForecast").append(`<div class="card shadow200 delay${
          index * 30
        }">
                        <img class="mainImg shadow100" src="./src/${icon}.png" />
                        <p>${dayShort}</p>
                        <p>${temp}°C</p>
                    </div>`);
        dayForecast.push(day);
      }
    },

    // Error handling
    error: function (error) {
      console.log(`Error ${error}`);
    },
  });
}
