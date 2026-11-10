import React, { useState } from 'react';
import { BrowserChrome } from '../components/BrowserChrome';
import { SemanticSearchResult } from '../types';
import { api, fallbackSearchResults } from '../services/api';

export const SemanticSearchPage: React.FC = () => {
  const [query, setQuery] = useState('answer billing questions politely and escalate refunds');
  const [results, setResults] = useState<SemanticSearchResult[]>(fallbackSearchResults);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const data = await api.semanticSearch(query);
    setResults(data);
    setSearching(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <BrowserChrome url="ai-prompt-hub.app">
        <div className="bg-white min-h-[580px] p-8 flex flex-col">
          {/* Page Heading matching Screenshot Fig 9.4 */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Semantic search and de-duplication
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dense Sentence Transformer 384-dimensional vector embeddings mapped via pgvector cosine distance:
              <span className="font-mono text-cyan-800 ml-1">sim(p_i, p_j) = (e_i &middot; e_j) / (|e_i| |e_j|)</span>
            </p>
          </div>

          {/* Search Box matching Fig 9.4 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-4xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompt concepts or paste candidate instructions..."
                className="w-full px-4 py-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-lg shadow-sm focus:ring-1 focus:ring-cyan-700 outline-none bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-2 bottom-2 px-5 bg-[#164e63] hover:bg-[#0e3b4b] text-white text-xs font-medium rounded-md shadow-sm transition"
              >
                {searching ? 'Embedding...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Results List matching Screenshot Fig 9.4 */}
          <div className="space-y-4 max-w-4xl flex-1">
            {results.map((item) => (
              <div
                key={item.promptId || item.promptName}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-slate-900">
                    {item.promptName}
                  </span>
                </div>

                <div className="flex items-center space-x-6">
                  <span className="text-xs font-mono text-slate-500">
                    similarity <strong className="text-slate-800 font-semibold">{item.similarity}</strong>
                  </span>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-sm min-w-[120px] text-center ${
                      item.actionPillColor ||
                      (item.similarity >= 0.90
                        ? 'bg-[#ef4444] text-white'
                        : item.similarity >= 0.80
                        ? 'bg-[#f97316] text-white'
                        : item.similarity >= 0.70
                        ? 'bg-[#b45309] text-white'
                        : 'bg-[#64748b] text-white')
                    }`}
                  >
                    {item.matchLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend and Mathematical Threshold Info */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-slate-700">Similarity Thresholds (&delta;):</span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span>&ge; 0.90 Duplicate</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span><span>&ge; 0.80 Related</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span><span>&ge; 0.70 Versions</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span><span>&lt; 0.70 Unrelated</span></span>
            </div>
            <div>
              <span>Embeddings: <strong>Sentence Transformers all-MiniLM-L6-v2 (384-d)</strong></span>
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
};
