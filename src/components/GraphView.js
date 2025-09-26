export class GraphView {
  constructor(container) {
    this.container = container;
    this.chart = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="graph-container">
        <canvas id="money-supply-chart"></canvas>
      </div>
    `;
  }

  update(simulationState) {
    if (!simulationState) return;

    const ctx = document.getElementById('money-supply-chart').getContext('2d');
    const cycles = simulationState.cycles;

    const labels = cycles.map(cycle => `Cycle ${cycle.cycleNumber}`);
    const totalMoney = cycles.map(cycle => cycle.totalMoney);
    const deposits = cycles.map(cycle => cycle.deposits);
    const loans = cycles.map(cycle => cycle.loans);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Money',
            data: totalMoney,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Deposits',
            data: deposits,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
          {
            label: 'Loans',
            data: loans,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Money Supply Growth'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount ($)'
            }
          }
        }
      }
    });
  }
}