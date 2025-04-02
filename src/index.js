// index.js
import { processWeatherData } from './weatherProcessor.js';

async function getWeather(location) {
  const apiKey = 'RM5YCYXF45PFLW3Y6N36CSHXH'; // Recordar ocultar clave API
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

    // Procesamos los datos para obtener solo las propiedades que necesitamos
    const processedData = processWeatherData(weatherData);
    console.log(processedData); // Mostramos el objeto resultante en la consola
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Ejemplo de uso:
getWeather('Rosario');
