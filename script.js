const time_element = document.getElementById("time");
const date_element = document.getElementById("date");
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("location");
const currentWeatherInfo = document.getElementById("current-weather");
const futureWeather = document.getElementById("future-weather");
const today = document.getElementById("today");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "Marach",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septenber",
  "Octuber",
  "November",
  "December",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const hoursFormat = hour > 12 ? hour % 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  // console.log();
  time_element.innerHTML =
    hoursFormat +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    "" +
    `<span id="AM-PM">${ampm}</span>`;

  date_element.innerHTML = days[day] + ", " + date + " " + months[month];

  //   console.log(Date());
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((loc) => {
    console.log(loc);
    let { latitude, longitude } = loc.coords;
    const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherdata(data);
      });
    // geoLocation(latitude, longitude);
  });
}

function showWeatherdata(data) {
  let { temp, humidity, pressure, wind_speed, sunrise, sunset } = data.current;

  timeZone.innerHTML = data.timezone;
  country.innerHTML = `${data.lat} / ${data.lon}`;
  console.log(data.timezone);

  currentWeatherInfo.innerHTML = `<div class="weather-data">
    <div>Temperature</div>
    <div>${temp} &#176; C</div>
    </div>
    <div class="weather-data">
    <div>Humidity</div>
    <div>${humidity} %</div>
    </div>
    <div class="weather-data">
    <div>Pressure</div>
    <div>${pressure} hPa</div>
    </div>
    <div class="weather-data">
    <div>Wind Speed</div>
    <div>${wind_speed} m/s</div>
    </div>
    `;

  let otherForecast = "";
  data.daily.forEach((day, i) => {
    if (i == 0) {
      today.innerHTML = `<div> 
      <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@4x.png" alt="weather-icon">
      <div id="title" style="display: flex; justify-content: center; font-weight: 550;">${
        day.weather[0].main
      }</div></div>
      <div class="weather-item-today">
          <div class="day">${window.moment(day.dt * 1000).format("dddd")}</div>
          <div class="temp">day : ${day.temp.night} &#176; C</div><br>
          <div class="temp">night : ${day.temp.day} &#176; C</div>
      </div>`;
    } else {
      otherForecast += `
        <div class="weather-item">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <img src="https://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather-icon">
                <div class="temp">Day : ${day.temp.night} &#176;</div>
                <div class="temp">Night : ${day.temp.day} &#176;</div>
        </div>
        `;
      futureWeather.innerHTML = otherForecast;
    }
  });
}
