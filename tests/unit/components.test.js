import { fireEvent, getByText, getByLabelText } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Controls } from '../../src/components/Controls';
import { Dashboard } from '../../src/components/Dashboard';
import { TableView } from '../../src/components/TableView';
import { GraphView } from '../../src/components/GraphView';
import { FlowDiagram } from '../../src/components/FlowDiagram';
import { EducationMode } from '../../src/components/EducationMode';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: jest.fn()
}));

// Mock D3.js
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    exit: jest.fn().mockReturnThis()
  }))
}));

describe('Controls Component', () => {
  let container;
  let onSimulationStart;

  beforeEach(() => {
    container = document.createElement('div');
    onSimulationStart = jest.fn();
    new Controls(container, onSimulationStart);
  });

  test('should validate inputs correctly', () => {
    const depositInput = getByLabelText(container, 'Initial Deposit:');
    const ratioInput = getByLabelText(container, 'Reserve Ratio:');
    const runButton = getByText(container, 'Run Simulation');

    fireEvent.change(depositInput, { target: { value: '-100' } });
    expect(depositInput).toHaveClass('invalid');
    expect(runButton).toBeDisabled();

    fireEvent.change(depositInput, { target: { value: '1000' } });
    fireEvent.change(ratioInput, { target: { value: '1.5' } });
    expect(ratioInput).toHaveClass('invalid');
    expect(runButton).toBeDisabled();

    fireEvent.change(ratioInput, { target: { value: '0.1' } });
    expect(runButton).not.toBeDisabled();
  });
});

describe('Dashboard Component', () => {
  let container;
  let dashboard;

  beforeEach(() => {
    container = document.createElement('div');
    dashboard = new Dashboard(container);
  });

  test('should update metrics correctly', () => {
    const simulationState = {
      config: { initialDeposit: 1000 },
      cycles: [{
        cycleNumber: 1,
        totalMoney: 1000,
        deposits: 1000,
        reserves: 100,
        loans: 900
      }]
    };

    dashboard.update(simulationState);

    expect(container.querySelector('#total-money')).toHaveTextContent('$1000.00');
    expect(container.querySelector('#current-cycle')).toHaveTextContent('1');
    expect(container.querySelector('#money-multiplier')).toHaveTextContent('1.00x');
  });
});

describe('TableView Component', () => {
  let container;
  let tableView;

  beforeEach(() => {
    container = document.createElement('div');
    tableView = new TableView(container);
  });

  test('should render simulation data correctly', () => {
    const simulationState = {
      cycles: [{
        cycleNumber: 1,
        deposits: 1000,
        reserves: 100,
        loans: 900,
        totalMoney: 1000
      }]
    };

    tableView.update(simulationState);

    const row = container.querySelector('tbody tr');
    expect(row.children[0]).toHaveTextContent('1');
    expect(row.children[1]).toHaveTextContent('$1000.00');
    expect(row.children[2]).toHaveTextContent('$100.00');
    expect(row.children[3]).toHaveTextContent('$900.00');
    expect(row.children[4]).toHaveTextContent('$1000.00');
  });
});

describe('EducationMode Component', () => {
  let container;
  let educationMode;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = '<span>Reserves</span>';
    educationMode = new EducationMode(container);
  });

  test('should show and hide tooltips', () => {
    educationMode.toggle(true);
    const element = container.querySelector('span');
    
    fireEvent.mouseOver(element);
    const tooltip = container.querySelector('.tooltip');
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent('The portion of deposits that a bank must hold in cash and not lend out.');

    fireEvent.mouseOut(element);
    expect(tooltip).not.toBeVisible();
  });
});

describe('GraphView Component', () => {
  let container;
  let graphView;

  beforeEach(() => {
    container = document.createElement('div');
    graphView = new GraphView(container);
  });

  test('should initialize chart correctly', () => {
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  test('should update chart data correctly', () => {
    const simulationState = {
      cycles: [
        { cycleNumber: 1, totalMoney: 1000 },
        { cycleNumber: 2, totalMoney: 1900 }
      ]
    };

    graphView.update(simulationState);
    const chart = Chart.mock.calls[0][1];
    expect(chart.data.labels).toEqual([1, 2]);
    expect(chart.data.datasets[0].data).toEqual([1000, 1900]);
  });
});

describe('FlowDiagram Component', () => {
  let container;
  let flowDiagram;

  beforeEach(() => {
    container = document.createElement('div');
    flowDiagram = new FlowDiagram(container);
  });

  test('should initialize SVG correctly', () => {
    expect(container.querySelector('svg')).toBeTruthy();
  });

  test('should update diagram with simulation data', () => {
    const simulationState = {
      cycles: [{
        cycleNumber: 1,
        deposits: 1000,
        reserves: 100,
        loans: 900
      }]
    };

    flowDiagram.update(simulationState);
    
    const d3Select = require('d3').select;
    expect(d3Select).toHaveBeenCalled();
    expect(d3Select().selectAll().data).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ value: 1000 }),
        expect.objectContaining({ value: 100 }),
        expect.objectContaining({ value: 900 })
      ])
    );
  });
});