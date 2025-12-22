
export interface SimulationStep {
  index: number;
  deposit: number;
  reserves: number;
  loan: number;
  totalMoneySupply: number;
  bankName: string;
}

export interface SimulationParams {
  initialDeposit: number;
  reserveRatio: number; // 0.1 for 10%
  simulationSpeed: number; // ms per step
}

export enum ViewMode {
  FLOW = 'flow',
  TABLE = 'table',
  GRAPH = 'graph'
}
