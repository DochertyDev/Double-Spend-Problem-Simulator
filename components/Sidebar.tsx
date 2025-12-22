
import React from 'react';
import { SimulationParams } from '../types';

interface SidebarProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onStep: () => void;
  onReset: () => void;
  currentStepCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  params, 
  setParams, 
  isPlaying, 
  setIsPlaying, 
  onStep, 
  onReset,
  currentStepCount
}) => {
  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto shrink-0 shadow-lg z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-sliders-h mr-3 text-blue-500"></i>
          Parameters
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Initial Deposit ($)</label>
            <input 
              type="number" 
              value={params.initialDeposit}
              disabled={currentStepCount > 0}
              onChange={(e) => setParams(p => ({ ...p, initialDeposit: Number(e.target.value) }))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Reserve Ratio ({(params.reserveRatio * 100).toFixed(0)}%)</label>
            <input 
              type="range" 
              min="0.01" 
              max="0.99" 
              step="0.01"
              disabled={currentStepCount > 0}
              value={params.reserveRatio}
              onChange={(e) => setParams(p => ({ ...p, reserveRatio: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>1%</span>
              <span>50%</span>
              <span>99%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Simulation Speed ({params.simulationSpeed}ms)</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100"
              value={params.simulationSpeed}
              onChange={(e) => setParams(p => ({ ...p, simulationSpeed: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <i className="fas fa-play mr-3 text-green-500"></i>
          Controls
        </h2>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isPlaying ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'}`}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            {isPlaying ? 'PAUSE' : 'PLAY SIMULATION'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onStep}
              disabled={isPlaying}
              className="py-3 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-step-forward"></i> Step
            </button>
            <button 
              onClick={onReset}
              className="py-3 bg-white border border-slate-200 rounded-lg text-red-600 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-2">Did you know?</h3>
        <p className="text-xs text-blue-600 leading-relaxed">
          The fractional reserve system allows banks to create money by lending out a portion of their deposits, resulting in the "Money Multiplier" effect.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
