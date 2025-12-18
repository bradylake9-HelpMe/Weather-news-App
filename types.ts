
export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}

export interface StateInfo {
  name: string;
  abbr: string;
  lat: number;
  lon: number;
  weather?: WeatherData;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  url?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  type: 'state' | 'world' | 'custom';
}

export interface NewsState {
  items: NewsItem[];
  loading: boolean;
  error?: string;
}
