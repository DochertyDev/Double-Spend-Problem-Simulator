export class Dashboard {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="metric">
          <label>Total Money:</label>
          <span id="total-money">$0.00</span>
        </div>
        <div class="metric">
          <label>Current Cycle:</label>
          <span id="current-cycle">0</span>
        </div>
        <div class="metric">
          <label>Money Multiplier:</label>
          <span id="money-multiplier">1.00x</span>
        </div>
      </div>
    `;
  }

  update(simulationState) {
    if (!simulationState || simulationState.cycles.length === 0) return;

    const latestCycle = simulationState.cycles[simulationState.cycles.length - 1];
    const initialDeposit = simulationState.config.initialDeposit;
    const moneyMultiplier = latestCycle.totalMoney / initialDeposit;

    this.container.querySelector('#total-money').textContent = 
      `$${latestCycle.totalMoney.toFixed(2)}`;
    this.container.querySelector('#current-cycle').textContent = 
      latestCycle.cycleNumber;
    this.container.querySelector('#money-multiplier').textContent = 
      `${moneyMultiplier.toFixed(2)}x`;
  }
}