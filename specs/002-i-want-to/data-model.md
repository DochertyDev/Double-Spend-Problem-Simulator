# Data Model

This document outlines the data structures used in the Double Spend Problem Simulator.

## Core Entities

### SimulationConfiguration
Represents the user-defined parameters for a simulation run.

| Field | Type | Description | Validation |
|---|---|---|---|
| `initialDeposit` | number | The starting amount of money in the system. | Must be a positive number. |
| `reserveRatio` | number | The percentage of deposits that banks must hold in reserve. | Must be between 0 and 1 (e.g., 0.1 for 10%). |
| `numCycles` | number | The number of cycles the simulation will run for. Can be optional. | Must be a positive integer. |

### SimulationCycle
Represents a single step in the simulation, containing the state of the system at that point.

| Field | Type | Description |
|---|---|---|
| `cycleNumber` | number | The current cycle number (1-based). |
| `deposits` | number | The amount of new deposits in this cycle. |
| `reserves` | number | The portion of deposits held in reserve. |
| `loans` | number | The amount of money loaned out in this cycle. |
| `totalMoney` | number | The cumulative total money created up to this cycle. |

### SimulationState
Represents the overall state of a simulation instance.

| Field | Type | Description |
|---|---|---|
| `config` | SimulationConfiguration | The configuration for the simulation. |
| `cycles` | SimulationCycle[] | An array of all cycles that have been processed. |
| `status` | string | The current status of the simulation (e.g., 'running', 'paused', 'finished'). |
| `comparisonConfig` | SimulationConfiguration | Optional configuration for the second simulation in comparison mode. |
| `comparisonCycles` | SimulationCycle[] | Optional array of cycles for the second simulation. |

## State Transitions

The simulation proceeds from one cycle to the next based on the following logic:

1.  **Start**: The simulation starts with `cycle 1`.
    - `deposits` = `initialDeposit`
    - `reserves` = `deposits` * `reserveRatio`
    - `loans` = `deposits` - `reserves`
    - `totalMoney` = `initialDeposit`
2.  **Next Cycle**: For each subsequent cycle:
    - `deposits` = `loans` from the previous cycle.
    - `reserves` = `deposits` * `reserveRatio`
    - `loans` = `deposits` - `reserves`
    - `totalMoney` = `totalMoney` from the previous cycle + `deposits`.
3.  **End**: The simulation ends when the `loans` amount becomes negligible (e.g., <= $0.01) or the specified `numCycles` is reached.
