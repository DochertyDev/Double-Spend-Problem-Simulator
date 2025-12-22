
import React, { useEffect, useRef } from 'react';
import { SimulationStep } from '../types';

interface FlowDiagramProps {
  steps: SimulationStep[];
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ steps }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest step when the simulation progresses
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [steps.length]);

  if (steps.length === 0) return null;

  return (
    <div className="h-full w-full bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
      {/* Scrollable Track */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-12 py-8 gap-0 relative transition-all"
      >
        {/* Starting Point */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg border-4 border-blue-100 z-10">
            <i className="fas fa-coins text-2xl"></i>
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-tighter">Initial Deposit</span>
            <div className="text-sm font-mono font-bold text-blue-900">${steps[0].deposit.toFixed(2)}</div>
          </div>
        </div>

        {/* Chain of Banks */}
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          
          return (
            <React.Fragment key={idx}>
              {/* Connector Arrow */}
              <div className="w-32 flex-shrink-0 flex items-center justify-center relative -mx-4">
                <svg width="100%" height="40" className="overflow-visible">
                  <defs>
                    <marker id={`arrow-${idx}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                  </defs>
                  <path 
                    d="M 0 20 L 100 20" 
                    stroke="#cbd5e1" 
                    strokeWidth="3" 
                    fill="none" 
                    markerEnd={`url(#arrow-${idx})`} 
                    strokeDasharray="8 4"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                  <style>
                    {`
                      @keyframes dash {
                        to { stroke-dashoffset: -12; }
                      }
                    `}
                  </style>
                  <text x="50%" y="15" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold uppercase tracking-widest">
                    Deposit
                  </text>
                </svg>
              </div>

              {/* Bank Card */}
              <div className={`flex-shrink-0 w-64 p-5 bg-white rounded-xl shadow-md border-2 transition-all ${isLast ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest"># {idx + 1}</span>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLast ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {step.bankName}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Deposit Received</label>
                    <div className="text-lg font-mono font-bold text-slate-800">${step.deposit.toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                    <div>
                      <label className="text-[10px] text-amber-500 font-bold uppercase block mb-0.5">Reserves</label>
                      <div className="text-xs font-mono font-bold text-slate-600">${step.reserves.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="text-[10px] text-green-500 font-bold uppercase block mb-0.5">New Loan</label>
                      <div className="text-xs font-mono font-bold text-slate-900">${step.loan.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {isLast && (
                  <div className="mt-3 pt-2 border-t-2 border-dashed border-blue-50 animate-pulse">
                    <div className="text-[10px] text-blue-500 font-bold uppercase text-center">Active Multiplier...</div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Ending Phantom Card for visual continuation */}
        <div className="flex-shrink-0 w-32 flex items-center justify-center -mx-4 opacity-30">
           <svg width="100%" height="40" className="overflow-visible">
            <path d="M 0 20 L 100 20" stroke="#cbd5e1" strokeWidth="3" fill="none" strokeDasharray="8 4" />
          </svg>
        </div>
      </div>

      {/* Track Legend */}
      <div className="p-4 bg-white border-t border-slate-100 flex justify-center gap-8 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deposits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Locked Reserves</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lending Power</span>
        </div>
      </div>
    </div>
  );
};

export default FlowDiagram;
