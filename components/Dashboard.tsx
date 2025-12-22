
import React from 'react';
import { SimulationStep, SimulationParams } from '../types';

interface DashboardProps {
  steps: SimulationStep[];
  params: SimulationParams;
}

const Dashboard: React.FC<DashboardProps> = ({ steps, params }) => {
  const currentStep = steps[steps.length - 1];
  const totalMoneySupply = currentStep?.totalMoneySupply || 0;
  const totalLoans = steps.reduce((acc, s) => acc + s.loan, 0);
  const totalReserves = steps.reduce((acc, s) => acc + s.reserves, 0);
  const multiplier = params.initialDeposit > 0 ? (totalMoneySupply / params.initialDeposit).toFixed(2) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-4 bg-white border-b border-slate-200 shrink-0">
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
            <i className="fas fa-university"></i>
          </div>
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Total Supply</span>
        </div>
        <div className="text-2xl font-black text-blue-900">${totalMoneySupply.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className="text-xs text-blue-600 mt-1">Growth: {multiplier}x</div>
      </div>

      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
            <i className="fas fa-hand-holding-usd"></i>
          </div>
          <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Created Credit</span>
        </div>
        <div className="text-2xl font-black text-green-900">${totalLoans.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className="text-xs text-green-600 mt-1">Sum of all loans</div>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs">
            <i className="fas fa-vault"></i>
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Total Reserves</span>
        </div>
        <div className="text-2xl font-black text-amber-900">${totalReserves.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className="text-xs text-amber-600 mt-1">Held by central bank</div>
      </div>

      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
            <i className="fas fa-layer-group"></i>
          </div>
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Cycles Run</span>
        </div>
        <div className="text-2xl font-black text-purple-900">{steps.length}</div>
        <div className="text-xs text-purple-600 mt-1">Financial iterations</div>
      </div>
    </div>
  );
};

export default Dashboard;
