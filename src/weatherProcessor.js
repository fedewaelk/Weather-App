export function processWeatherData(data) {
  if (!data || !data.days || data.days.length === 0) {
    console.error('No weather data available');
    return null;
  }

  const current = data.currentConditions;
  const today = data.days[0]; // Suponiendo que el primer día es el actual

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
    hourly: today.hours.map((hour) => ({
      datetime: hour.datetime,
      temp: hour.temp,
      precipprob: hour.precipprob,
      icon: hour.icon,
    })),
    daily: data.days.map((day) => ({
      datetime: day.datetime,
      tempmax: day.tempmax,
      tempmin: day.tempmin,
      conditions: day.conditions,
      icon: day.icon,
    })),
  };
}
