const apiKey = 'fa76766d12eaa3a72edce7f1ba7e3827';

//Moment.js
//-----------------------------------------------------------
const dateElement = document.querySelector("#todays-date");
dateElement.textContent = moment().format("dddd, MMMM DD, YYYY");

//Assigns the next 5 days to the title of the cards at the bottom
const cardTitles = document.querySelectorAll(".card-header");

for (i = 0; i < cardTitles.length; i++) {
  cardTitles[i].textContent = moment().add(i + 1, 'days').format("dddd");
}

//Defining DOM elements
//-----------------------------------------------------------
const cityName = document.querySelector("#city-name");
const weatherEl = document.querySelector("#weather-value")
const tempEl = document.querySelector("#temp-value");
const windEl = document.querySelector("#wind-value");
const humidityEl = document.querySelector("#humidity-value");
const uVIndexEl = document.querySelector("#uv-value");

//Search elements
const searchBar = document.querySelector("#search-box");
const searchButton = document.querySelector("#submit-search");
const searchList = document.querySelector("#prev-search-container");
const resetButton = document.querySelector("#reset-search");

//Generates list item for previous searches
//-----------------------------------------------------------

let userSearches;
if (localStorage.getItem('userInput') == null) {
  userSearches = [];
} else {
  userSearches = JSON.parse(localStorage.getItem('userInput'));

  //Generates list items on refresh if there is stored inputs
  for (i = 0; i < userSearches.length; i++) {
    const userInput = JSON.parse(localStorage.getItem('userInput'));

    const liEl = document.createElement("button");
    liEl.classList.add("list-group-item", "list-group-item-action", "prev-search");

    liEl.setAttribute("type", "button");
    liEl.textContent = userInput[i];

    searchList.prepend(liEl);

  }
}

//Generates list based on user input and retrieves data from API
function generateListItem() {
  const userInput = searchBar.value;

  //If search bar is empty, do nothing and end function
  if (!userInput) {
    return
  };

  //Pushes user input into localStorage
  userSearches.push(userInput);
  localStorage.setItem('userInput', JSON.stringify(userSearches));
  console.log(JSON.parse(localStorage.getItem('userInput')));

  //Creates list element based on users input
  const liEl = document.createElement("button");
  liEl.classList.add("list-group-item", "list-group-item-action", "prev-search");

  liEl.setAttribute("type", "button");
  liEl.textContent = userInput;

  searchList.prepend(liEl);

  generateWeatherData(userInput);

  searchBar.value = "";
}

//Takes user's input and generates weather data using the API
//-----------------------------------------------------------
function generateWeatherData(location) {
  let requestUrl1 = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;
  fetch(requestUrl1)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data)

      //Organizing data
      const lat = data[0].lat;
      const long = data[0].lon;
      const country = data[0].country;
      const state = data[0].state;
      const name = data[0].name;

      //Assigns city name on main card
      //Only puts State in info, if the city contains a value for 'state'
      if (!state) {
        cityName.textContent = `${name}, ${country}`;
      } else {
        cityName.textContent = `${name}, ${state}, ${country}`;
      }

      let requestUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
      fetch(requestUrl2)
        .then(function (response) {
          return response.json();
        })
        .then(function (data2) {
          console.log(data2);

          //Data retrieved
          const weatherValue = data2.current.weather[0].main + ", " + data2.current.weather[0].description;
          const tempValue = data2.current.temp;
          const windValue = data2.current.wind_speed;
          const humidityValue = data2.current.humidity;
          const uVIndexValue = data2.current.uvi;

          //Assigning DOM elements new textcontent
          weatherEl.textContent = weatherValue;
          tempEl.textContent = tempValue + " °F";
          windEl.textContent = windValue + " mph";
          humidityEl.textContent = humidityValue + "%";
          uVIndexEl.textContent = uVIndexValue;

          //Weather cards DOM elements
          const cardWeathers = document.querySelectorAll(".card-weather");
          const cardTemps = document.querySelectorAll(".card-temp");
          const cardWinds = document.querySelectorAll(".card-wind");
          const cardHumidities = document.querySelectorAll(".card-humidity");
          const cardUVs = document.querySelectorAll(".card-uv");

          //Assigns values to all weather cards
          for (i = 0; i < cardWeathers.length; i++) {
            const cWeatherValue = data2.daily[i].weather[0].main + ", " + data2.daily[i].weather[0].description;
            cardWeathers[i].textContent = cWeatherValue;

            const cTempValue = data2.daily[i].temp.day;
            cardTemps[i].textContent = cTempValue + " °F";

            const cWindValue = data2.daily[i].wind_speed;
            cardWinds[i].textContent = cWindValue + "mph";

            const cHumidityValue = data2.daily[i].humidity;
            cardHumidities[i].textContent = cHumidityValue + "%";

            const cUVValue = data2.daily[i].uvi;
            cardUVs[i].textContent = cUVValue;
          }

          const weatherImg = document.querySelector("#weather-img");
          const weatherImgUrl = data2.current.weather[0].icon;
          weatherImg.src = `http://openweathermap.org/img/wn/${weatherImgUrl}@2x.png`
        })
    })
}

//Function that will run when user submits text into field
//-----------------------------------------------------------
//Runs when user clicks 'Search' button
searchButton.addEventListener("click", () => {
  generateListItem();
})

//Runs when user presses 'enter' key
searchBar.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    generateListItem();
  }
})

//Will generate weather data when a previous search is clicked
searchList.addEventListener("click", (e) => {
  if (e.target.classList.contains("prev-search")) {
    const userInput = e.target.textContent;
    generateWeatherData(userInput)
  } else {
    return
  }
})

//Clears localStorage and empties search history
resetButton.addEventListener("click", () => {
  localStorage.removeItem("userInput");
  searchList.innerHTML = "";
})