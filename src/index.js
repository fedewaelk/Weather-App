import './styles.css';
import { processWeatherData } from './weatherProcessor.js';
import { getDefaultLocation } from './geolocation.js';

async function getWeather(location) {
  const apiKey = 'RM5YCYXF45PFLW3Y6N36CSHXH'; // Recordar ocultar la clave API en producción
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

  weatherDiv.innerHTML = `
    <h2>Weather in ${locationName}</h2>
    <p><strong>Date:</strong> ${datetime}</p>
    <p><strong>Conditions:</strong> ${conditions}</p>
    <p><strong>Temperature:</strong> ${temp}°C</p>
    <p><strong>Feels Like:</strong> ${feelslike}°C</p>
    <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
    <p><strong>Precipitation Probability:</strong> ${precipprob}%</p>
    <img id="weatherIcon" alt="Weather Icon" />
  `;

  loadWeatherIcon(icon);
}

async function loadWeatherIcon(iconCode) {
  try {
    const iconModule = await import(`./icons/${iconCode}.svg`);
    const iconUrl = iconModule.default;
    document.getElementById('weatherIcon').src = iconUrl;
  } catch (error) {
    console.error('Error loading icon:', error);
    document.getElementById('weatherIcon').src = './icons/default.svg';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Ubicación del usuario por defecto
  try {
    const defaultLocation = await getDefaultLocation();
    getWeather(defaultLocation);
  } catch (error) {
    console.error(error);
    // agregar ubicación por defecto o dejar que el usuario la ingrese
  }

  // Configuración del formulario para poder ingresar otra ubicación
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
