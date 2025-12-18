
import { WeatherData } from '../types';

export const fetchWeatherForCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`
    );
    const data = await response.json();
    
    // Map WMO code to description
    const getCondition = (code: number) => {
      if (code === 0) return 'Clear';
      if (code <= 3) return 'Partly Cloudy';
      if (code <= 48) return 'Foggy';
      if (code <= 57) return 'Drizzle';
      if (code <= 67) return 'Rain';
      if (code <= 77) return 'Snow';
      if (code <= 82) return 'Rain Showers';
      if (code <= 86) return 'Snow Showers';
      if (code <= 99) return 'Thunderstorm';
      return 'Overcast';
    };

    return {
      temp: Math.round(data.current_weather.temperature),
      condition: getCondition(data.current_weather.weathercode),
      humidity: data.hourly.relativehumidity_2m[0] || 50,
      windSpeed: data.current_weather.windspeed,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
};
