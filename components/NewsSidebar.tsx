
import React, { useEffect, useState } from 'react';
import { fetchNewsFromSources } from '../services/newsService';
import { NewsItem, NewsSource } from '../types';
import { NEWS_TARGET_STATES } from '../constants';

const NewsSidebar: React.FC = () => {
  const [sources, setSources] = useState<NewsSource[]>([
    ...NEWS_TARGET_STATES.map(state => ({
      id: `state-${state}`,
      name: `${state} News`,
      url: `rss.example.com/states/${state.toLowerCase().replace(' ', '-')}`,
      isActive: true,
      type: 'state' as const
    })),
    {
      id: 'world-1',
      name: 'World Report',
      url: 'https://news.google.com/rss/search?q=world+news',
      isActive: true,
      type: 'world'
    }
  ]);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchNewsFromSources(sources);
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 300000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, [sources]);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const addSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    
    const newSource: NewsSource = {
      id: `custom-${Date.now()}`,
      name: newSourceName,
      url: newSourceUrl,
      isActive: true,
      type: 'custom'
    };
    
    setSources(prev => [...prev, newSource]);
    setNewSourceName('');
    setNewSourceUrl('');
    setShowAddSource(false);
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  return (
    <aside className="h-full flex flex-col bg-slate-900/50 border-l border-slate-800 backdrop-blur-xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Pulse Feed
          </h2>
          <button 
            onClick={() => setShowAddSource(!showAddSource)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {showAddSource && (
          <form onSubmit={addSource} className="space-y-3 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <input 
              type="text" 
              placeholder="Source Name (e.g. BBC News)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-blue-500"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="RSS/Website URL"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-blue-500"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-1.5 rounded-lg text-xs font-bold transition-colors">Add Source</button>
              <button type="button" onClick={() => setShowAddSource(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-700">Cancel</button>
            </div>
          </form>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {sources.map(source => (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                removeSource(source.id);
              }}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                source.isActive 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }`}
              title="Click to toggle, right-click to remove"
            >
              {source.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 w-20 bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="h-12 w-full bg-slate-800 rounded"></div>
            </div>
          ))
        ) : news.length > 0 ? (
          news.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  item.category.toLowerCase().includes('world') ? 'bg-purple-600/20 text-purple-400 border-purple-500/20' : 'bg-blue-600/20 text-blue-400 border-blue-500/20'
                }`}>
                  {item.source}
                </span>
                <span className="text-[10px] text-slate-600">{item.timestamp}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
              <div className="mt-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-medium text-slate-400">View source article →</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">No active sources or news found.</p>
            <button onClick={loadNews} className="text-blue-400 text-xs mt-2 underline">Retry fetch</button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 text-[10px] text-slate-600 flex justify-between items-center bg-slate-900/80">
        <span>Updates every 5 mins</span>
        <span>Right-click source to delete</span>
      </div>
    </aside>
  );
};

export default NewsSidebar;
