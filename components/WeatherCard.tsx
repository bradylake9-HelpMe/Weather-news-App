
import React, { useEffect, useState } from 'react';
import { StateInfo, WeatherData } from '../types';
import { fetchWeatherForCoords } from '../services/weatherService';

interface WeatherCardProps {
  state: StateInfo;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ state }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWeatherForCoords(state.lat, state.lon);
        setWeather(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [state]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 animate-pulse rounded-xl p-4 h-32 border border-slate-700">
        <div className="h-4 w-24 bg-slate-700 rounded mb-4"></div>
        <div className="h-8 w-16 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const getTheme = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle')) return 'from-blue-600/20 to-indigo-600/20 text-blue-400';
    if (lower.includes('cloud') || lower.includes('overcast')) return 'from-slate-600/20 to-gray-600/20 text-gray-400';
    if (lower.includes('snow')) return 'from-cyan-100/10 to-blue-200/10 text-cyan-200';
    if (lower.includes('clear') || lower.includes('sunny')) return 'from-amber-500/10 to-orange-600/10 text-amber-400';
    return 'from-slate-700/20 to-slate-800/20 text-slate-400';
  };

  return (
    <div className={`bg-gradient-to-br ${getTheme(weather?.condition || '')} backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-500 transition-all cursor-default`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{state.name}</h3>
          <p className="text-3xl font-bold mt-1 text-slate-100">{weather?.temp}°C</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-900/40 border border-slate-700/50">
            {state.abbr}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-xs">
        <span className="font-medium">{weather?.condition}</span>
        <span className="text-slate-500">W: {weather?.windSpeed} km/h</span>
      </div>
    </div>
  );
};

export default WeatherCard;
