const apiKey = 'fa76766d12eaa3a72edce7f1ba7e3827';

//Search elements
const searchBar = document.querySelector("#search-box");
const searchButton = document.querySelector("#submit-search");
const searchList = document.querySelector("#prev-search-container");
const resetButton = document.querySelector("#reset-search");

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
    .then(function(response) {
      return response.json();
    })

    .then(function(data) {
      console.log(data)
      const lat = data[0].lat;
      const long = data[0].lon;
      const country = data[0].country;
      const state = data[0].state;

      let requestUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
      fetch(requestUrl2)
        .then(function(response) {
          return response.json();
        })
        .then(function(data2) {
          console.log(data2)

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

