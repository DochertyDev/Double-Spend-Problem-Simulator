import { getByText, getByLabelText, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { App } from '../../src/components/App.js';

// Mock Chart.js and D3.js since we're testing component integration
jest.mock('chart.js', () => ({
  Chart: jest.fn(() => ({
    destroy: jest.fn(),
    update: jest.fn()
  }))
}));

jest.mock('d3', () => ({
  select: jest.fn(() => ({
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    exit: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis()
  }))
}));

describe('App Integration', () => {
  let container;
  let app;

  beforeEach(async () => {
    // Setup DOM
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    
    // Create a new app instance
    const app = new App();
    
    // Wait for initialization
    await waitFor(() => {
      expect(container.querySelector('.app-container')).toBeInTheDocument();
      expect(container.querySelector('#controls')).toBeInTheDocument();
      expect(container.querySelector('#dashboard')).toBeInTheDocument();
      expect(container.querySelector('.table-view')).toBeInTheDocument();
      expect(container.querySelector('.graph-view')).toBeInTheDocument();
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('should render initial UI components', () => {
    expect(container.querySelector('input[id="initial-deposit"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="reserve-ratio"]')).toBeInTheDocument();
    expect(container.querySelector('#run-simulation')).toBeInTheDocument();
    expect(container.querySelector('[data-view="table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-view="graph"]')).toBeInTheDocument();
  });

  test('should handle basic simulation flow', async () => {
    const depositInput = container.querySelector('#initial-deposit');
    const ratioInput = container.querySelector('#reserve-ratio');
    const runButton = container.querySelector('#run-simulation');
    
    expect(depositInput).toBeInTheDocument();
    expect(ratioInput).toBeInTheDocument();
    expect(runButton).toBeInTheDocument();

    fireEvent.change(depositInput, { target: { value: '1000' } });
    fireEvent.change(ratioInput, { target: { value: '0.1' } });
    fireEvent.click(runButton);

    await waitFor(() => {
      const totalMoney = container.querySelector('#total-money');
      const currentCycle = container.querySelector('#current-cycle');
      
      expect(totalMoney).toHaveTextContent('$1000.00');
      expect(currentCycle).toBeInTheDocument();
    });
  });

  test('should switch between views', async () => {
    const tableButton = container.querySelector('[data-view="table"]');
    const graphButton = container.querySelector('[data-view="graph"]');
    const tableView = container.querySelector('.table-view');
    const graphView = container.querySelector('.graph-view');

    expect(tableButton).toBeInTheDocument();
    expect(graphButton).toBeInTheDocument();

    fireEvent.click(graphButton);
    await waitFor(() => {
      expect(graphView).toBeVisible();
      expect(tableView).not.toBeVisible();
    });

    fireEvent.click(tableButton);
    await waitFor(() => {
      expect(tableView).toBeVisible();
      expect(graphView).not.toBeVisible();
    });
  });

  test('should enable education mode', async () => {
    const educationToggle = container.querySelector('#education-toggle');
    expect(educationToggle).toBeInTheDocument();
    
    fireEvent.click(educationToggle);

    await waitFor(() => {
      const reservesElement = container.querySelector('.reserves-label');
      expect(reservesElement).toBeInTheDocument();
      
      fireEvent.mouseOver(reservesElement);

      const tooltip = container.querySelector('.tooltip');
      expect(tooltip).toBeVisible();
      expect(tooltip).toHaveTextContent('The portion of deposits that a bank must hold in cash and not lend out');
    });
  });
});