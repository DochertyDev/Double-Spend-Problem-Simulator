# Research: Web App for Double Spend Problem Simulation

## Visualization Libraries

### Decision: D3.js and Chart.js
- **D3.js**: Chosen for its power and flexibility in creating custom, interactive data visualizations. It will be used for the 2D animated SVG flow diagram (FR-010), providing fine-grained control over the animation and visual elements.
- **Chart.js**: Chosen for its simplicity and ease of use for standard charts. It will be used for the graph view (FR-004) to plot the growth of the money supply, as it provides a quick way to generate responsive and good-looking charts.

### Rationale
- Combining these two libraries gives us the best of both worlds: D3.js for complex, custom visualizations and Chart.js for simple, standard charts. This approach allows for rapid development of the graph view while providing the necessary tools for the more complex flow diagram.

### Alternatives Considered
- **p5.js**: A great library for creative coding and animations, but D3.js is more data-centric and better suited for the flow diagram.
- **Google Charts**: A solid option, but Chart.js is more lightweight and has a more modern look and feel.

## Testing Frameworks

### Decision: Jest and Testing Library
- **Jest**: Chosen as the primary JavaScript testing framework. It's an all-in-one solution with a test runner, assertion library, and mocking capabilities. It's well-suited for unit testing the simulation logic.
- **Testing Library**: Chosen for testing UI components. It encourages writing tests that resemble how users interact with the application, which aligns with the project's focus on usability.

### Rationale
- This combination is a standard and robust setup for testing modern web applications. Jest provides a solid foundation for unit tests, while Testing Library ensures that the UI is accessible and functions as expected from a user's perspective.

### Alternatives Considered
- **Mocha/Chai**: A flexible and popular combination, but Jest's all-in-one nature simplifies configuration.
- **Cypress**: An excellent end-to-end testing framework, but for this project, the combination of Jest and Testing Library provides sufficient coverage for unit and integration tests without the overhead of a full E2E testing setup.
