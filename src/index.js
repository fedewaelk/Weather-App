import './styles.css';
import { processWeatherData } from './weatherProcessor.js';
import { getDefaultLocation } from './geolocation.js';

async function getWeather(location) {
  const apiKey = 'RM5YCYXF45PFLW3Y6N36CSHXH'; // Recordar ocultar clave API en producción
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
  document.getElementById('weatherCard').innerHTML = cardHTML;
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
