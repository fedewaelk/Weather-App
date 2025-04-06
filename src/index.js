import './styles.css';
import { processWeatherData } from './weatherProcessor.js';
import { getDefaultLocation } from './geolocation.js';
import {
  updateHeader,
  updateCard,
  updateDailyList,
  updateHourlyList,
} from './ui.js';

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
    .catch((error) => {
      console.error('Error getting default location:', error);
      getWeather('Roma'); // "Todos los errores conducen a Roma"
    });
});
