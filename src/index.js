async function getWeather(location) {
  const apiKey = 'RM5YCYXF45PFLW3Y6N36CSHXH'; // Reemplaza con tu clave API real
  const baseUrl =
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
  // Construimos la URL codificando la ubicación para evitar errores con espacios u otros caracteres especiales.
  const url = `${baseUrl}/${encodeURIComponent(
    location
  )}?unitGroup=metric&key=${apiKey}&contentType=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weatherData = await response.json();
    console.log(weatherData); // Mostramos los datos en la consola
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Ejemplo de uso:
getWeather('New York, USA');
