import { SimulationState } from '../services/simulation.js';
import { Controls } from './Controls.js';
import { Dashboard } from './Dashboard.js';
import { TableView } from './TableView.js';
import { GraphView } from './GraphView.js';
import { FlowDiagram } from './FlowDiagram.js';
import { EducationMode } from './EducationMode.js';

export class App {
  constructor() {
    this.state = {
      simulationState: null,
      currentView: 'table',
      educationMode: false,
      simulationSpeed: 5 // Default speed
    };

    this.init();
  }

  init() {
    this.container = document.getElementById('app');
    this.renderInitialLayout();
    this.attachEventListeners();
  }

  renderInitialLayout() {
    this.container.innerHTML = `
      <div class="app-container">
        <header>
          <h1>Double Spend Problem Simulator</h1>
          <button id="education-toggle">Education Mode</button>
        </header>
        <main>
          <div id="controls"></div>
          <div id="dashboard"></div>
          <div id="visualization">
            <div class="view-controls">
              <button class="view-button active" data-view="table">Table View</button>
              <button class="view-button" data-view="graph">Graph View</button>
              <button class="view-button" data-view="flow">Flow Diagram</button>
            </div>
            <div class="view-container">
              <div class="table-view"></div>
              <div class="graph-view" style="display: none;"></div>
              <div id="flow-diagram" style="display: none;"></div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Initialize components
    const controlsEl = document.getElementById('controls');
    const dashboardEl = document.getElementById('dashboard');
    const tableViewEl = document.querySelector('.table-view');
    const graphViewEl = document.querySelector('.graph-view');
    const flowDiagramEl = document.getElementById('flow-diagram');

    if (controlsEl && dashboardEl && tableViewEl && graphViewEl && flowDiagramEl) {
      this.controls = new Controls(controlsEl, {
        onSimulationStart: (config) => this.handleSimulationStart(config),
        onPause: () => this.togglePause(),
        onStep: () => this.stepSimulation(),
      });
      this.dashboard = new Dashboard(dashboardEl);
      this.tableView = new TableView(tableViewEl);
      this.graphView = new GraphView(graphViewEl);
      this.flowDiagram = new FlowDiagram(flowDiagramEl);
      this.educationMode = new EducationMode(this.container);
    }
  }

  attachEventListeners() {
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => this.switchView(button.dataset.view));
    });

    document.getElementById('education-toggle').addEventListener('click', () => {
      this.toggleEducationMode();
    });
  }

  handleSimulationStart(config) {
    this.state.simulationState = new SimulationState(config);
    this.state.simulationState.status = 'running'; // Set status to running
    this.state.simulationSpeed = config.simulationSpeed;
    this.controls.setPauseButtonState(false); // Reset pause button
    this.startSimulation();
  }

  startSimulation() {
    if (this.state.simulationState.status !== 'running') return;

    this.state.simulationState.processNextCycle();
    this.updateUI();

    if (this.state.simulationState.status === 'finished') {
      clearTimeout(this.animationFrameId);
      this.controls.simulationFinished(); // Call the new method
    } else {
      // Adjust the timeout based on the simulation speed
      const timeout = 1000 / this.state.simulationSpeed;
      this.animationFrameId = setTimeout(() => this.startSimulation(), timeout);
    }
  }

  togglePause() {
    if (this.state.simulationState.status === 'running') {
      this.pauseSimulation();
    } else if (this.state.simulationState.status === 'paused') {
      this.unpauseSimulation();
    }
  }

  pauseSimulation() {
    this.state.simulationState.status = 'paused';
    clearTimeout(this.animationFrameId);
    this.controls.setPauseButtonState(true);
    this.controls.showRerunButton();
  }

  unpauseSimulation() {
    this.state.simulationState.status = 'running';
    this.startSimulation();
    this.controls.setPauseButtonState(false);
    this.controls.hideRerunButton();
  }

  stepSimulation() {
    if (this.state.simulationState.status === 'finished') return;
    this.state.simulationState.processNextCycle();
    this.updateUI();
  }

  updateUI() {
    this.dashboard.update(this.state.simulationState);
    this.tableView.update(this.state.simulationState);
    this.graphView.update(this.state.simulationState);
    this.flowDiagram.update(this.state.simulationState);
  }

  switchView(view) {
    this.state.currentView = view;
    const tableViewEl = document.querySelector('.table-view');
    const graphViewEl = document.querySelector('.graph-view');
    const flowDiagramEl = document.getElementById('flow-diagram');

    tableViewEl.style.display = view === 'table' ? 'block' : 'none';
    graphViewEl.style.display = view === 'graph' ? 'block' : 'none';
    flowDiagramEl.style.display = view === 'flow' ? 'block' : 'none';

    // Dynamically adjust table-view height to match graph-view height
    if (view === 'table' || view === 'graph') {
      // Ensure graphViewEl is visible to get its computed height
      const originalGraphViewDisplay = graphViewEl.style.display;
      graphViewEl.style.display = 'block';
      const graphViewHeight = graphViewEl.offsetHeight;
      graphViewEl.style.display = originalGraphViewDisplay; // Restore original display

      tableViewEl.style.height = `${graphViewHeight}px`;
    } else {
      tableViewEl.style.height = ''; // Reset height if not in table or graph view
    }

    document.querySelectorAll('.view-button').forEach(button => {
      button.classList.toggle('active', button.dataset.view === view);
    });

    // If switching to the flow view, force a redraw to ensure correct initial rendering
    if (view === 'flow' && this.state.simulationState) {
      this.flowDiagram.update(this.state.simulationState);
    }
  }

  toggleEducationMode() {
    this.state.educationMode = !this.state.educationMode;
    this.educationMode.toggle(this.state.educationMode);
  }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});