import { SimulationCycle, SimulationState } from '../../src/services/simulation';

describe('SimulationCycle', () => {
  test('should calculate correct values for first cycle', () => {
    const cycle = new SimulationCycle({
      cycleNumber: 1,
      initialDeposit: 1000,
      reserveRatio: 0.1
    });

    expect(cycle.cycleNumber).toBe(1);
    expect(cycle.deposits).toBe(1000);
    expect(cycle.reserves).toBe(100);
    expect(cycle.loans).toBe(900);
    expect(cycle.totalMoney).toBe(1000);
  });

  test('should calculate correct values for subsequent cycles', () => {
    const firstCycle = new SimulationCycle({
      cycleNumber: 1,
      initialDeposit: 1000,
      reserveRatio: 0.1
    });

    const secondCycle = new SimulationCycle({
      cycleNumber: 2,
      previousCycle: firstCycle,
      reserveRatio: 0.1
    });

    expect(secondCycle.cycleNumber).toBe(2);
    expect(secondCycle.deposits).toBe(900); // loans from previous cycle
    expect(secondCycle.reserves).toBe(90);
    expect(secondCycle.loans).toBe(810);
    expect(secondCycle.totalMoney).toBe(1900); // 1000 + 900
  });
});

describe('SimulationState', () => {
  test('should initialize with correct configuration', () => {
    const config = {
      initialDeposit: 1000,
      reserveRatio: 0.1,
      numCycles: 5
    };

    const simulation = new SimulationState(config);
    expect(simulation.config).toEqual(config);
    expect(simulation.cycles).toHaveLength(0);
    expect(simulation.status).toBe('ready');
  });

  test('should process cycles correctly', () => {
    const simulation = new SimulationState({
      initialDeposit: 1000,
      reserveRatio: 0.1
    });

    simulation.processNextCycle();
    expect(simulation.cycles).toHaveLength(1);
    expect(simulation.cycles[0].totalMoney).toBe(1000);

    simulation.processNextCycle();
    expect(simulation.cycles).toHaveLength(2);
    expect(simulation.cycles[1].totalMoney).toBe(1900);
  });

  test('should handle 100% reserve ratio correctly', () => {
    const simulation = new SimulationState({
      initialDeposit: 1000,
      reserveRatio: 1.0
    });

    simulation.processNextCycle();
    simulation.processNextCycle();

    expect(simulation.cycles[1].loans).toBe(0);
    expect(simulation.cycles[1].totalMoney).toBe(1000);
  });

  test('should stop when loanable amount becomes negligible', () => {
    const simulation = new SimulationState({
      initialDeposit: 1000,
      reserveRatio: 0.9
    });

    simulation.runFullSimulation();

    expect(simulation.cycles.length).toBeGreaterThan(0);

    const lastCycle = simulation.cycles[simulation.cycles.length - 1];
    expect(lastCycle.loans).toBeLessThanOrEqual(0.01);
  });
});