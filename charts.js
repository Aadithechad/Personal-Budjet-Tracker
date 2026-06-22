// Charts Module

class ChartManager {
    constructor() {
        this.chart = null;
        this.currentChartType = 'pie';
    }

    // Initialize chart
    initChart(year, month) {
        const categorySpending = transactionManager.getCategoryWiseSpending(year, month);
        
        if (Object.keys(categorySpending).length === 0) {
            const ctx = document.getElementById('expenseChart');
            ctx.parentElement.innerHTML = '<p style="text-align: center; color: #64748b; padding: 40px;">No expense data available for this month</p>';
            return;
        }

        const labels = Object.keys(categorySpending);
        const data = Object.values(categorySpending);
        
        const ctx = document.getElementById('expenseChart');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        if (this.currentChartType === 'pie') {
            this.chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#ef4444',
                            '#f97316',
                            '#eab308',
                            '#22c55e',
                            '#06b6d4',
                            '#3b82f6',
                            '#8b5cf6',
                            '#ec4899'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 13,
                                    family: "system-ui"
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toFixed(2);
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        } else if (this.currentChartType === 'bar') {
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Spending (₹)',
                        data: data,
                        backgroundColor: [
                            '#ef4444',
                            '#f97316',
                            '#eab308',
                            '#22c55e',
                            '#06b6d4',
                            '#3b82f6',
                            '#8b5cf6',
                            '#ec4899'
                        ],
                        borderRadius: 4,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.parsed.y.toFixed(2);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + value.toFixed(0);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Switch chart type
    switchChartType(type) {
        this.currentChartType = type;
        const now = new Date();
        this.initChart(now.getFullYear(), now.getMonth());
    }

    // Get current chart type
    getChartType() {
        return this.currentChartType;
    }
}

// Create global chart manager instance
const chartManager = new ChartManager();
