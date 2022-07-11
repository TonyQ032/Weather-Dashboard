const apiKey = 'fa76766d12eaa3a72edce7f1ba7e3827';

//Moment.js
const dateElement = document.querySelector("#todays-date");
dateElement.textContent = moment().format("dddd, MMMM DD, YYYY");

//Search elements
const searchBar = document.querySelector("#search-box");
const searchButton = document.querySelector("#submit-search");
const searchList = document.querySelector("#prev-search-container");
const resetButton = document.querySelector("#reset-search");

//Defining DOM elements
const cityName = document.querySelector("#city-name");
const tempEl = document.querySelector("#temp-value");
const windEl = document.querySelector("#wind-value");
const humidityEl = document.querySelector("#humidity-value");
const uVIndexEl = document.querySelector("#uv-value");

//Generates list item for previous searches
function generateListItem() {
  const userInput = searchBar.value;

  //If search bar is empty, do nothing and end function
  if (!userInput) {
    return
  };

  const liEl = document.createElement("button");
  //liEl.classList.add("list-group-item", "list-group-item-action", "prev-search", "active");
  liEl.classList.add("list-group-item", "list-group-item-action", "prev-search");

  liEl.setAttribute("type", "button");
  liEl.textContent = userInput;

  searchList.prepend(liEl);

  generateWeatherData(userInput);

  searchBar.value = "";
}

//Takes user's input and generates weather data using the API
// function generateWeatherData(location) {
function generateWeatherData(location) {
  let requestUrl1 = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=5&appid=' + apiKey;
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
      cityName.textContent = `${name}, ${state}, ${country}`;

      let requestUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
      fetch(requestUrl2)
        .then(function (response) {
          return response.json();
        })
        .then(function (data2) {
          console.log(data2)

          //Data retrieved
          const tempValue = data2.current.temp;
          const windValue = data2.current.wind_speed;
          const humidityValue = data2.current.humidity;
          const uVIndexValue = data2.current.uvi;

          //Assigning DOM elements new textcontent
          tempEl.textContent = tempValue + " °F";
          windEl.textContent = windValue + " mph";
          humidityEl.textContent = humidityValue + "%";
          uVIndexEl.textContent = uVIndexValue;

        })

    })

}

//Function that will run when user submits text into field
searchButton.addEventListener("click", () => {
  generateListItem();
})

searchBar.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    generateListItem();
  }
})

//Will execute a function only if a search result is clicked
searchList.addEventListener("click", (e) => {
  if (e.target.classList.contains("prev-search")) {
    const userInput = e.target.textContent;
    generateWeatherData(userInput)
  } else {
    console.log("fails");
    return
  }
})

