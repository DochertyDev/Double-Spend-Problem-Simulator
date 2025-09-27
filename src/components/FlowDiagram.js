import * as d3 from 'd3';

export class FlowDiagram {
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="flow-diagram" style="overflow-x:auto;">
        <h3>Money Flow Diagram</h3>
        <div id="flow-legend" style="float:left; margin-right:20px;"></div>
        <div id="flow-svg-container" data-testid="flow-diagram" style="min-width:900px;"></div>
      </div>
    `;

    // Legend
    this.renderLegend();

    // Set up the SVG
    this.svgWidth = 1800; // Will be updated dynamically in update()
    this.svgHeight = 700;
    this.svg = d3.select('#flow-svg-container')
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    // Arrow marker
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18)
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
    legend.innerHTML = `
      <div style="border:1px solid #ccc; border-radius:16px; padding:12px; width:120px; background:#fff; margin-bottom:10px;">
        <strong>Legend</strong><br><br>
        <div style="margin-bottom:8px;"><span style="display:inline-block;width:24px;height:24px;background:#aaffaa;border-radius:50%;border:2px solid #333;vertical-align:middle;"></span> Earner & Depositor</div>
        <div style="margin-bottom:8px;"><span style="display:inline-block;width:24px;height:24px;background:#ccc;border-radius:12px;border:2px solid #333;vertical-align:middle;"></span> Bank</div>
        <div style="margin-bottom:8px;"><span style="display:inline-block;width:24px;height:24px;background:#ffaaaa;border-radius:50%;border:2px solid #333;vertical-align:middle;"></span> Borrower</div>
        <div style="margin-bottom:8px;"><span style="display:inline-block;width:24px;height:24px;background:#ffdd99;border-radius:8px;border:2px solid #333;vertical-align:middle;"></span> Reserves</div>
      </div>
    `;
  }

  update(simulationState) {
    if (!simulationState || !simulationState.cycles || simulationState.cycles.length === 0) return;

    // Clear previous diagram
    this.svg.selectAll('*:not(defs)').remove();

    // Layout constants
    const cycleWidth = 600; // Width of a single cycle group
    const cycleSpacing = 800; // Horizontal spacing between cycles
    const nodeRadius = 32;
    const nodeY = 220;
    const verticalOffset = 160; // Vertical zig-zag offset for even cycles
    const reserveYOffset = 140;
    const labelYOffset = 85; // Increased padding for labels

    // Responsive scaling
    const totalCycles = simulationState.cycles.length;
    const minWidth = Math.max(900, 100 + totalCycles * cycleSpacing);
    this.svg.attr('width', minWidth);
    this.svg.attr('height', this.svgHeight + (totalCycles > 1 ? verticalOffset : 0)); // Adjust height for zig-zag
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
      this.drawPillLabel((depositorX + bankX) / 2, yMain - 65, `$${cycle.deposits.toFixed(2)} Deposit`, '#fff', '#2e7d32');

      // Reserve arrow (straight)
      this.drawArrow(bankX, yMain, bankX, yReserve);
      this.drawPillLabel(bankX, (yMain + yReserve) / 2, `$${cycle.reserves.toFixed(2)} Reserve`, '#fff', '#f9a825');

      // Loan arrow (curved upwards)
      this.drawCurvedArrow(bankX, yMain, borrowerX, yMain, -70);
      this.drawPillLabel((bankX + borrowerX) / 2, yMain - 65, `$${cycle.loans.toFixed(2)} Loan`, '#fff', '#c62828');

      // Spend arrow (to next depositor, curved downwards)
      if (i < totalCycles - 1) {
        const nextXBase = 60 + (i + 1) * cycleSpacing;
        const nextYBase = nodeY + ((i + 1) % 2 === 0 ? 0 : verticalOffset);
        const nextYMain = nextYBase + 38;
        this.drawCurvedArrow(borrowerX, yMain, nextXBase, nextYMain, 120, true); // Increased curve offset
        this.drawPillLabel((borrowerX + nextXBase) / 2, (yMain + nextYMain) / 2 + 70, `$${cycle.loans.toFixed(2)} Spend`, '#fff', '#1976d2');
      }

      // 3. Nodes (drawn last to be on top of arrows)
      this.drawNode(depositorX, yMain, nodeRadius, '#aaffaa', 'Depositor');
      this.drawNode(bankX, yMain, nodeRadius, '#ccc', 'Bank');
      this.drawNode(borrowerX, yMain, nodeRadius, '#ffaaaa', 'Borrower');
      this.drawNode(bankX, yReserve, nodeRadius, '#ffdd99', 'Reserves', 8);

      // Remove the dotted repeat cycle arrow as it's distracting
    });
  }

  drawCycleContainer(x, y, width, height, cycleNumber) {
    // Background container
    this.svg.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height + 40)
      .attr('rx', 15)
      .attr('fill', '#f9f9f9')
      .attr('stroke', '#e0e0e0');

    // Cycle number label
    this.svg.append('text')
      .attr('x', x + width / 2)
      .attr('y', y + 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 'bold')
      .attr('fill', '#555')
      .text(`Cycle ${cycleNumber}`);
  }

  drawNode(x, y, r, color, label, borderRadius = 38) {
    // Draw node shape
    if (borderRadius === 38) {
      this.svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', r)
        .attr('fill', color)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
    } else {
      this.svg.append('rect')
        .attr('x', x - r)
        .attr('y', y - r / 2)
        .attr('width', r * 2)
        .attr('height', r)
        .attr('rx', borderRadius)
        .attr('fill', color)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
    }
    // Short label on node
    this.svg.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 15)
      .attr('fill', '#333')
      .text(label);
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