import './styles.css';
import { processWeatherData } from './weatherProcessor.js';
import { getDefaultLocation } from './geolocation.js';

async function getWeather(location) {
  const apiKey = 'RM5YCYXF45PFLW3Y6N36CSHXH'; // Recordar ocultar clave API cuando sea posible
  const baseUrl =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
  const url = `${baseUrl}/${encodeURIComponent(
    location
  )}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherData = await response.json();
    const processedData = processWeatherData(weatherData);
    console.log(processedData);
    updateHeader(processedData);
    updateCard(processedData);
    updateDailyList(processedData.daily);
    updateHourlyList(processedData.hourly);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateHeader(data) {
  if (!data) return;
  const { locationName, temp, icon } = data;
  // Actualiza los elementos del header
  document.getElementById('locationDisplay').textContent = locationName;
  document.getElementById('tempDisplay').textContent = `${temp}°C`;
  loadHeaderIcon(icon);
}

async function loadHeaderIcon(iconCode) {
  try {
    const iconModule = await import(`./icons/${iconCode}.svg`);
    document.getElementById('iconDisplay').src = iconModule.default;
  } catch (error) {
    console.error('Error loading header icon:', error);
    document.getElementById('iconDisplay').src = './icons/default.svg';
  }
}

function updateCard(data) {
  if (!data) return;
  const dataTime = data.datetime;
  const cardHTML = `
    <div class="weather-card">
      <div class="card-header">
        <h2>Current Weather</h2>
        <div class="times">
          <div>Data Time: ${dataTime}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="left-column">
          <div id="condition-column">
            <img id="cardIconDisplay" alt="Weather Icon" src="./icons/default.svg" />
            <p class="conditions">${data.conditions}</p>
          </div>
          <div id="temp-column">
            <p><span class="temperature">${
              data.temp
            }</span><span class="unit">°C</span></p>
            <p class="feels-like">Feels Like: ${data.feelslike}°C</p>
          </div>
        </div>
        <div class="right-column">
          <p class="wind">Wind: ${data.windspeed} km/h</p>
          <p class="humidity">Humidity: ${data.humidity || 'N/A'}%</p>
          <p class="precipprob">Precipitation Prob.: ${data.precipprob}%</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('weather-card').innerHTML = cardHTML;
  loadCardIcon(data.icon);
}

async function loadCardIcon(iconCode) {
  try {
    const iconModule = await import(`./icons/${iconCode}.svg`);
    document.getElementById('cardIconDisplay').src = iconModule.default;
  } catch (error) {
    console.error('Error loading card icon:', error);
    document.getElementById('cardIconDisplay').src = './icons/default.svg';
  }
}

function updateHourlyList(hourlyData) {
  if (!hourlyData || hourlyData.length === 0) return;

  const currentHour = new Date().getHours();

  // Buscar el índice de la primera entrada cuyo "datetime" tenga la hora >= currentHour.
  let startingIndex = hourlyData.findIndex((hour) => {
    const hourValue = parseInt(hour.datetime.split(':')[0]);
    return hourValue >= currentHour;
  });
  if (startingIndex === -1) {
    startingIndex = 0;
  }

  // Extraer las horas desde startingIndex hasta el final
  let hoursToShow = hourlyData.slice(startingIndex);
  // Si no hay 8 elementos, completar con las primeras del arreglo
  if (hoursToShow.length < 8) {
    const remaining = 8 - hoursToShow.length;
    hoursToShow = hoursToShow.concat(hourlyData.slice(0, remaining));
  } else {
    // Solo necesitamos las primeras 8
    hoursToShow = hoursToShow.slice(0, 8);
  }

  const hourlyListContainer = document.getElementById('hourly-list');
  hourlyListContainer.innerHTML = `
    <div class="hourly-card">
      <div class="card-header">
        <h2>Hourly Forecast</h2>
      </div>
      <div class="card-body" id="hourlyItemsContainer"></div>
    </div>
  `;

  const hourlyItemsContainer = document.getElementById('hourlyItemsContainer');

  hoursToShow.forEach((hour, index) => {
    const formattedTime = hour.datetime.split(':')[0];

    const hourHTML = `
      <div class="hourly-item">
        <span class="hourly-time">${formattedTime}</span>
        <img id="hourlyIcon-${index}" class="hourly-icon" alt="Hourly Weather Icon" src="./icons/default.svg" />
        <span class="hourly-temp">${hour.temp}°C</span>
        <span class="hourly-precipprob">&#128167; ${hour.precipprob}%</span>
      </div>
    `;

    hourlyItemsContainer.innerHTML += hourHTML;
  });

  hoursToShow.forEach((hour, index) => {
    loadHourlyIcon(hour.icon, `hourlyIcon-${index}`);
  });
}

async function loadHourlyIcon(iconCode, elementId) {
  try {
    const iconModule = await import(`./icons/${iconCode}.svg`);
    document.getElementById(elementId).src = iconModule.default;
  } catch (error) {
    console.error('Error loading hourly icon:', error);
    document.getElementById(elementId).src = './icons/default.svg';
  }
}

function updateDailyList(dailyData) {
  if (!dailyData || dailyData.length === 0) return;
  const dailyListContainer = document.getElementById('daily-list');
  dailyListContainer.innerHTML = `
    <div class="daily-card">
      <div class="card-header">
        <h2>Daily Forecast</h2>
      </div>
      <div class="card-body" id="dailyItemsContainer"></div>
    </div>
  `;

  const dailyItemsContainer = document.getElementById('dailyItemsContainer');

  dailyData.forEach((day, index) => {
    const dayHTML = `
      <div class="daily-item">
        <span class="daily-date">${day.datetime}</span>
        <img id="dailyIcon-${index}" class="daily-icon" alt="Daily Weather Icon" src="./icons/default.svg" />
        <span class="daily-tempmax">${day.tempmax}°C</span>
        <span class="daily-tempmin">${day.tempmin}°C</span>
        <span class="daily-description">${day.conditions}</span>
      </div>
    `;
    dailyItemsContainer.innerHTML += dayHTML;
  });

  dailyData.forEach((day, index) => {
    loadDailyIcon(day.icon, `dailyIcon-${index}`);
  });
}

async function loadDailyIcon(iconCode, elementId) {
  try {
    const iconModule = await import(`./icons/${iconCode}.svg`);
    document.getElementById(elementId).src = iconModule.default;
  } catch (error) {
    console.error('Error loading daily icon:', error);
    document.getElementById(elementId).src = './icons/default.svg';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('weatherForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();
    if (location) {
      getWeather(location);
    }
  });

  // Al iniciar, intenta obtener la ubicación predeterminada por geolocalización
  getDefaultLocation()
    .then((loc) => getWeather(loc))
    .catch((error) => console.error(error));
});
