import React from 'react';
import { SimulationConfig } from '../types';

interface ControlPanelProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig }) => {
  const handleChange = (key: keyof SimulationConfig, value: number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 w-full lg:w-80 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <h2 className="text-xl font-bold text-cyan-400 mb-2">System Controls</h2>

      {/* Playback */}
      <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
        <span className="font-semibold text-sm text-slate-300">Simulation</span>
        <button
          onClick={() => handleChange('isPlaying', !config.isPlaying)}
          className={`px-4 py-1 rounded text-sm font-bold transition-colors ${
            config.isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {config.isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="text-slate-300">Latency (Speed)</label>
            <span className="text-cyan-400">{config.latency}ms</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={config.latency}
            onChange={(e) => handleChange('latency', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-xs text-slate-500 mt-1">Lower is faster.</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="text-slate-300">Throughput (Req/s)</label>
            <span className="text-cyan-400">Level {config.throughput}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={config.throughput}
            onChange={(e) => handleChange('throughput', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-xs text-slate-500 mt-1">Higher = more requests.</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="text-slate-300">Bandwidth</label>
            <span className="text-cyan-400">{config.bandwidth} GB/s</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={config.bandwidth}
            onChange={(e) => handleChange('bandwidth', Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
           <p className="text-xs text-slate-500 mt-1">Line thickness visual.</p>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Architecture</h3>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.showLoadBalancer}
              onChange={(e) => handleChange('showLoadBalancer', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white">Load Balancer</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.showCaching}
              onChange={(e) => handleChange('showCaching', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white">Caching Layer</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.showReplication}
              onChange={(e) => handleChange('showReplication', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white">DB Replication</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.showPartitioning}
              onChange={(e) => handleChange('showPartitioning', e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </div>
          <span className="text-sm text-slate-300 group-hover:text-white">DB Partitioning</span>
        </label>
      </div>
    </div>
  );
};
