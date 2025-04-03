import './styles.css'; // index.js
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
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateHeader(data) {
  if (!data) return;
  const { locationName, temp, icon } = data;
  document.getElementById('locationDisplay').textContent = locationName;
  document.getElementById('tempDisplay').textContent = `${temp}°C`;
  loadWeatherIcon(icon);
}

async function loadWeatherIcon(iconCode) {
  try {
    // Se asume que el nombre del archivo SVG es igual al código de ícono que devuelve la API.
    const iconModule = await import(`./icons/${iconCode}.svg`);
    document.getElementById('iconDisplay').src = iconModule.default;
  } catch (error) {
    console.error('Error loading icon:', error);
    document.getElementById('iconDisplay').src = './icons/default.svg';
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

  getDefaultLocation()
    .then((loc) => getWeather(loc))
    .catch((error) => console.error(error));
});
