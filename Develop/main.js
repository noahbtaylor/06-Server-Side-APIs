let cityInfo = $("#cityData"); //Div containing City data info
let searches = $(".pastSearches"); //Div where old searches will be displayed that are stored once User searches for them
let userFormEl = $("#user-form"); //text input element
let cityInputEl = $("#userCity"); //users search
let userSearchBtn = $("#userSearchBtn"); //submit button

let todaysDate = dayjs();

var apiKey = "48774715b5f5fb8a452c6ba72a2e6d98"; //my API key

function handleFormSubmit(cityItem) {
  var attempt2Url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityItem +
    "&appid=" +
    apiKey +
    "&units=imperial";
  fetch(attempt2Url, {
    // The browser fetches the resource from the remote server without first looking in the cache.
    // The browser will then update the cache with the downloaded resource.
    cache: "reload",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const cityName = $("#city"); //grabs my h1 where I want the city that is search up to display
      const cityDate = $("#date");
      const cityTemp = $("#temp"); //Got my temp to show on designated temp span element
      const cityWind = $("#wind"); //grabs my span element where I want the wind data to display
      const cityHumid = $("#humid"); //grabs my span element where I want the humidity to display
      const weatherIcon = $("#icon"); // grab my span element where I want the Icon to display
      var iconCode = data.weather[0].icon; //specific call to the weather icon for perpective searched city
      var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"; // Url needed to display icon
      cityName.text(data.name); //setting the data that contains name to my name element
      cityDate.text(todaysDate); //setting the dayjs variable to my date element
      weatherIcon.attr("src", iconURL); // setting the icon element to my icon element
      cityTemp.text(" " + data.main.temp + "°F"); //seting the data that contains the temp to my temp element
      cityWind.text(" " + data.wind.speed + "MPH"); //seting the data that contains the speed to my wind element
      cityHumid.text(" " + data.main.humidity + "%"); //seting the data that contains the humidity to my humidity element

      // Get the current list of searches from local storage, or create a new empty array if none exists
    });

  //MY NEW URL that is dedicated to fetch the forecast weather for the upcoming days for a city
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityItem +
    "&appid=" +
    apiKey +
    "&units=imperial";

  fetch(forecastURL, {
    cache: "reload",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const daysArray = data.list; //variable that contains the list array within the data that is fetched

      //FOR LOOP THAT LOOPS THROUGH ARRAY
      for (i = 0; i < daysArray.length; i++) {
        const date = todaysDate.add(i + 1, "day").format("M/DD"); //here im increamenting the date by one day each time it loops and im using the dayjs variable to do so
        const temp = daysArray[i].main.temp; // setting the temp info to the temp variable which will set it to every day
        const wind = daysArray[i].wind.speed; // same thing happening with the wind data
        const humidity = daysArray[i].main.humidity; //same thing happening with the spped data
        var iconCode = daysArray[i].weather[0].icon; //specific call to the weather icon for perpective searched city
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png"; // Url needed to display icon
        //CREATE MY ELEMENTS TO APPEND TO MY CARDS
        const dateEl = $("<h5>").text(date); //here I create a h5 tag and I set the date variable which contaisn the dates for each day of the week
        const iconEl = $("<img>").attr("src", iconURL); //Here i create my img taga dn set the attr of a source that is my icon URL
        iconEl.attr("style", "width:75px");
        const tempEl = $("<p>").html(`Temp: ${temp}&deg;F`); //here i create a p tag with the temp data
        const windEl = $("<p>").html(`Wind: ${wind} MPH`); //create another p tag with the wind data
        const humidityEl = $("<p>").html(`Humidity: ${humidity}%`); //create one more p tage with my humidity data

        //CLEAR MY CARD CONTENT
        $(`#day-${i + 1}`).html("");
        //APPENDING TO MY CARD
        $(`#day-${i + 1}`)
          .append(dateEl)
          .append(tempEl)
          .append(iconEl)
          .append(windEl)
          .append(humidityEl);

        let cards = $("#cards");
        cards.removeAttr("hidden");
        let currentDay = $("#currentDay");
        currentDay.removeAttr("hidden");
      }
    });
  storedSearches();
  // clear the form input element (Users search)
  cityInputEl.val("");
}

let storedSearches = function () {
  //get value from users search input
  var cityItem = cityInputEl.val();

  //if there is nothing saved at the start then save an empty array
  if (localStorage.getItem("city") == null) {
    localStorage.setItem("city", "[]");
  }
  // get old city search and add in the new city search

  var searches = JSON.parse(localStorage.getItem("city"));
  if (cityItem !== "") {
    if (!searches.includes(cityItem)) {
      searches.push(cityItem);
      // Save the updated list of searches to local storage
      localStorage.setItem("city", JSON.stringify(searches));
    }
  }

  let pastSearchesContainer = $("#pastSearches");
  pastSearchesContainer.html("");
  for (let i = searches.length - 1; i >= 0; i--) {
    let btn = $("<button></button>");
    btn.addClass("btn btn-secondary btn-lg btn-block border border-dark"); //gave style using bootstrap to my buttons
    btn.attr("type", "button");
    btn.text(searches[i]);
    btn.on("click", function () {
      handleFormSubmit(searches[i]);
    });
    pastSearchesContainer.append(btn);
  }
};

storedSearches();

// Create a submit event listener on the form element
userFormEl.on("submit", function (event) {
  event.preventDefault();
  var cityItem = cityInputEl.val();
  handleFormSubmit(cityItem);
});