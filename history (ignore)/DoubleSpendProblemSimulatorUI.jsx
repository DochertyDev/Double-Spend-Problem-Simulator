import React, { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

// FractionalReserveSimulator.jsx
// Single-file React component (Tailwind CSS assumed).
// - Uses recharts for a simple line chart
// - Uses framer-motion for simple animations
// - Designed as a production-ready starting point for "vibe-coding"

export default function FractionalReserveSimulator() {
  // Controls
  const [initialDeposit, setInitialDeposit] = useState(1000);
  const [reserveRatioPct, setReserveRatioPct] = useState(10); // percent
  const [spendPct, setSpendPct] = useState(100); // percent of loan that gets spent/redeposited
  const [maxCycles, setMaxCycles] = useState(10);
  const [stopWhenLoanBelowOne, setStopWhenLoanBelowOne] = useState(true);
  const [preset, setPreset] = useState("standard");

  // UI state for animation / stepping
  const [playing, setPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(null);
  const timerRef = useRef(null);

  // Presets
  const presets = {
    standard: { reserveRatioPct: 10, spendPct: 100 },
    lowReserve: { reserveRatioPct: 1, spendPct: 100 },
    conservative: { reserveRatioPct: 25, spendPct: 90 },
    leakyEconomy: { reserveRatioPct: 10, spendPct: 60 },
  };

  // Simulation function: returns array of cycle objects
  const simulate = (initialDeposit, reserveRatioPct, spendPct, maxCycles, stopWhenLoanBelowOne) => {
    const cycles = [];
    const reserveRatio = reserveRatioPct / 100;
    let deposit = initialDeposit;
    let cycle = 0;
    let totalDeposits = deposit;
    let totalCreated = 0; // created money (loans)
    let cumulativeReserves = deposit * reserveRatio;

    // first deposit causes reserves to be set aside and lendable portion to be loaned
    while (cycle < maxCycles) {
      const reserveAdded = deposit * reserveRatio;
      const loanable = deposit - reserveAdded; // amount bank can loan out
      const loan = loanable;
      const loanSpentAndRedepsit = (loan * (spendPct / 100));

      // create cycle record
      cycles.push({
        cycle: cycle + 1,
        deposit: deposit,
        reserveAdded: reserveAdded,
        loan: loan,
        loanSpentAndRedepsit: loanSpentAndRedepsit,
        totalDeposits: totalDeposits,
        cumulativeReserves: cumulativeReserves,
        totalCreated: totalCreated,
      });

      // update totals for next iteration
      totalCreated += loan;
      cumulativeReserves += reserveAdded;

      // next deposit is the portion of loan that gets redeposited.
      deposit = loanSpentAndRedepsit;
      totalDeposits += deposit;

      cycle += 1;

      if (stopWhenLoanBelowOne && loan < 1) break;
      if (deposit < 0.000001) break; // numerical safety
    }

    // final KPIs
    const startingMoney = initialDeposit;
    const createdMoney = totalCreated;
    const totalMoney = startingMoney + createdMoney;

    return { cycles, kpis: { startingMoney, createdMoney, totalMoney, cumulativeReserves } };
  };

  const results = useMemo(() => simulate(initialDeposit, reserveRatioPct, spendPct, maxCycles, stopWhenLoanBelowOne), [initialDeposit, reserveRatioPct, spendPct, maxCycles, stopWhenLoanBelowOne]);

  // Animation controls
  const startPlay = () => {
    setPlaying(true);
    setStepIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStepIndex((i) => {
        if (i === null) return 0;
        if (i >= results.cycles.length - 1) {
          clearInterval(timerRef.current);
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 800);
  };
  const stopPlay = () => {
    setPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // CSV export
  const exportCSV = () => {
    const header = ["cycle", "deposit", "reserveAdded", "loan", "loanSpentAndRedepsit", "totalDeposits", "cumulativeReserves", "totalCreated"];
    const rows = results.cycles.map((r, idx) => [
      r.cycle,
      r.deposit.toFixed(4),
      r.reserveAdded.toFixed(4),
      r.loan.toFixed(4),
      r.loanSpentAndRedepsit.toFixed(4),
      r.totalDeposits.toFixed(4),
      r.cumulativeReserves.toFixed(4),
      // totalCreated isn't stored per-row; we can compute running sum
    ]);
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fractional_reserve_simulation.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple chart data formation
  const chartData = results.cycles.map((c) => ({ name: `C${c.cycle}`, totalDeposits: c.totalDeposits, cumulativeReserves: c.cumulativeReserves }));

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Fractional Reserve Simulator</h1>
          <div className="text-sm text-slate-600">Vibe-code ready UI • interactive educational tool</div>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Controls */}
          <aside className="col-span-4 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Controls</h2>

            <label className="text-xs text-slate-500">Initial Deposit</label>
            <input type="number" className="w-full mt-1 p-2 border rounded" value={initialDeposit} onChange={e => setInitialDeposit(Number(e.target.value))} />

            <label className="text-xs text-slate-500 mt-3">Reserve Ratio: {reserveRatioPct}%</label>
            <input type="range" min={0} max={100} value={reserveRatioPct} onChange={e => setReserveRatioPct(Number(e.target.value))} />

            <label className="text-xs text-slate-500 mt-3">% of Loan Spent & Redepsited: {spendPct}%</label>
            <input type="range" min={0} max={100} value={spendPct} onChange={e => setSpendPct(Number(e.target.value))} />

            <label className="text-xs text-slate-500 mt-3">Max Cycles</label>
            <input type="number" className="w-full mt-1 p-2 border rounded" value={maxCycles} onChange={e => setMaxCycles(Number(e.target.value))} />

            <div className="flex items-center mt-3">
              <input id="stopBelowOne" type="checkbox" checked={stopWhenLoanBelowOne} onChange={e => setStopWhenLoanBelowOne(e.target.checked)} />
              <label htmlFor="stopBelowOne" className="ml-2 text-sm text-slate-600">Stop when loan &lt; $1</label>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded bg-sky-600 text-white" onClick={() => { setPreset('standard'); setReserveRatioPct(presets.standard.reserveRatioPct); setSpendPct(presets.standard.spendPct); }}>Preset: Standard</button>
              <button className="flex-1 py-2 rounded bg-slate-200" onClick={() => { setPreset('lowReserve'); setReserveRatioPct(presets.lowReserve.reserveRatioPct); setSpendPct(presets.lowReserve.spendPct); }}>Low Reserve</button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button className="col-span-2 py-2 rounded border text-slate-700" onClick={() => { setStepIndex(0); }}>Step to start</button>
              {!playing ? (
                <button className="py-2 rounded bg-emerald-500 text-white" onClick={startPlay}>Play</button>
              ) : (
                <button className="py-2 rounded bg-red-500 text-white" onClick={stopPlay}>Stop</button>
              )}
            </div>

            <div className="mt-4">
              <button className="w-full p-2 rounded border" onClick={exportCSV}>Export CSV</button>
            </div>

            <div className="mt-4 text-xs text-slate-500 space-y-2">
              <div><strong>Tip:</strong> Try comparing two browser tabs with different reserve ratios.</div>
              <div><strong>Educational Mode:</strong> Hover any KPI or table row for definitions.</div>
            </div>
          </aside>

          {/* Visualization */}
          <main className="col-span-8 space-y-4">
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Simulation Flow</h3>
                  <p className="text-sm text-slate-500">Animated step-by-step view + chart + table.</p>
                </div>
                <div className="text-sm">
                  Cycles: <span className="font-medium">{results.cycles.length}</span>
                </div>
              </div>

              {/* Flow diagram placeholder (vibe: animated circles and arrows) */}
              <div className="mt-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12">
                  <div className="h-40 bg-slate-50 rounded p-3 border flex items-center justify-center">
                    <div className="text-slate-400">Flow diagram preview. Use SVG/Canvas to animate deposits → reserves → loans → redeposits.</div>
                  </div>
                </div>

                {/* KPI cards */}
                <div className="col-span-12 grid grid-cols-3 gap-3 mt-3">
                  <div className="p-3 rounded-lg border bg-white">
                    <div className="text-xs text-slate-500">Starting Deposit</div>
                    <div className="text-xl font-bold">${results.kpis.startingMoney.toLocaleString()}</div>
                  </div>
                  <div className="p-3 rounded-lg border bg-white">
                    <div className="text-xs text-slate-500">Created Money (sum of loans)</div>
                    <div className="text-xl font-bold">${results.kpis.createdMoney.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                  </div>
                  <div className="p-3 rounded-lg border bg-white">
                    <div className="text-xs text-slate-500">Total Money</div>
                    <div className="text-xl font-bold">${results.kpis.totalMoney.toLocaleString(undefined, {maximumFractionDigits:2})}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Chart + Table */}
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <h4 className="font-medium">Chart</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="totalDeposits" stroke="#10B981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="cumulativeReserves" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-5">
                  <h4 className="font-medium">Cycle Table</h4>
                  <div className="mt-2 max-h-48 overflow-auto text-sm border rounded">
                    <table className="w-full table-auto text-left">
                      <thead className="bg-slate-100 sticky top-0">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Deposit</th>
                          <th className="p-2">Loan</th>
                          <th className="p-2">Reserve</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.cycles.map((r, idx) => (
                          <tr key={r.cycle} className={`${stepIndex === idx ? 'bg-amber-50' : ''}`}>
                            <td className="p-2">{r.cycle}</td>
                            <td className="p-2">${r.deposit.toFixed(2)}</td>
                            <td className="p-2">${r.loan.toFixed(2)}</td>
                            <td className="p-2">${r.reserveAdded.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Advanced / export / sharing */}
            <section className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="text-sm text-slate-600">Advanced: tiered reserves, central-bank liquidity injections, and negative reserve shocks can be added later.</div>
              <div className="flex gap-2">
                <button className="py-2 px-3 border rounded">Save Scenario</button>
                <button className="py-2 px-3 border rounded" onClick={exportCSV}>Download CSV</button>
              </div>
            </section>

          </main>
        </div>

        <footer className="text-xs text-slate-500">
          Built for teaching & exploration. Cite sources when presenting results publicly.
        </footer>
      </div>
    </div>
  );
}
