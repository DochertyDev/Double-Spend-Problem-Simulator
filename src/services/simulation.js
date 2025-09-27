/**
 * The minimum viable reserve amount (one cent).
 */
const MIN_RESERVE_AMOUNT = 0.01;

/**
 * Validates if a given deposit amount can meet the reserve requirements.
 * @param {number} depositAmount - The amount of the deposit.
 * @param {number} reserveRatio - The reserve ratio (0-1).
 * @returns {{isValid: boolean, calculatedReserve: number, minimumDepositRequired: number}}
 */
export function validateReserveConstraints(depositAmount, reserveRatio) {
  if (reserveRatio <= 0) {
    return {
      isValid: true,
      calculatedReserve: 0,
      minimumDepositRequired: 0,
    };
  }
  const calculatedReserve = depositAmount * reserveRatio;
  const minimumDepositRequired = MIN_RESERVE_AMOUNT / reserveRatio;
  return {
    isValid: calculatedReserve >= MIN_RESERVE_AMOUNT,
    calculatedReserve,
    minimumDepositRequired,
  };
}


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

    const deposit = cycleNumber === 1 ? initialDeposit : previousCycle.loans;
    const validation = validateReserveConstraints(deposit, reserveRatio);
    
    this.isValid = validation.isValid;
    this.deposits = deposit;

    if (cycleNumber === 1) {
      this.totalMoney = deposit;
    } else {
      this.totalMoney = previousCycle.totalMoney + this.deposits;
    }

    if (this.isValid) {
      this.reserves = this.deposits * this.reserveRatio;
      this.loans = Math.max(0, this.deposits - this.reserves);
    } else {
      this.reserves = 0;
      this.loans = 0;
    }
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
    this.endReason = null;
  }

  /**
   * Process the next cycle in the simulation.
   * @returns {SimulationCycle | null} The newly created cycle or null if simulation ended
   */
  processNextCycle() {
    if (this.status === 'finished') {
      return null;
    }
    
    this.status = 'running';
    
    const cycleNumber = this.cycles.length + 1;
    const previousCycle = this.cycles.length > 0 ? this.cycles[this.cycles.length - 1] : null;
    
    // Validate before creating the next cycle
    if (previousCycle) {
      const nextDeposit = previousCycle.loans;
      const { isValid } = validateReserveConstraints(nextDeposit, this.config.reserveRatio);
      if (!isValid) {
        this.status = 'finished';
        this.endReason = 'insufficient_reserves';
        return null;
      }
    }

    const cycle = new SimulationCycle({
      cycleNumber,
      initialDeposit: this.config.initialDeposit,
      reserveRatio: this.config.reserveRatio,
      previousCycle
    });

    this.cycles.push(cycle);

    // Check stopping conditions
    if (!cycle.isValid) {
        this.status = 'finished';
        this.endReason = 'insufficient_reserves';
    } else if (cycle.loans <= 0.01) {
        this.status = 'finished';
        this.endReason = 'natural_completion';
    } else if (this.config.numCycles && cycleNumber >= this.config.numCycles) {
        this.status = 'finished';
        this.endReason = 'max_cycles_reached';
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

  /**
   * Returns the minimum deposit needed for the next cycle to be valid.
   * @returns {number}
   */
  getMinimumDepositForNextCycle() {
    const { minimumDepositRequired } = validateReserveConstraints(0, this.config.reserveRatio);
    return minimumDepositRequired;
  }

  /**
   * Indicates if the simulation can proceed to the next cycle.
   * @returns {boolean}
   */
  canProceedToNextCycle() {
    return this.status !== 'finished';
  }

  /**
   * Returns the reason why the simulation ended.
   * @returns {string | null}
   */
  getEndReason() {
    return this.endReason;
  }
}
