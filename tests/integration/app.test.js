import { getByText, getByLabelText, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

// Mock Chart.js and D3.js since we're testing component integration
jest.mock('chart.js');
jest.mock('d3');

describe('App Integration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);
    require('../../src/components/App.js');
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.resetModules();
  });

  test('should render initial UI components', () => {
    expect(getByLabelText(document, 'Initial Deposit:')).toBeInTheDocument();
    expect(getByLabelText(document, 'Reserve Ratio:')).toBeInTheDocument();
    expect(getByText(document, 'Run Simulation')).toBeInTheDocument();
    expect(getByText(document, 'Table View')).toBeInTheDocument();
    expect(getByText(document, 'Graph View')).toBeInTheDocument();
  });

  test('should handle basic simulation flow', () => {
    const depositInput = getByLabelText(document, 'Initial Deposit:');
    const ratioInput = getByLabelText(document, 'Reserve Ratio:');
    const runButton = getByText(document, 'Run Simulation');

    fireEvent.change(depositInput, { target: { value: '1000' } });
    fireEvent.change(ratioInput, { target: { value: '0.1' } });
    fireEvent.click(runButton);

    expect(getByText(document, 'Total Money:')).toHaveTextContent('1000');
    expect(getByText(document, 'Current Cycle:')).toBeInTheDocument();
  });

  test('should switch between views', () => {
    const tableButton = getByText(document, 'Table View');
    const graphButton = getByText(document, 'Graph View');

    fireEvent.click(graphButton);
    expect(document.querySelector('.graph-view')).toBeVisible();
    expect(document.querySelector('.table-view')).not.toBeVisible();

    fireEvent.click(tableButton);
    expect(document.querySelector('.table-view')).toBeVisible();
    expect(document.querySelector('.graph-view')).not.toBeVisible();
  });

  test('should enable education mode', () => {
    const educationToggle = getByText(document, 'Education Mode');
    fireEvent.click(educationToggle);

    const reservesLabel = getByText(document, 'Reserves');
    fireEvent.mouseOver(reservesLabel);

    const tooltip = getByText(document, 'The portion of deposits that a bank must hold in cash and not lend out');
    expect(tooltip).toBeVisible();
  });
});