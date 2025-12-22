
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SimulationStep, SimulationParams } from '../types';

interface GraphViewProps {
  steps: SimulationStep[];
  params: SimulationParams;
}

const GraphView: React.FC<GraphViewProps> = ({ steps, params }) => {
  const chartData = steps.map(s => ({
    name: `Step ${s.index + 1}`,
    total: parseFloat(s.totalMoneySupply.toFixed(2)),
    deposit: parseFloat(s.deposit.toFixed(2)),
    loan: parseFloat(s.loan.toFixed(2)),
  }));

  return (
    <div className="flex flex-col h-full min-h-[500px] w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-0 shrink-0">
        <h3 className="text-lg font-bold text-slate-800">Financial Multiplier Dynamics</h3>
        <p className="text-sm text-slate-500">Comparing total money growth vs. individual transaction decay</p>
      </div>
      
      {/* Chart Area - Flex-1 ensures it fills middle space exactly */}
      <div className="flex-1 w-full px-4 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={{ stroke: '#f1f5f9' }}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px',
                fontSize: '13px',
                zIndex: 50
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '10px' }}
            />
            
            <ReferenceLine 
              y={params.initialDeposit} 
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ 
                position: 'right', 
                value: 'Base', 
                fill: '#94a3b8', 
                fontSize: 10,
                fontWeight: 700,
                offset: 10
              }} 
            />

            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Total Money Supply"
              dot={{ r: 3, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={300}
            />

            <Line 
              type="monotone" 
              dataKey="deposit" 
              stroke="#6366f1" 
              strokeWidth={2}
              name="Deposit"
              dot={false}
              animationDuration={300}
            />

            <Line 
              type="monotone" 
              dataKey="loan" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Loan"
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Metrics Footer - Stays at bottom of card */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-100 shrink-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting Point</span>
            <span className="text-sm font-semibold text-slate-700">${params.initialDeposit.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Supply</span>
            <span className="text-sm font-semibold text-blue-600">${chartData[chartData.length - 1]?.total.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Latest Loan</span>
            <span className="text-sm font-semibold text-green-600">${chartData[chartData.length - 1]?.loan.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphView;
