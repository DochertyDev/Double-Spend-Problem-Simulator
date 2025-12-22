
import React from 'react';
import { SimulationStep } from '../types';

interface TableViewProps {
  steps: SimulationStep[];
}

const TableView: React.FC<TableViewProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Step</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Entity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Deposit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right text-amber-600">Reserves</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right text-green-600">New Loan</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right text-blue-600">Total Money</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {steps.map((step) => (
              <tr key={step.index} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-400">#{step.index + 1}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {step.bankName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-600 text-right">${step.deposit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm font-mono text-amber-700 text-right bg-amber-50/30">${step.reserves.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm font-mono text-green-700 text-right bg-green-50/30">${step.loan.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-sm font-bold text-blue-800 text-right">${step.totalMoneySupply.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
