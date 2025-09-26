# Double Spend Problem Simulator ‼️💰

An interactive web application that demonstrates the double spend problem in fractional-reserve banking through dynamic visualizations and simulations. This educational tool helps users understand how money creation occurs in the banking system.

## Overview

The Double Spend Problem Simulator illustrates how fractional-reserve banking can lead to money creation, effectively allowing the same money to be "spent twice" through the banking system. Users can experiment with different parameters and observe the effects through various visualizations.

## Features

### 1. Interactive Simulation
- **Customizable Parameters**
  - Set initial deposit amount
  - Adjust reserve ratio (default: 10%)
  - Control simulation speed
  - Step-by-step or continuous playback

### 2. Multiple Visualization Modes
- **Flow Diagram View**
  - Animated visualization of money movement
  - Visual tracking of deposits, reserves, and loans
  - Clear arrows showing money flow direction
- **Table View**
  - Detailed numerical breakdown of each cycle
  - Track deposits, reserves, loans, and total money
- **Graph View**
  - Plot money supply growth over time
  - Interactive data points with precise values
  - Visual comparison of different metrics

### 3. Educational Tools
- **Education Mode**
  - Contextual tooltips explaining key terms
  - "Why This Matters" explanations
  - Visual cues for important concepts
- **Side-by-Side Comparison**
  - Compare different reserve ratios
  - Analyze impact on money creation
  - Synchronized simulation controls

### 4. Real-Time Analytics
- **Key Metrics Dashboard**
  - Starting deposit tracking
  - Total money creation calculation
  - Current reserve ratio display
  - System-wide money supply monitoring

## Technology Stack
- HTML5, CSS3, JavaScript (ES6+)
- D3.js for dynamic visualizations
- Chart.js for graphing
- Jest and Testing Library for testing

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/DochertyDev/Double-Spend-Problem-Simulator.git
```

2. Install dependencies
```bash
npm install
```

3. Run tests (note the tests may fail but step 4. should still work)
```bash
npm test
```

4. Open `index.html` in your browser to start the simulation

## Development

This project follows Test-Driven Development (TDD) principles and maintains high code quality standards. All features are thoroughly tested and documented.

### Project Structure
```
src/
├── components/    # UI components
├── services/     # Core simulation logic
├── styles/       # CSS styling
└── index.html    # Main entry point

tests/
├── integration/  # Integration tests
└── unit/        # Unit tests
```


