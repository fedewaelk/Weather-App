export function processWeatherData(data) {
  if (!data || !data.days || data.days.length === 0) {
    console.error('No weather data available');
    return null;
  }

  const current = data.currentConditions;

  return {
    locationName: data.resolvedAddress,
    datetime: current.datetime,
    conditions: current.conditions,
    temp: current.temp,
    feelslike: current.feelslike,
    icon: current.icon,
    windspeed: current.windspeed,
    precipprob: current.precipprob,
    humidity: current.humidity,
  };
}
