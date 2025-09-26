// Accessibility enhancement functions

export function setupAccessibilityFeatures(container) {
  // Add ARIA labels and roles
  addAriaLabels(container);
  // Setup keyboard navigation
  setupKeyboardNavigation(container);
  // Add high contrast mode toggle
  addHighContrastMode(container);
}

function addAriaLabels(container) {
  // Add ARIA labels to interactive elements
  const controls = container.querySelectorAll('button, input, select');
  controls.forEach(control => {
    if (!control.getAttribute('aria-label')) {
      control.setAttribute('aria-label', control.innerText || control.placeholder || '');
    }
  });

  // Add roles to regions
  const sections = container.querySelectorAll('section');
  sections.forEach(section => {
    if (!section.getAttribute('role')) {
      section.setAttribute('role', 'region');
    }
  });

  // Add descriptions to visualizations
  const charts = container.querySelectorAll('.chart, .graph, .diagram');
  charts.forEach(chart => {
    if (!chart.getAttribute('aria-description')) {
      chart.setAttribute('aria-description', 'Interactive visualization of money creation process');
    }
  });
}

function setupKeyboardNavigation(container) {
  // Add keyboard navigation for interactive elements
  const focusableElements = container.querySelectorAll(
    'button, input, select, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element, index) => {
    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          element.click();
          break;
        case 'Tab':
          if (e.shiftKey && index === 0) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
          } else if (!e.shiftKey && index === focusableElements.length - 1) {
            e.preventDefault();
            focusableElements[0].focus();
          }
          break;
      }
    });
  });
}

function addHighContrastMode(container) {
  // Add high contrast mode toggle
  const toggle = document.createElement('button');
  toggle.innerText = 'Toggle High Contrast';
  toggle.setAttribute('aria-label', 'Toggle high contrast mode');
  toggle.classList.add('high-contrast-toggle');
  
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    toggle.setAttribute('aria-pressed', isHighContrast.toString());
  });

  // Add high contrast styles
  const style = document.createElement('style');
  style.textContent = `
    .high-contrast {
      --primary-color: #000000;
      --background-color: #FFFFFF;
      --text-color: #000000;
      --accent-color: #0000FF;
      --error-color: #FF0000;
    }
    
    .high-contrast .chart text,
    .high-contrast .graph text {
      fill: var(--text-color) !important;
    }
    
    .high-contrast .visualization path,
    .high-contrast .visualization line {
      stroke: var(--primary-color) !important;
      stroke-width: 2px !important;
    }
    
    .high-contrast input,
    .high-contrast button {
      border: 2px solid var(--primary-color) !important;
    }
    
    .high-contrast .tooltip {
      background-color: var(--background-color) !important;
      color: var(--text-color) !important;
      border: 2px solid var(--primary-color) !important;
    }
  `;
  
  document.head.appendChild(style);
  container.insertBefore(toggle, container.firstChild);
}