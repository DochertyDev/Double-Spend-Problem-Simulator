# Quickstart Guide

This guide provides instructions on how to run the simulation and verify its functionality.

## Running the Simulation

1.  Open the `index.html` file in a web browser.
2.  Enter an initial deposit amount (e.g., 1000).
3.  Enter a reserve ratio (e.g., 0.1 for 10%).
4.  Click the "Run Simulation" button.

## Verifying Functionality

### Acceptance Scenario 1: Basic Simulation
- **Given** a user lands on the simulator page.
- **When** they input an initial deposit of $1,000, set a reserve ratio of 10%, and click "Run Simulation".
- **Then** the system should visually demonstrate the cycle of deposits, loans, and redeposits.
- **And** a dashboard should update to show the total money created.

### Acceptance Scenario 2: View Switching
- **Given** a simulation is in progress.
- **When** the user switches from the "Table View" to the "Graph View".
- **Then** the display should update to show a chart plotting the growth of the money supply without interrupting or resetting the simulation.

### Acceptance Scenario 3: Education Mode
- **Given** "Education Mode" is active.
- **When** the user hovers their mouse over the term "Reserves" in the UI.
- **Then** a tooltip should appear with a simple definition.

### Edge Case: 100% Reserve Ratio
- **When** a user enters a reserve ratio of 100% (1.0).
- **Then** the simulation should show that no new money is created after the initial deposit.
