/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { stateSpaces, MathUtils, StateSpaceDefinition } from './data/stateSpaces';
import { 
  Calculator, Info, TrendingUp, Hash, ArrowRight, Search, 
  ChevronDown, BookOpen, X, Filter, Moon, Sun, Droplets, Sunrise,
  Layers, Database, Cpu, Settings, Globe, Sigma
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Theme = 'light-minimal' | 'dark-ai' | 'ocean-blue' | 'sunset-orange';

const themes: { id: Theme; name: string; icon: React.ReactNode }[] = [
  { id: 'light-minimal', name: 'Light Minimal', icon: <Sun size={16} /> },
  { id: 'dark-ai', name: 'Dark AI', icon: <Moon size={16} /> },
  { id: 'ocean-blue', name: 'Ocean Blue', icon: <Droplets size={16} /> },
  { id: 'sunset-orange', name: 'Sunset Orange', icon: <Sunrise size={16} /> },
];

const categories = [
  'All',
  'Combinatorics',
  'Graph Theory',
  'AI Search Problems',
  'Constraint Satisfaction',
  'Machine Learning Spaces',
  'Mathematical Structures',
];

export default function App() {
  const [selectedId, setSelectedId] = useState<string>(stateSpaces[0].id);
  const [nValue, setNValue] = useState<string>('10');
  const [result, setResult] = useState<{ magnitude: string; log10: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<Theme>('light-minimal');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpSearch, setHelpSearch] = useState('');
  const [helpCategory, setHelpCategory] = useState('All');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const selectedSpace = useMemo(() => 
    stateSpaces.find(s => s.id === selectedId) || stateSpaces[0], 
  [selectedId]);

  const filteredSpaces = useMemo(() => 
    stateSpaces.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [searchTerm]);

  const helpSpaces = useMemo(() => 
    stateSpaces.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(helpSearch.toLowerCase()) || 
                            s.description.toLowerCase().includes(helpSearch.toLowerCase());
      const matchesCategory = helpCategory === 'All' || s.category === helpCategory;
      return matchesSearch && matchesCategory;
    }),
  [helpSearch, helpCategory]);

  const handleCalculate = () => {
    setIsCalculating(true);
    const n = parseInt(nValue);
    
    // Simulate calculation time for "large" feel
    setTimeout(() => {
      if (isNaN(n) || n < 0) {
        setResult(null);
        setIsCalculating(false);
        return;
      }
      const log10Val = selectedSpace.calculateLog10(n);
      setResult({
        magnitude: MathUtils.formatResult(log10Val),
        log10: log10Val.toFixed(2)
      });
      setIsCalculating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Math Background */}
      <div className="math-bg" />
      
      {/* Floating Symbols */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl font-serif"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0.2 + Math.random() * 0.5
            }}
            animate={{ 
              y: [null, '-20%', '120%'],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 20 + Math.random() * 40, 
              repeat: Infinity, 
              ease: "linear",
              delay: -Math.random() * 40
            }}
          >
            {['Σ', '!', 'π', '∞', '∫', 'Δ', 'λ', 'θ', 'n', 'k'][i % 10]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-card border-b border-theme sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-xl text-white shadow-lg shadow-accent/20">
              <Sigma size={24} />
            </div>
            <h1 className="font-display font-black text-xl tracking-tighter uppercase">
              StateSpace<span className="text-accent">100</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-bold font-display"
            >
              <BookOpen size={16} className="text-accent" />
              <span className="hidden sm:inline">📘 Help Guide</span>
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-bold font-display">
                {themes.find(t => t.id === theme)?.icon}
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-card border border-theme rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div className="p-2 space-y-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        theme === t.id ? 'bg-accent text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {t.icon}
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Selection & Input */}
        <div className="lg:col-span-5 space-y-6">
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card p-6 rounded-3xl border border-theme shadow-xl space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent">
                <Search size={18} />
                <h2 className="font-display font-bold uppercase tracking-wider text-sm">Select Problem</h2>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search 100 formulas..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-accent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-muted" size={18} />
              </div>

              <div className="relative">
                <select
                  className="w-full appearance-none bg-neutral-100 dark:bg-neutral-800 border border-theme rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-accent transition-all cursor-pointer pr-10"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  {filteredSpaces.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-muted pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-theme">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                  <Hash size={18} />
                  <h2 className="font-display font-bold uppercase tracking-wider text-sm">Parameter (n)</h2>
                </div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Input Value</span>
              </div>
              <input
                type="number"
                min="0"
                className="w-full bg-neutral-100 dark:bg-neutral-800 border border-theme rounded-2xl px-4 py-4 text-2xl font-display font-black focus:ring-2 focus:ring-accent transition-all"
                value={nValue}
                onChange={(e) => setNValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              />
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-accent hover:brightness-110 text-white font-display font-black py-5 rounded-2xl shadow-2xl shadow-accent/30 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {isCalculating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Settings size={24} />
                  </motion.div>
                ) : (
                  <>
                    Compute Space
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.section>

          {/* Quick Stats Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-3xl border border-theme shadow-lg overflow-hidden relative group hover:border-accent transition-colors"
          >
            <div className="absolute -right-4 -bottom-4 text-accent/5 transform rotate-12 group-hover:scale-110 transition-transform">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-muted">
                <TrendingUp size={18} />
                <h3 className="font-display font-bold uppercase tracking-wider text-xs">Growth Class</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                  selectedSpace.growthClass === 'Polynomial' ? 'bg-blue-500 text-white' :
                  selectedSpace.growthClass === 'Exponential' ? 'bg-amber-500 text-white' :
                  selectedSpace.growthClass === 'Factorial' ? 'bg-orange-500 text-white' :
                  selectedSpace.growthClass === 'Super-Exponential' ? 'bg-rose-500 text-white' :
                  selectedSpace.growthClass === 'Double-Exponential' ? 'bg-purple-500 text-white' :
                  'bg-neutral-900 text-white'
                }`}>
                  {selectedSpace.growthClass}
                </span>
                <div className="h-4 w-px bg-theme" />
                <p className="text-sm font-display font-bold opacity-80">
                  {selectedSpace.formula}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Right Column: Results & Explanation */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.section
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-900 text-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-colors" />
                
                <div className="relative z-10 space-y-8">
                  <div>
                    <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4">State Space Size</h2>
                    <div className="text-4xl sm:text-6xl md:text-7xl font-display font-black break-all leading-[0.9] tracking-tighter">
                      {result.magnitude}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-2">Log10(Size)</span>
                      <span className="text-2xl font-display font-bold text-accent">{result.log10}</span>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-2">Growth Category</span>
                      <span className="text-2xl font-display font-bold">{selectedSpace.growthClass}</span>
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border-2 border-dashed border-theme p-16 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full text-muted animate-pulse">
                  <Calculator size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black uppercase tracking-widest text-muted">Awaiting Input</h3>
                  <p className="text-muted max-w-xs mx-auto text-sm font-medium">Configure the parameters on the left to begin the state space analysis.</p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-8 sm:p-10 rounded-[2.5rem] border border-theme shadow-xl space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                <Info size={24} />
              </div>
              <h2 className="text-3xl font-display font-black uppercase tracking-tight">Analysis</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-accent">{selectedSpace.name}</h3>
                <p className="text-muted leading-relaxed text-lg font-medium">
                  {selectedSpace.description}
                </p>
              </div>

              <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-theme space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted">Deep Explanation</h4>
                <p className="text-sm leading-relaxed font-medium">
                  {selectedSpace.detailedExplanation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-theme">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Mathematical Formula</span>
                <div className="text-xl font-display font-black text-accent">{selectedSpace.formula}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Example (n=5)</span>
                <div className="text-xl font-display font-black">{selectedSpace.example}</div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Help Guide Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-5xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-theme"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-theme flex items-center justify-between bg-card sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent rounded-2xl text-white">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight">State Space Guide</h2>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">100 Combinatorial Problems Catalog</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Filters */}
              <div className="p-6 border-b border-theme flex flex-col sm:flex-row gap-4 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search guide..."
                    className="w-full pl-10 pr-4 py-3 bg-card border border-theme rounded-2xl text-sm font-medium focus:ring-2 focus:ring-accent transition-all"
                    value={helpSearch}
                    onChange={(e) => setHelpSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-muted" size={18} />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setHelpCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                        helpCategory === cat 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'bg-card border border-theme text-muted hover:border-accent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
                {helpSpaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {helpSpaces.map((s) => (
                      <div 
                        key={s.id} 
                        className="p-6 rounded-3xl border border-theme bg-neutral-50 dark:bg-neutral-800/30 hover:border-accent transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-display font-black uppercase tracking-tight group-hover:text-accent transition-colors">{s.name}</h3>
                          <span className="text-[10px] font-black px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg uppercase tracking-widest">{s.growthClass}</span>
                        </div>
                        <div className="space-y-4">
                          <div className="p-3 bg-card rounded-xl border border-theme">
                            <code className="text-accent font-display font-bold text-sm">{s.formula}</code>
                          </div>
                          <p className="text-sm text-muted font-medium line-clamp-2">{s.description}</p>
                          <div className="pt-4 border-t border-theme space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                              <span>Example</span>
                              <span>{s.example}</span>
                            </div>
                            <p className="text-xs leading-relaxed opacity-80 italic">
                              {s.detailedExplanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <Search size={48} className="text-muted opacity-20" />
                    <p className="text-muted font-display font-bold uppercase">No matching problems found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-theme mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Sigma size={24} className="text-accent" />
            <span className="font-display font-black uppercase tracking-widest text-sm">StateSpace100 v2.0</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted">
            <a href="#" className="hover:text-accent transition-colors">Documentation</a>
            <a href="#" className="hover:text-accent transition-colors">API Reference</a>
            <a href="#" className="hover:text-accent transition-colors">GitHub</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">
            © 2026 Combinatorial Analysis Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
