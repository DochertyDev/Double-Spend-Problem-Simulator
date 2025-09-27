export class Dashboard {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="dashboard">
        <div class="metric">
          <label>Initial Deposit:</label>
          <span id="initial-deposit" class="metric-green">$0.00</span>
        </div>
        <div class="metric">
          <label>Money Created:</label>
          <span id="money-created" class="metric-red">$0.00</span>
        </div>
        <div class="metric">
          <label>Total Money:</label>
          <span id="total-money" class="metric-orange">$0.00</span>
        </div>
        <div class="dashboard-bottom-metrics">
          <div class="metric-pill-combined">
            <div class="metric metric-small">
              <label>Current Cycle:</label>
              <span id="current-cycle">0</span>
            </div>
            <div class="metric metric-small">
              <label>Money Multiplier:</label>
              <span id="money-multiplier">1.00x</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  update(simulationState) {
    if (!simulationState || simulationState.cycles.length === 0) return;

    const latestCycle = simulationState.cycles[simulationState.cycles.length - 1];
    const initialDeposit = simulationState.config.initialDeposit;
    const totalMoney = latestCycle.totalMoney;
    const moneyCreated = totalMoney - initialDeposit;
    const moneyMultiplier = totalMoney / initialDeposit;

    this.container.querySelector('#initial-deposit').textContent = 
      `$${initialDeposit.toFixed(2)}`;
    this.container.querySelector('#money-created').textContent = 
      `$${moneyCreated.toFixed(2)}`;
    this.container.querySelector('#total-money').textContent = 
      `$${totalMoney.toFixed(2)}`;
    this.container.querySelector('#current-cycle').textContent = 
      latestCycle.cycleNumber;
    this.container.querySelector('#money-multiplier').textContent = 
      `${moneyMultiplier.toFixed(2)}x`;
  }
}