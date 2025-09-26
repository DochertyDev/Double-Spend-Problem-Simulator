export class Controls {
  constructor(container, onSimulationStart) {
    this.container = container;
    this.onSimulationStart = onSimulationStart;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="controls">
        <div class="input-group">
          <label for="initial-deposit">Initial Deposit:</label>
          <input type="number" id="initial-deposit" min="0" step="100" value="1000">
        </div>
        <div class="input-group">
          <label for="reserve-ratio">Reserve Ratio:</label>
          <input type="number" id="reserve-ratio" min="0" max="1" step="0.1" value="0.1">
        </div>
        <div class="simulation-controls">
          <button id="run-simulation">Run Simulation</button>
          <button id="pause-simulation" disabled>Pause</button>
          <button id="step-simulation" disabled>Step</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const runButton = this.container.querySelector('#run-simulation');
    const pauseButton = this.container.querySelector('#pause-simulation');
    const stepButton = this.container.querySelector('#step-simulation');

    this.validateInputs();

    runButton.addEventListener('click', () => {
      if (this.validateInputs()) {
        const config = {
          initialDeposit: parseFloat(this.container.querySelector('#initial-deposit').value),
          reserveRatio: parseFloat(this.container.querySelector('#reserve-ratio').value)
        };
        this.onSimulationStart(config);
        runButton.disabled = true;
        pauseButton.disabled = false;
        stepButton.disabled = false;
      }
    });
  }

  validateInputs() {
    const depositInput = this.container.querySelector('#initial-deposit');
    const ratioInput = this.container.querySelector('#reserve-ratio');
    const runButton = this.container.querySelector('#run-simulation');

    const deposit = parseFloat(depositInput.value);
    const ratio = parseFloat(ratioInput.value);

    const isValid = !isNaN(deposit) && !isNaN(ratio) && 
                   deposit > 0 && ratio >= 0 && ratio <= 1;

    depositInput.classList.toggle('invalid', isNaN(deposit) || deposit <= 0);
    ratioInput.classList.toggle('invalid', isNaN(ratio) || ratio < 0 || ratio > 1);
    runButton.disabled = !isValid;

    return isValid;
  }
}