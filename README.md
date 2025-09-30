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

### 📈 4. Real-Time Analytics
- **Key Metrics Dashboard**
  - 💰 Starting deposit tracking
  - 💸 Total money creation calculation
  - 🌐 System-wide money supply monitoring

## 💻 Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Development Server:** Vite
- **Visualizations:** D3.js, Chart.js
- **Testing:** Jest, Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DochertyDev/Double-Spend-Problem-Simulator.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Double-Spend-Problem-Simulator
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application
1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open in your browser:**
    Open the URL provided by Vite (usually `http://localhost:5173`) to start the simulation.

## 🧪 Running Tests

To run the test suite, use the following command:
```bash
npm test
```
You can also run tests in watch mode:
```bash
npm run test:watch
```

## 🛠️ Development

This project follows Test-Driven Development (TDD) principles. All new features should be accompanied by corresponding tests.

### 📂 Project Structure
```
.
├── index.html        # Main HTML entry point
├── package.json      # Project metadata and dependencies
├── jest.config.js    # Jest test runner configuration
├── .babelrc          # Babel configuration for Jest
├── src/
│   ├── main.js       # Application entry script
│   ├── components/   # UI components
│   ├── services/     # Core simulation logic
│   └── styles/       # CSS styling
└── tests/
    ├── unit/         # Unit tests
    └── integration/  # Integration tests
```