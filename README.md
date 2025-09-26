# Double Spend Problem Simulator ‼️💰

An interactive web application that demonstrates the double spend problem in fractional-reserve banking through dynamic visualizations and simulations. This educational tool helps users understand how money creation occurs in the banking system.

## 📖 Overview

The Double Spend Problem Simulator illustrates how fractional-reserve banking can lead to money creation, effectively allowing the same money to be "spent twice" through the banking system. Users can experiment with different parameters and observe the effects through various visualizations.

## ✨ Features

### 🎮 1. Interactive Simulation
- **Customizable Parameters**
  - 💵 Set initial deposit amount
  - 📊 Adjust reserve ratio (default: 10%)
  - ⏱️ Control simulation speed
  - ⏯️ Step-by-step or continuous playback

### 🖼️ 2. Multiple Visualization Modes
- **Flow Diagram View**
  - 🌊 Animated visualization of money movement
  - 👀 Visual tracking of deposits, reserves, and loans
  - ➡️ Clear arrows showing money flow direction
- **Table View**
  - 🔢 Detailed numerical breakdown of each cycle
  - 📉 Track deposits, reserves, loans, and total money
- **Graph View**
  - 📈 Plot money supply growth over time
  - 🖱️ Interactive data points with precise values
  - 🆚 Visual comparison of different metrics

### 🎓 3. Educational Tools
- **Education Mode**
  - ❓ Contextual tooltips explaining key terms
  - 💡 "Why This Matters" explanations
  - 🎨 Visual cues for important concepts
- **Side-by-Side Comparison**
  - ⚖️ Compare different reserve ratios
  - 🧐 Analyze impact on money creation
  - ⚙️ Synchronized simulation controls

### 📈 4. Real-Time Analytics
- **Key Metrics Dashboard**
  - 💰 Starting deposit tracking
  - 💸 Total money creation calculation
  - 📊 Current reserve ratio display
  - 🌐 System-wide money supply monitoring

## 💻 Technology Stack
- HTML5, CSS3, JavaScript (ES6+)
- Vite for development and bundling
- D3.js for dynamic visualizations
- Chart.js for graphing
- Jest and Testing Library for testing

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/DochertyDev/Double-Spend-Problem-Simulator.git
    ```

2.  **Navigate to the project directory**
    ```bash
    cd Double-Spend-Problem-Simulator
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the application**
    Open the URL provided by Vite (usually `http://localhost:5173`) in your browser to start the simulation.

## 🧪 Running Tests

To run the test suite:
```bash
npm test
```

## 🛠️ Development

This project follows Test-Driven Development (TDD) principles and maintains high code quality standards. All features are thoroughly tested and documented.

### 📂 Project Structure
```
.
├── index.html        # Main HTML entry point
├── package.json
└── src/
    ├── main.js       # Application entry script
    ├── components/   # UI components (App, Controls, etc.)
    ├── services/     # Core simulation logic
    └── styles/       # CSS styling
```