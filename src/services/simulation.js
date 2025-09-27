/**
 * Represents a single step in the simulation, containing the state of the system at that point.
 */
export class SimulationCycle {
  /**
   * @param {Object} params - The initialization parameters
   * @param {number} params.cycleNumber - The current cycle number (1-based)
   * @param {number} [params.initialDeposit] - The starting amount for first cycle
   * @param {number} params.reserveRatio - The reserve ratio (0-1)
   * @param {SimulationCycle} [params.previousCycle] - The previous cycle for calculations
   */
  constructor({ cycleNumber, initialDeposit, reserveRatio, previousCycle }) {
    this.cycleNumber = cycleNumber;
    this.reserveRatio = reserveRatio;

    if (cycleNumber === 1) {
      this.deposits = initialDeposit;
      this.totalMoney = initialDeposit;
    } else {
      this.deposits = previousCycle.loans;
      this.totalMoney = previousCycle.totalMoney + this.deposits;
    }

    this.reserves = this.deposits * this.reserveRatio;
    this.loans = Math.max(0, this.deposits - this.reserves);
  }
}

/**
 * Represents the overall state of a simulation instance.
 */
export class SimulationState {
  /**
   * @param {Object} config - The simulation configuration
   * @param {number} config.initialDeposit - The starting amount
   * @param {number} config.reserveRatio - The reserve ratio (0-1)
   * @param {number} [config.numCycles] - Optional maximum number of cycles
   */
  constructor(config) {
    this.config = config;
    this.cycles = [];
    this.status = 'ready';
  }

  /**
   * Process the next cycle in the simulation.
   * @returns {SimulationCycle} The newly created cycle
   */
  processNextCycle() {
    this.status = 'running';
    
    const cycleNumber = this.cycles.length + 1;
    const previousCycle = this.cycles[cycleNumber - 2];
    
    const cycle = new SimulationCycle({
      cycleNumber,
      initialDeposit: this.config.initialDeposit,
      reserveRatio: this.config.reserveRatio,
      previousCycle
    });

    this.cycles.push(cycle);

    // Check if we should stop
    if (cycle.loans <= 0.01 || 
        (this.config.numCycles && cycleNumber >= this.config.numCycles)) {
      this.status = 'finished';
    }

    return cycle;
  }

  /**
   * Get the current total money in the system
   * @returns {number}
   */
  getTotalMoney() {
    return this.cycles.length > 0 ? 
      this.cycles[this.cycles.length - 1].totalMoney : 
      0;
  }
}