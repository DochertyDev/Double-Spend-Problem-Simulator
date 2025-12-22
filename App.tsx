
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationStep, SimulationParams, ViewMode } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FlowDiagram from './components/FlowDiagram';
import TableView from './components/TableView';
import GraphView from './components/GraphView';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    initialDeposit: 1000,
    reserveRatio: 0.1,
    simulationSpeed: 1000,
  });

  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FLOW);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);
  
  // Use ReturnType<typeof setInterval> to avoid "Cannot find namespace 'NodeJS'" error in browser environments.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateNextStep = useCallback((currentSteps: SimulationStep[]): SimulationStep => {
    const index = currentSteps.length;
    let deposit = 0;
    let totalMoneySupply = 0;

    if (index === 0) {
      deposit = Math.round(params.initialDeposit * 100) / 100;
      totalMoneySupply = deposit;
    } else {
      const prevStep = currentSteps[index - 1];
      // The new deposit is the loan from the previous bank
      deposit = prevStep.loan;
      totalMoneySupply = Math.round((prevStep.totalMoneySupply + deposit) * 100) / 100;
    }

    // Fractional reserve calculation with $0.01 precision
    const reserves = Math.round(deposit * params.reserveRatio * 100) / 100;
    const loan = Math.round((deposit - reserves) * 100) / 100;

    return {
      index,
      deposit: Math.round(deposit * 100) / 100,
      reserves,
      loan,
      totalMoneySupply,
      bankName: `Bank ${String.fromCharCode(65 + (index % 26))}${index > 25 ? Math.floor(index / 26) : ''}`
    };
  }, [params]);

  const stepForward = useCallback(() => {
    setSteps(prev => {
      // Increased safety cap to allow longer simulations if the reserve ratio is very small
      if (prev.length >= 500) {
        setIsPlaying(false);
        setIsLimitReached(true);
        return prev;
      }

      const next = calculateNextStep(prev);

      // Stop the simulation at the last cycle where the reserve ratio can be maintained
      // None of the core metrics (Deposit, Reserves, Loan) can fall below the minimum unit of $0.01
      if (next.deposit < 0.01 || next.reserves < 0.01 || next.loan < 0.01) {
        setIsPlaying(false);
        setIsLimitReached(true);
        return prev;
      }

      return [...prev, next];
    });
  }, [calculateNextStep]);

  const resetSimulation = () => {
    setSteps([]);
    setIsPlaying(false);
    setIsLimitReached(false);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(stepForward, params.simulationSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepForward, params.simulationSpeed]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar Controls */}
      <Sidebar 
        params={params} 
        setParams={setParams} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        onStep={stepForward}
        onReset={resetSimulation}
        currentStepCount={steps.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Money Creation Simulator</h1>
            <p className="text-slate-500 text-sm">Visualizing the Fractional-Reserve Banking Multiplier</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode(ViewMode.FLOW)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.FLOW ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <i className="fas fa-project-diagram mr-2"></i> Flow
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.TABLE)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.TABLE ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <i className="fas fa-table mr-2"></i> Table
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.GRAPH)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.GRAPH ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <i className="fas fa-chart-line mr-2"></i> Graph
            </button>
          </div>
        </header>

        {/* Real-Time Dashboard */}
        <Dashboard steps={steps} params={params} />

        {/* Visualization Window */}
        <div className="flex-1 overflow-auto p-6">
          {steps.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <i className="fas fa-play-circle text-6xl mb-4 opacity-20"></i>
              <p className="text-lg">Click Play or Step to begin the simulation</p>
            </div>
          ) : (
            <div className="h-full">
              {viewMode === ViewMode.FLOW && <FlowDiagram steps={steps} />}
              {viewMode === ViewMode.TABLE && <TableView steps={steps} />}
              {viewMode === ViewMode.GRAPH && <GraphView steps={steps} params={params} />}
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <footer className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isLimitReached && (
              <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">
                <i className="fas fa-info-circle"></i>
                Smallest unit reached ($0.01). Reserve ratio cannot be maintained.
              </span>
            )}
            <span>Max cycles: 500</span>
          </div>
          <span className="font-medium">Theoretical Limit: ${(params.initialDeposit / params.reserveRatio).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </footer>
      </main>
    </div>
  );
};

export default App;
