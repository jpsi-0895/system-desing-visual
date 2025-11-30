import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { SystemCanvas } from './components/SystemCanvas';
import { InfoPanel } from './components/InfoPanel';
import { SimulationConfig } from './types';

const INITIAL_CONFIG: SimulationConfig = {
  latency: 5,
  throughput: 3,
  bandwidth: 2,
  showCaching: false,
  showReplication: false,
  showPartitioning: false,
  showLoadBalancer: true,
  isPlaying: true,
};

function App() {
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">SD</div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
               System Design Visualizer
             </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
            <span>Powered by React 18 & Gemini API</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        <div className="container mx-auto h-full flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Canvas (Flexible) */}
          <div className="flex-1 min-h-[400px] flex flex-col gap-4">
             <SystemCanvas config={config} />
             
             {/* Dynamic Status Bar */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                  <span className="block text-xs text-slate-500 uppercase">Avg Latency</span>
                  <span className="text-lg font-mono text-cyan-400">
                    {~~(config.latency * 12.5)} ms
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                  <span className="block text-xs text-slate-500 uppercase">Requests/Sec</span>
                  <span className="text-lg font-mono text-green-400">
                    {~~(config.throughput * 120)}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                  <span className="block text-xs text-slate-500 uppercase">Network Load</span>
                  <span className="text-lg font-mono text-purple-400">
                    {config.throughput > 7 ? 'HIGH' : 'OPTIMAL'}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                   <span className="block text-xs text-slate-500 uppercase">Architecture</span>
                   <span className="text-xs font-mono text-slate-300">
                     {config.showLoadBalancer ? 'LB ' : ''} 
                     {config.showCaching ? '+CACHE ' : ''} 
                     {config.showPartitioning ? '+SHARD ' : ''}
                   </span>
                </div>
             </div>
          </div>

          {/* Right Column: Controls & Info (Fixed Width) */}
          <div className="flex flex-col gap-6 lg:w-96 shrink-0">
            <ControlPanel config={config} setConfig={setConfig} />
            <InfoPanel />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
