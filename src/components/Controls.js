export class Controls {
  constructor(container, { onSimulationStart, onPause, onStep }) {
    this.container = container;
    this.onSimulationStart = onSimulationStart;
    this.onPause = onPause;
    this.onStep = onStep;
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
        <div class="input-group">
          <label for="simulation-speed">Simulation Speed: <span id="speed-label">20 tps</span></label>
          <input type="range" id="simulation-speed" min="1" max="40" value="20">
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
    const depositInput = this.container.querySelector('#initial-deposit');
    const ratioInput = this.container.querySelector('#reserve-ratio');
    const speedInput = this.container.querySelector('#simulation-speed');
    const speedLabel = this.container.querySelector('#speed-label');

    const updateButtons = () => this.validateInputs();

    depositInput.addEventListener('input', updateButtons);
    ratioInput.addEventListener('input', updateButtons);
    speedInput.addEventListener('input', () => {
      speedLabel.textContent = speedInput.value + ' tps';
    });

    runButton.addEventListener('click', () => {
      if (this.validateInputs()) {
        const config = {
          initialDeposit: parseFloat(depositInput.value),
          reserveRatio: parseFloat(ratioInput.value),
          simulationSpeed: parseInt(speedInput.value, 10)
        };
        this.onSimulationStart(config);
        runButton.disabled = true;
        pauseButton.disabled = false;
        stepButton.disabled = false;
      }
    });

    pauseButton.addEventListener('click', () => {
      if (this.onPause) this.onPause();
    });

    stepButton.addEventListener('click', () => {
      if (this.onStep) this.onStep();
    });

    this.validateInputs();
  }

  validateInputs() {
    const depositInput = this.container.querySelector('#initial-deposit');
    const ratioInput = this.container.querySelector('#reserve-ratio');
    const runButton = this.container.querySelector('#run-simulation');

    const deposit = parseFloat(depositInput.value);
    const ratio = parseFloat(ratioInput.value);

    const isValid = !isNaN(deposit) && !isNaN(ratio) && 
                   deposit > 0 && ratio >= 0 && ratio <= 1;

    const depositGroup = depositInput.parentElement;
    const ratioGroup = ratioInput.parentElement;
    depositGroup.classList.toggle('invalid', isNaN(deposit) || deposit <= 0);
    ratioGroup.classList.toggle('invalid', isNaN(ratio) || ratio < 0 || ratio > 1);
    runButton.disabled = !isValid;

    return isValid;
  }

  simulationFinished() {
    const runButton = this.container.querySelector('#run-simulation');
    runButton.textContent = 'Rerun';
    runButton.disabled = false;
    this.container.querySelector('#pause-simulation').disabled = true;
    this.container.querySelector('#step-simulation').disabled = true;
  }

  showRerunButton() {
    const runButton = this.container.querySelector('#run-simulation');
    runButton.textContent = 'Rerun';
    runButton.disabled = false;
  }

  hideRerunButton() {
    const runButton = this.container.querySelector('#run-simulation');
    runButton.textContent = 'Run Simulation';
    runButton.disabled = true;
  }

  setPauseButtonState(isPaused) {
    const pauseButton = this.container.querySelector('#pause-simulation');
    pauseButton.textContent = isPaused ? 'Play' : 'Pause';
  }
}