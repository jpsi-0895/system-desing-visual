import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { explainConcept } from '../services/geminiService';
import { SystemConcept } from '../types';

export const InfoPanel: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<SystemConcept | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleConceptClick = async (concept: SystemConcept) => {
    setSelectedConcept(concept);
    setAiExplanation('');
    setLoading(true);
    
    // In a real app, we might debounce this or wait for user to click "Ask AI"
    // But for interactivity, let's fetch on click.
    const explanation = await explainConcept(concept.title);
    setAiExplanation(explanation);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 w-full lg:w-96 flex flex-col gap-4 overflow-y-auto h-[600px]">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-cyan-400">Knowledge Base</h2>
        <p className="text-xs text-slate-400">Click a concept to learn more via Gemini AI</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CONCEPTS.map((concept) => (
          <button
            key={concept.key}
            onClick={() => handleConceptClick(concept)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedConcept?.key === concept.key
                ? 'bg-cyan-600 text-white ring-2 ring-cyan-300'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            {concept.title}
          </button>
        ))}
      </div>

      {selectedConcept ? (
        <div className="bg-slate-900/50 p-4 rounded border border-slate-700 mt-2 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-white mb-1">{selectedConcept.title}</h3>
          <p className="text-sm text-slate-300 mb-4 italic border-l-2 border-slate-600 pl-2">
            {selectedConcept.shortDesc}
          </p>

          <div className="bg-slate-950 p-3 rounded text-sm text-slate-200">
            <div className="flex items-center gap-2 mb-2">
               <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
               <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Gemini Explanation</span>
            </div>
            {loading ? (
              <div className="flex space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              </div>
            ) : (
              <p className="leading-relaxed">{aiExplanation}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
          Select a metric to view details
        </div>
      )}
    </div>
  );
};
