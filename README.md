# Double Spend Problem Simulator‼️🏧
This repo contains a webpage with a simple simulator showcasing the double spend problem. This problem occurs (in this example) due to fraction-reserve banking leading to money creation, but there are other cases where the double spend problem can apply.

## Features (in progress)
**1. Customizable Inputs**
- Set the initial deposit amount.
- Define the number of cycles (or run until the balance reaches $0).
- Adjust the fractional-reserve percentage (default: 10%).
- Choose whether 100% of loaned money is spent and redeposited.

**2. Visualization Modes**
- Toggle between multiple views:
    - **3D Flow Diagram** – shows money movement with particle effects and animated arrows (deposits → reserves → loans → redeposits).
    - **Table View** – displays deposits, reserves, loans, and total money at each step.
    - **Graph View** – plots growth of total money and reserves across cycles.

**3. Metrics & Tracking**
- Dashboard displaying key values: starting deposit, money created, and total money.
- Shows the ratio of reserves to total deposits.
- Interactive graphs with hover-over details for exact values.

**4. Comparison & Analysis**
- Side-by-side simulation mode to compare scenarios with different reserve ratios (e.g., 10% vs 20%).
- Optional inflation impact overlay to estimate how money supply growth might correlate with inflation.

**5. Educational Features**
- “Education Mode” with hover tooltips defining key terms (e.g., *reserve = portion banks must hold back*) and context boxes explaining “*Why this matters.*”

**6. Controls & Interactivity**
- Simulation speed control with play/pause and step-through timeline navigation.
- Use of distinct colors to differentiate deposits, reserves, and loans.

## Addititonal Notes
[DoubleSpendProblemSimulator.jsx](https://github.com/DochertyDev/Double-Spend-Problem-Simulator/blob/ffb2032e0c14c872e2456b907ef75019b47e9b3a/DoubleSpendProblemSimulatorUI.jsx) was used as a starting point, but will not remain a key part of the simulators development. The [DoubleSpendProblemSimulator.html](https://github.com/DochertyDev/Double-Spend-Problem-Simulator/blob/ffb2032e0c14c872e2456b907ef75019b47e9b3a/DoubleSpendProblemSimulator.html) is going to be the main project file.

## Background
This is a vibe coding project fueled by my interest in 💵Finance, 📈Economics, and 🖥️Tech! I am not a trained developer and leveraged 🤖AI for the majority of the coding.
