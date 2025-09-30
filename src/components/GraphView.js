export class GraphView {
  constructor(container) {
    this.container = container;
    this.chart = null;
    this.initialDeposit = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="graph-container">
        <canvas id="money-supply-chart"></canvas>
      </div>
    `;
    this.initChart();
  }

  initChart() {
    const ctx = document.getElementById('money-supply-chart').getContext('2d');

    const createGradient = (color) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color + '80'); // 50% opacity
      gradient.addColorStop(1, color + '00'); // 0% opacity
      return gradient;
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Total Money',
            data: [],
            borderColor: '#8b5cf6',
            backgroundColor: createGradient('#8b5cf6'),
            fill: true,
            tension: 0.1
          },
          {
            label: 'Deposits',
            data: [],
            borderColor: '#00d4ff',
            backgroundColor: createGradient('#00d4ff'),
            fill: true,
            tension: 0.1
          },
          {
            label: 'Loans',
            data: [],
            borderColor: '#ec4899',
            backgroundColor: createGradient('#ec4899'),
            fill: true,
            tension: 0.1
          }
        ]
      },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Money Supply Growth',
                  color: '#1f2937' // Dark text for title
                },
                legend: {
                  labels: {
                    color: '#1f2937' // Dark text for legend
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
                annotation: {
                  annotations: {
                    initialDepositLine: {
                      type: 'line',
                      yMin: 0,
                      yMax: 0,
                      borderColor: '#f59e0b',
                      borderWidth: 2,
                      borderDash: [8, 4],
                      label: {
                        display: true,
                        content: 'Initial Deposit',
                        position: 'end',
                        backgroundColor: 'rgba(245, 158, 11, 0.9)',
                        color: '#ffffff',
                        font: {
                          size: 11,
                          weight: 'bold'
                        },
                        padding: 4,
                        xAdjust: -5
                      }
                    }
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: '#1f2937' // Dark text for x-axis labels
                  },
                  title: {
                    display: true,
                    text: 'Cycle',
                    color: '#1f2937' // Dark text for x-axis title
                  }
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#1f2937', // Dark text for y-axis labels
                    callback: function(value) {
                      return this.formatCurrency(value);
                    }.bind(this)
                  },
                  title: {
                    display: true,
                    text: 'Amount ($)',
                    color: '#1f2937' // Dark text for y-axis title
                  }
                }
              }
            }    });
  }

  formatCurrency(value) {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  }

  update(simulationState) {
    if (!simulationState || !this.chart) return;

    const cycles = simulationState.cycles;
    const labels = cycles.map(cycle => `Cycle ${cycle.cycleNumber}`);
    const totalMoney = cycles.map(cycle => cycle.totalMoney);
    const deposits = cycles.map(cycle => cycle.deposits);
    const loans = cycles.map(cycle => cycle.loans);

    // Update initial deposit value and guide line position
    if (simulationState.config && simulationState.config.initialDeposit !== this.initialDeposit) {
      this.initialDeposit = simulationState.config.initialDeposit;
      this.chart.options.plugins.annotation.annotations.initialDepositLine.yMin = this.initialDeposit;
      this.chart.options.plugins.annotation.annotations.initialDepositLine.yMax = this.initialDeposit;
    }

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = totalMoney;
    this.chart.data.datasets[1].data = deposits;
    this.chart.data.datasets[2].data = loans;
    this.chart.update();
  }
}