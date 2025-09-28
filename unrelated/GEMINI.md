## Project Overview

This project is an interactive web application that demonstrates the double-spend problem in fractional-reserve banking. It is built with HTML, CSS, and vanilla JavaScript (ES6+), using Vite for the development server. The visualizations are created with D3.js and Chart.js. The application is tested with Jest and Testing Library.

The core of the application is the `SimulationState` class, which manages the simulation logic. The UI is built with a component-based architecture, with the main `App` component managing the overall layout and state. The application has three main views: a table view, a graph view, and a flow diagram view.

## Building and Running

**Prerequisites:**

*   Node.js (v14 or higher)
*   npm

**Installation:**

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

**Running the Application:**

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open the URL provided by Vite (usually `http://localhost:5173`) in your browser.

**Building for Production:**

To create a production build, run the following command:

```bash
npm run build
```

The production files will be placed in the `dist` directory.

## Testing

NOTE: Do not test unless asked to. I will do the testing.

IF YOU ARE ASKED TO RUN TESTS, to run the test suite, use the following command:

```bash
npm test
```

To run the tests in watch mode, use the following command:

```bash
npm run test:watch
```

## Development Conventions

*   The code is organized into components, services, and styles.
*   The application uses a component-based architecture, with the `App` component as the main entry point.
*   The simulation logic is separated from the UI components and is contained in the `src/services` directory.
*   The UI components are located in the `src/components` directory.
*   The styles are in the `src/styles` directory.
*   The tests are in the `tests` directory, with separate subdirectories for unit and integration tests.

## Additional Instructions

- If any big features changes are made to the project, update the README.md file to reflect the most up-to-date version of the web app