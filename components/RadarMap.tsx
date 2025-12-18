
import React from 'react';

const RadarMap: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 relative shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300">
        LIVE US RADAR
      </div>
      <iframe 
        width="100%" 
        height="100%" 
        src="https://embed.windy.com/embed2.html?lat=37.0902&lon=-95.7129&zoom=4&level=surface&overlay=radar&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" 
        frameBorder="0"
        title="Weather Radar"
        className="opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
      ></iframe>
    </div>
  );
};

export default RadarMap;
