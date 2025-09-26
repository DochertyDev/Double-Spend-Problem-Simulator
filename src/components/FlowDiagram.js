export class FlowDiagram {
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.simulation = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="flow-diagram">
        <h3>Money Flow Diagram</h3>
        <div id="flow-svg-container"></div>
      </div>
    `;

    // Set up the SVG
    const width = 600;
    const height = 400;

    this.svg = d3.select('#flow-svg-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(50,50)');

    // Initial setup of static elements
    this.setupStaticElements();
  }

  setupStaticElements() {
    // Define arrow marker
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('class', 'arrowhead');

    // Add static nodes
    const nodes = [
      { id: 'deposits', label: 'Deposits', x: 100, y: 100 },
      { id: 'reserves', label: 'Reserves', x: 300, y: 50 },
      { id: 'loans', label: 'Loans', x: 300, y: 150 }
    ];

    // Add node circles
    this.svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 30)
      .style('fill', '#fff')
      .style('stroke', '#333');

    // Add node labels
    this.svg.selectAll('.label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d.label);
  }

  update(simulationState) {
    if (!simulationState || simulationState.cycles.length === 0) return;

    const currentCycle = simulationState.cycles[simulationState.cycles.length - 1];
    const totalDeposits = currentCycle.deposits;
    const reserves = currentCycle.reserves;
    const loans = currentCycle.loans;

    // Update flow lines with animations
    this.updateFlowLines(totalDeposits, reserves, loans);
  }

  updateFlowLines(deposits, reserves, loans) {
    // Calculate line paths
    const paths = [
      {
        id: 'deposits-reserves',
        d: 'M100,100 C200,75 200,75 300,50',
        value: reserves
      },
      {
        id: 'deposits-loans',
        d: 'M100,100 C200,125 200,125 300,150',
        value: loans
      }
    ];

    // Update or create flow lines
    paths.forEach(path => {
      const line = this.svg.selectAll(`#${path.id}`).data([path]);

      // Enter
      line.enter()
        .append('path')
        .attr('id', path.id)
        .attr('class', 'flow-line')
        .attr('marker-end', 'url(#arrowhead)')
        .attr('d', d => d.d)
        .style('stroke', '#333')
        .style('fill', 'none');

      // Update
      line
        .transition()
        .duration(500)
        .style('stroke-width', d => Math.log(d.value + 1) * 2);

      // Add or update value labels
      const label = this.svg.selectAll(`#${path.id}-label`).data([path]);

      label.enter()
        .append('text')
        .attr('id', `${path.id}-label`)
        .attr('class', 'flow-label')
        .attr('text-anchor', 'middle')
        .merge(label)
        .attr('x', path.id.includes('reserves') ? 200 : 200)
        .attr('y', path.id.includes('reserves') ? 60 : 140)
        .text(`$${path.value.toFixed(2)}`);
    });
  }
}