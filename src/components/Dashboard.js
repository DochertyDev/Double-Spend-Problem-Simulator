export class Dashboard {
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="glass-card dashboard-layout">
        <div class="dashboard-top-row glass-card">
          <div class="metric">
            <label>Initial Deposit:</label>
            <span id="initial-deposit" class="metric-green" style="font-weight: bold;">$0.00</span>
          </div>
          <div class="metric">
            <label>Money Created:</label>
            <span id="money-created" class="metric-red" style="font-weight: bold;">$0.00</span>
          </div>
          <div class="metric">
            <label>Total Money:</label>
            <span id="total-money" class="metric-orange" style="font-weight: bold;">$0.00</span>
          </div>
        </div>
        <div class="dashboard-bottom-row">
          <div class="metric-pill-combined glass-card">
            <div class="metric metric-small">
              <label>Current Cycle:</label>
              <span id="current-cycle" style="font-weight: bold;">0</span>
            </div>
            <div class="metric metric-small">
              <label>Money Multiplier:</label>
              <span id="money-multiplier" style="font-weight: bold;">1.00x</span>
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