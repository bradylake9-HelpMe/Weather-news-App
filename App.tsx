
import React, { useState } from 'react';
import RadarMap from './components/RadarMap';
import WeatherCard from './components/WeatherCard';
import NewsSidebar from './components/NewsSidebar';
import { US_STATES } from './constants';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const filteredStates = US_STATES.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.abbr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 relative">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Optimized for touch heights */}
        <header className="h-20 sm:h-16 flex items-center justify-between px-4 sm:px-8 bg-slate-900/50 border-b border-slate-800 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl sm:text-lg">W</div>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">Atmosphere<span className="text-blue-500">US</span></h1>
          </div>
          
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search state..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-2.5 sm:py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3.5 top-3 sm:top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex flex-col text-right text-xs font-medium text-slate-400">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span className="text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            
            {/* Mobile/Tablet News Toggle - Larger touch target */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-3 sm:p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all relative"
              aria-label="Toggle News Feed"
            >
              <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-10 custom-scrollbar">
          {/* Radar Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold">National Radar</h2>
                <p className="text-slate-500 text-sm">Real-time tracking for the US.</p>
              </div>
            </div>
            <div className="h-[350px] sm:h-[450px] lg:h-[500px]">
              <RadarMap />
            </div>
          </section>

          {/* Weather Grid - Optimized for MD/Tablet screens */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">State Conditions</h2>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">{filteredStates.length} Regions</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-4">
              {filteredStates.map((state) => (
                <WeatherCard key={state.abbr} state={state} />
              ))}
            </div>
            {filteredStates.length === 0 && (
              <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500">No states found matching "{searchTerm}"</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Overlay for mobile/tablet sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Side Panel - RSS News */}
      <div className={`
        fixed lg:static top-0 right-0 bottom-0 z-40
        w-80 sm:w-96 lg:w-[400px] shrink-0 
        transform transition-transform duration-400 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : 'translate-x-full lg:translate-x-0'}
        bg-slate-950 border-l border-slate-800 lg:border-none
      `}>
        <div className="h-full relative">
          {/* Close button for mobile/tablet - Large touch target */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 left-[-3.5rem] p-3 bg-slate-900 rounded-l-2xl border-y border-l border-slate-800 text-slate-400 active:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default App;
