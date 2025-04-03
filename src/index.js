import './styles.css';
import { processWeatherData } from './weatherProcessor.js';

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
    displayWeatherInfo(processedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayWeatherInfo(data) {
  const weatherDiv = document.getElementById('weatherInfo');
  if (!data) {
    weatherDiv.innerHTML = '<p>No weather data available</p>';
    return;
  }
  const {
    locationName,
    datetime,
    conditions,
    temp,
    feelslike,
    icon,
    windspeed,
    precipprob,
  } = data;

  // Actualizamos el DOM con la información del clima
  weatherDiv.innerHTML = `
    <h2>Weather in ${locationName}</h2>
    <img id="weatherIcon" alt="Weather Icon" />
    <p><strong>Date:</strong> ${datetime}</p>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Feels Like:</strong> ${feelslike}°C</p>
    <p><strong>Conditions:</strong> ${conditions}</p>
    <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
    <p><strong>Precipitation Probability:</strong> ${precipprob}%</p>
  `;

  // Cargamos dinámicamente el ícono del clima
  loadWeatherIcon(icon);
}

async function loadWeatherIcon(iconCode) {
  try {
    // El nombre del archivo SVG debe ser igual al del código de ícono de la API.
    const iconModule = await import(`./icons/${iconCode}.svg`);
    const iconUrl = iconModule.default;
    document.getElementById('weatherIcon').src = iconUrl;
  } catch (error) {
    console.error('Error loading icon:', error);
    // En caso de error, usamos un ícono por defecto.
    document.getElementById('weatherIcon').src = './icons/default.svg';
  }
}

// Configuración del formulario
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
});
