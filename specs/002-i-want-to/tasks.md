# Tasks: Web App for Double Spend Problem Simulation

**Input**: Design documents from `c:\Users\Sean\Projects\Double-Spend-Problem-Simulator\specs\002-i-want-to\`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

## Phase 3.1: Setup
- [ ] T001 Create project structure: `src/components`, `src/services`, `src/styles`, `tests/unit`, `tests/integration`.
- [ ] T002 Create `index.html` with basic HTML5 boilerplate.
- [ ] T003 [P] Setup project dependencies: Create `package.json` and install D3.js, Chart.js, Jest, and Testing Library.
- [ ] T004 [P] Configure Jest and create `jest.config.js`.

## Phase 3.2: Core Logic & Models (TDD)
- [ ] T005 [P] Create unit test for simulation logic in `tests/unit/simulation.test.js`. Test the `SimulationCycle` and `SimulationState` transitions from `data-model.md`.
- [ ] T006 Implement the core simulation logic in `src/services/simulation.js` based on the data model. Ensure all tests from T005 pass.

## Phase 3.3: UI Components (TDD)
- [ ] T007 [P] Create integration test for the main application component in `tests/integration/app.test.js`. Test user input, simulation run, and view switching.
- [ ] T008 [P] Create the main application component in `src/components/App.js`. This component will manage the overall state.
- [ ] T009 [P] Create the input controls component in `src/components/Controls.js` for initial deposit, reserve ratio, and simulation controls (play, pause, step).
- [ ] T010 [P] Create the dashboard component in `src/components/Dashboard.js` to display key metrics.
- [ ] T011 [P] Create the table view component in `src/components/TableView.js` to display simulation cycles in a table.
- [ ] T012 [P] Create the graph view component in `src/components/GraphView.js` to display the money supply growth using Chart.js.
- [ ] T013 [P] Create the 2D flow diagram component in `src/components/FlowDiagram.js` using D3.js.
- [ ] T014 [P] Create the education mode component in `src/components/EducationMode.js` to provide tooltips.

## Phase 3.4: Integration & Styling
- [ ] T015 Integrate all components into `src/components/App.js` and render in `index.html`.
- [ ] T016 Implement the side-by-side comparison mode.
- [ ] T017 Apply styles from `src/styles/main.css` to all components for a modern and sleek look.

## Phase 3.5: Polish
- [ ] T018 [P] Write unit tests for all UI components to ensure they render correctly and handle user interactions.
- [ ] T019 [P] Add accessibility features (ARIA attributes, keyboard navigation).
- [ ] T020 [P] Final review of the UI and code quality.
- [ ] T021 Run through `quickstart.md` to manually verify all acceptance criteria.

## Dependencies
- T001-T004 must be completed before all other tasks.
- T005 (test) must be completed before T006 (implementation).
- T007 (test) must be completed before T008-T014 (component implementation).
- T015 depends on T008-T014.
- T016-T017 depend on T015.
- T018-T021 are final polish tasks.

## Parallel Example
The following component tasks can be worked on in parallel after the initial setup and core logic are complete:
```
Task: "T009 [P] Create the input controls component..."
Task: "T010 [P] Create the dashboard component..."
Task: "T011 [P] Create the table view component..."
Task: "T012 [P] Create the graph view component..."
Task: "T013 [P] Create the 2D flow diagram component..."
Task: "T014 [P] Create the education mode component..."
```
