export function processWeatherData(data) {
  // Validamos que el objeto 'data' tenga al menos un día
  if (!data || !data.days || data.days.length === 0) {
    console.error('No weather data available');
    return null;
  }

  // Tomamos primer elemento del array 'days' (día actual)
  const today = data.days[0];

  // Extraemos las propiedades requeridas
  const result = {
    datetime: today.datetime,
    conditions: today.conditions,
    temp: today.temp,
    feelslike: today.feelslike,
    icon: today.icon,
    windspeed: today.windspeed,
    precipprob: today.precipprob,
  };

  return result;
}
