import * as d3 from 'd3';

export class FlowDiagram {
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="flow-diagram-wrapper" style="display: flex; flex-direction: column; align-items: center;">
        <div id="flow-legend"></div>
        <div class="flow-diagram" style="overflow-x:auto; width: 100%;">
          <div id="flow-svg-container" data-testid="flow-diagram" style="min-width:900px;"></div>
        </div>
      </div>
    `;

    // Legend
    this.renderLegend();

    // Set up the SVG
    this.svgWidth = 1800; // Will be updated dynamically in update()
    this.svgHeight = 565; // Initial height, will be dynamically adjusted
    this.svg = d3.select('#flow-svg-container')
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    // Arrow marker
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 45)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#333');
  }

  renderLegend() {
    const legend = document.getElementById('flow-legend');
    const iconSize = 40;
    const iconStyle = `width:${iconSize}px; height:${iconSize}px; vertical-align:middle; margin-right:5px;`;

    const getUserIconSvg = (color) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle} background:${color}; border-radius:8px; border:2px solid #333;">
        <g transform="translate(12,12) scale(0.7) translate(-12,-12)">${this.USER_ICON_PATH}</g>
      </svg>
    `;

    const getBuildingIconSvg = (color) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle} background:${color}; border-radius:8px; border:2px solid #333;">
        <g transform="translate(12,12) scale(0.7) translate(-12,-12)">${this.BUILDING_ICON_PATH}</g>
      </svg>
    `;

    const getLockIconSvg = (color) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${iconStyle} background:${color}; border-radius:8px; border:2px solid #333;">
        <g transform="translate(12,12) scale(0.7) translate(-12,-12)">${this.LOCK_ICON_PATH}</g>
      </svg>
    `;

    legend.innerHTML = `
      <div style="padding:20px 12px; display: flex; flex-direction: column; align-items: center;">
        <div style="text-align: center; margin-bottom: 10px;"><strong>Legend</strong></div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
          <div style="white-space: nowrap;">${getUserIconSvg('#00d4ff')} Earner & Depositor</div>
          <div style="white-space: nowrap;">${getBuildingIconSvg('rgba(18, 18, 38, 1)')} Bank</div>
          <div style="white-space: nowrap;">${getUserIconSvg('#ec4899')} Borrower</div>
          <div style="white-space: nowrap;">${getLockIconSvg('#8b5cf6')} Reserves</div>
        </div>
      </div>
    `;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  update(simulationState) {
    if (!simulationState || !simulationState.cycles || simulationState.cycles.length === 0) return;

    // Clear previous diagram
    this.svg.selectAll('*:not(defs)').remove();

    // Layout constants
    const cycleWidth = 600; // Width of a single cycle group
    const cycleSpacing = 800; // Horizontal spacing between cycles
    const nodeRadius = 32;
    const nodeY = 95;
    const verticalOffset = 220; // Vertical zig-zag offset for even cycles
    const reserveYOffset = 140;
    const labelYOffset = 85; // Increased padding for labels

    // Responsive scaling
    const totalCycles = simulationState.cycles.length;
    const minWidth = Math.max(900, 100 + totalCycles * cycleSpacing);
    this.svg.attr('width', minWidth);

    // Calculate dynamic SVG height based on content
    const currentMaxY = nodeY + (totalCycles > 1 ? verticalOffset : 0) + 38 + reserveYOffset + nodeRadius;
    const calculatedSvgHeight = currentMaxY + 40; // 40px bottom padding

    this.svg.attr('height', calculatedSvgHeight);
    const svgContainer = document.getElementById('flow-svg-container');
    svgContainer.style.minWidth = `${minWidth}px`;

    // Render cycles
    simulationState.cycles.forEach((cycle, i) => {
      const xBase = 100 + i * cycleSpacing;
      const yBase = nodeY + (i % 2 === 0 ? 0 : verticalOffset); // Base Y for the container and calculations

      // Vertically center nodes within the container
      const yMain = yBase + 38;
      const yReserve = yMain + reserveYOffset;

      // 1. Cycle Grouping
      this.drawCycleContainer(xBase - 40, yBase - 70, cycleWidth, 300, i + 1);

      // Node positions
      const depositorX = xBase + 40;
      const bankX = xBase + 260;
      const borrowerX = xBase + 480;

      // 2. Arrows with improved paths
      // Deposit arrow (curved upwards)
      this.drawCurvedArrow(depositorX, yMain, bankX, yMain, -70);
      this.drawPillLabel((depositorX + bankX) / 2, yMain - 65, `Deposit: ${this.formatCurrency(cycle.deposits)}`, '#fff', '#00d4ff');

      // Reserve arrow (straight)
      this.drawArrow(bankX, yMain, bankX, yReserve);
      this.drawPillLabel(bankX, (yMain + yReserve) / 2, `Reserve: ${this.formatCurrency(cycle.reserves)}`, '#fff', '#8b5cf6');

      // Loan arrow (curved upwards)
      this.drawCurvedArrow(bankX, yMain, borrowerX, yMain, -70);
      this.drawPillLabel((bankX + borrowerX) / 2, yMain - 65, `Loan: ${this.formatCurrency(cycle.loans)}`, '#fff', '#ec4899');

      // Spend arrow (to next depositor, curved downwards)
      if (i < totalCycles - 1) {
        const nextXBase = 60 + (i + 1) * cycleSpacing;
        const nextYBase = nodeY + ((i + 1) % 2 === 0 ? 0 : verticalOffset);
        const nextYMain = nextYBase + 38;
        this.drawCurvedArrow(borrowerX, yMain, nextXBase, nextYMain, 120, true); // Increased curve offset
        this.drawPillLabel((borrowerX + nextXBase) / 2, (yMain + nextYMain) / 2 + 70, `Spend: ${this.formatCurrency(cycle.loans)}`, '#fff', '#1976d2');
      }

      // 3. Nodes (drawn last to be on top of arrows)
      this.drawNode(depositorX, yMain, nodeRadius, '#00d4ff', 'Depositor');
      this.drawNode(bankX, yMain, nodeRadius, 'rgba(18, 18, 38, 1)', 'Bank');
      this.drawNode(borrowerX, yMain, nodeRadius, '#ec4899', 'Borrower');
      this.drawNode(bankX, yReserve, nodeRadius, '#8b5cf6', 'Reserves', 8);

      // Remove the dotted repeat cycle arrow as it's distracting
    });

    // Scroll to the latest cycle
    if (totalCycles > 1) {
      const container = this.container.querySelector('.flow-diagram');
      container.scroll({
        left: container.scrollWidth,
        behavior: 'smooth'
      });
    }
  }

  drawCycleContainer(x, y, width, height, cycleNumber) {
    // Background container
    this.svg.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height + 10)
      .attr('rx', 15)
      .attr('fill', 'transparent')
      .attr('stroke', '#e0e0e0');

    // Cycle number label
    this.svg.append('text')
      .attr('x', x + width / 2)
      .attr('y', y + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', 20)
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text(`Cycle ${cycleNumber}`);
  }

  // SVG Path data for Lucide icons
  // Extracted from https://github.com/lucide-icons/lucide/tree/main/icons
  USER_ICON_PATH = '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />';
  BUILDING_ICON_PATH = '<path d="M6 22V7H2v15"/><path d="M18 22V7h4v15"/><path d="M10 12H7"/><path d="M10 16H7"/><path d="M10 8H7"/><path d="M10 20H7"/><path d="M14 12H11"/><path d="M14 16H11"/><path d="M14 8H11"/><path d="M14 20H11"/><path d="M17 12h-3"/><path d="M17 16h-3"/><path d="M17 8h-3"/><path d="M17 20h-3"/><path d="M22 7V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"/>';
  LOCK_ICON_PATH = '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';

  // Mapping of node labels to icon paths
  iconPaths = {
    'Depositor': this.USER_ICON_PATH,
    'Bank': this.BUILDING_ICON_PATH,
    'Borrower': this.USER_ICON_PATH,
    'Reserves': this.LOCK_ICON_PATH
  };

  drawIntegratedIconNode(x, y, iconPath, color, label, nodeType, nodeRadius = 32, iconSize = 24) {
    const group = this.svg.append('g')
      .attr('transform', `translate(${x}, ${y})`);

    const totalNodeHeight = nodeRadius * 2.5; // Increased height to accommodate icon and label
    const totalNodeWidth = nodeRadius * 2.5; // Increased width

    // Background shape
    group.append('rect')
      .attr('x', -totalNodeWidth / 2)
      .attr('y', -totalNodeHeight / 2)
      .attr('width', totalNodeWidth)
      .attr('height', totalNodeHeight)
      .attr('rx', 8) // Rounded corners for all nodes
      .attr('fill', color)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Icon positioning and scaling
    const iconScale = (nodeRadius * 2 * 0.6) / iconSize; // Icon takes 60% of original node diameter
    const fontSize = 13; // Assuming font size is 13 as per the text element below

    // Calculate the half height of the icon's visual representation
    const iconVisualHalfHeight = (nodeRadius * 2 * 0.6) / 2;
    // Calculate the half height of the label's visual representation
    const labelVisualHalfHeight = fontSize / 2;

    // Calculate the shift needed to vertically center the combined icon and label block
    // The current midpoint of the combined visual block is (-iconVisualHalfHeight + labelVisualHalfHeight) / 2
    // To move this midpoint to 0, we need to add the negative of this value as a shift.
    const verticalShift = (iconVisualHalfHeight - labelVisualHalfHeight) / 2;

    const iconYOffset = -totalNodeHeight / 5 + verticalShift; // Adjust icon position

    group.append('g')
      .attr('transform', `translate(0, ${iconYOffset}) scale(${iconScale}) translate(${-iconSize / 2}, ${-iconSize / 2})`)
      .html(iconPath)
      .selectAll('path, rect, circle')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 3);

    // Label positioning
    const labelYOffset = totalNodeHeight / 5 + verticalShift; // Adjust label position

    group.append('text')
      .attr('y', labelYOffset)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 13) // Reduced font size by 2 pixels
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text(label);
  }

  drawNode(x, y, r, color, label) {
    const iconPath = this.iconPaths[label];
    if (iconPath) {
      this.drawIntegratedIconNode(x, y, iconPath, color, label, label, r);
    } else {
      // Fallback to original drawing if no icon is found (should not happen with current labels)
      if (label === 'Reserves') {
        this.svg.append('rect')
          .attr('x', x - r)
          .attr('y', y - r / 2)
          .attr('width', r * 2)
          .attr('height', r)
          .attr('rx', 8)
          .attr('fill', color)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
      } else {
        this.svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', r)
          .attr('fill', color)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
      }
      this.svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 15)
        .attr('fill', '#333')
        .text(label);
    }
  }

  drawArrow(x1, y1, x2, y2, dotted = false) {
    this.svg.append('line')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('stroke-dasharray', dotted ? '6,6' : null);
  }

  // Curved arrow for horizontal connections
  drawCurvedArrow(x1, y1, x2, y2, curveOffset = -30, dotted = false) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const curveY = midY + curveOffset; // Positive for downward, negative for upward

    this.svg.append('path')
      .attr('d', `M${x1},${y1} Q${midX},${curveY} ${x2},${y2}`)
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('stroke-dasharray', dotted ? '6,6' : null);
  }

  drawLabel(x, y, text, color = '#333', fontSize = 13, italic = false) {
    this.svg.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('font-size', fontSize)
      .attr('fill', color)
      .attr('font-style', italic ? 'italic' : 'normal')
      .text(text);
  }

  drawPillLabel(x, y, text, color, backgroundColor) {
    const group = this.svg.append('g')
      .attr('transform', `translate(${x}, ${y})`);

    const textElement = group.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 12)
      .attr('fill', color)
      .text(text);

    const bbox = textElement.node().getBBox();
    const padding = { x: 12, y: 6 };

    group.insert('rect', 'text')
      .attr('x', bbox.x - padding.x)
      .attr('y', bbox.y - padding.y)
      .attr('width', bbox.width + 2 * padding.x)
      .attr('height', bbox.height + 2 * padding.y)
      .attr('rx', (bbox.height + 2 * padding.y) / 2)
      .attr('fill', backgroundColor);
  }
}