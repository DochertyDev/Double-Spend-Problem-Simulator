export class EducationMode {
  constructor(container) {
    this.container = container;
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tooltip';
    this.tooltipElement.style.display = 'none';
    document.body.appendChild(this.tooltipElement);
    this.tooltips = {
      'Reserves': '### Definition\nThe portion of deposits that a bank must hold in cash and not lend out.\n\n---\n### Why It Matters\nReserves limit how much money banks can create through lending, directly controlling the extent of the double spend effect.',
      'Initial Deposit': '### Definition\nThe starting amount of money in the banking system.\n\n---\n### Why It Matters\nThis single deposit gets multiplied throughout the system, demonstrating how one dollar can support multiple dollars of purchasing power.',
      'Reserve Ratio': '### Definition\nThe percentage of deposits that banks must keep as reserves.\n\n---\n### Why It Matters\nA lower reserve ratio means more lending and greater money multiplication, amplifying the double spend problem.',
      'Total Money': '### Definition\nThe total amount of money in the system, including both deposits and loans.\n\n---\n### Why It Matters\nThis reveals the cumulative effect of fractional-reserve banking, showing how much more money exists than was originally deposited.',
      'Money Multiplier': '### Definition\nShows how much the money supply has increased compared to the initial deposit.\n\n---\n### Why It Matters\nThis multiplier effect is the mathematical proof of the double spend problem, quantifying how fractional-reserve banking creates money.',
      'Loans': '### Definition\nMoney that banks lend out, which becomes new deposits in the banking system.\n\n---\n### Why It Matters\nLoans are where the double spend occurs—the original depositor can still access their money while borrowers spend the loaned amount simultaneously.',
      'Money Created': '### Definition\nThe additional money that has been generated in the banking system beyond the initial deposit through fractional-reserve lending.\n\n---\n### Why It Matters\nThis is the direct measurement of the double spend effect—it shows exactly how many new dollars of purchasing power were created from the original deposit.',
      'Current Cycle': '### Definition\nThe number of times money has been deposited, loaned out, and re-deposited in the banking system.\n\n---\n### Why It Matters\nEach cycle demonstrates another round of money creation, showing how the double spend effect compounds through multiple iterations of lending.'
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
      this.tooltipElement.style.display = 'none';
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

    this.tooltipElement.innerHTML = this.formatTooltip(tooltip);
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

  formatTooltip(text) {
    // Convert the formatted text with line breaks and headings to HTML
    return text
      .replace(/---/g, '<hr class="tooltip-divider">')
      .replace(/### (.*?)\n/g, '<div class="tooltip-heading">$1</div>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
}