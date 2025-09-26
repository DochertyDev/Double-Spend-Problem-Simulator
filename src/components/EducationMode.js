export class EducationMode {
  constructor(container) {
    this.container = container;
    this.tooltips = {
      'Reserves': 'The portion of deposits that a bank must hold in cash and not lend out.',
      'Initial Deposit': 'The starting amount of money in the banking system.',
      'Reserve Ratio': 'The percentage of deposits that banks must keep as reserves.',
      'Total Money': 'The total amount of money in the system, including both deposits and loans.',
      'Money Multiplier': 'Shows how much the money supply has increased compared to the initial deposit.',
      'Loans': 'Money that banks lend out, which becomes new deposits in the banking system.'
    };
    this.tooltipElement = null;
    this.isEnabled = false;
  }

  toggle(enabled) {
    this.isEnabled = enabled;
    if (enabled) {
      this.attachTooltips();
    } else {
      this.removeTooltips();
    }
  }

  attachTooltips() {
    // Create tooltip element if it doesn't exist
    if (!this.tooltipElement) {
      this.tooltipElement = document.createElement('div');
      this.tooltipElement.className = 'tooltip';
      this.tooltipElement.style.display = 'none';
      this.container.appendChild(this.tooltipElement);
    }

    // Add event listeners to elements with tooltips
    Object.keys(this.tooltips).forEach(term => {
      const elements = this.findElementsWithTerm(term);
      elements.forEach(element => {
        element.classList.add('has-tooltip');
        element.addEventListener('mouseover', (e) => this.showTooltip(e, term));
        element.addEventListener('mouseout', () => this.hideTooltip());
      });
    });
  }

  removeTooltips() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }

    // Remove event listeners and classes
    Object.keys(this.tooltips).forEach(term => {
      const elements = this.findElementsWithTerm(term);
      elements.forEach(element => {
        element.classList.remove('has-tooltip');
        element.removeEventListener('mouseover', this.showTooltip);
        element.removeEventListener('mouseout', this.hideTooltip);
      });
    });
  }

  findElementsWithTerm(term) {
    const elements = [];
    const walker = document.createTreeWalker(
      this.container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          return node.textContent.includes(term) ?
            NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    while (walker.nextNode()) {
      elements.push(walker.currentNode.parentElement);
    }

    return elements;
  }

  showTooltip(event, term) {
    if (!this.isEnabled || !this.tooltipElement) return;

    const tooltip = this.tooltips[term];
    if (!tooltip) return;

    this.tooltipElement.textContent = tooltip;
    this.tooltipElement.style.display = 'block';

    // Position the tooltip near the mouse
    const rect = event.target.getBoundingClientRect();
    this.tooltipElement.style.left = `${event.clientX + 10}px`;
    this.tooltipElement.style.top = `${event.clientY + 10}px`;
  }

  hideTooltip() {
    if (this.tooltipElement) {
      this.tooltipElement.style.display = 'none';
    }
  }
}