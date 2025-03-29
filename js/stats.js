/**
 * Stats Service for Meal Nutrition Tracker
 * Handles statistical analysis and chart data
 */

class StatsService {
    constructor(storageService) {
        this.storageService = storageService;
        this.currentPeriod = 'week'; // Default to weekly view
        this.nutritionChart = null;
    }

    setPeriod(period) {
        if (['day', 'week', 'month', 'year'].includes(period)) {
            this.currentPeriod = period;
        }
    }

    getDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        
        switch (this.currentPeriod) {
            case 'day':
                // For daily view, show just today
                return { startDate: new Date(endDate), endDate };
            case 'week':
                startDate.setDate(endDate.getDate() - 6);
                break;
            case 'month':
                startDate.setDate(endDate.getDate() - 29);
                break;
            case 'year':
                startDate.setDate(endDate.getDate() - 364);
                break;
        }
        
        return { startDate, endDate };
    }

    generateStats() {
        const { startDate, endDate } = this.getDateRange();
        const journalRange = this.storageService.getJournalRange(startDate, endDate);
        
        const chartData = this.initializeChartData(startDate, endDate);
        let totalDays = 0;
        const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        
        // Process journal data
        for (const [dateKey, dayData] of Object.entries(journalRange)) {
            if (dayData.totalNutrition) {
                const date = new Date(dateKey);
                const index = this.getDateIndex(date, startDate, endDate);
                
                if (index >= 0) {
                    chartData.calories[index] = dayData.totalNutrition.calories || 0;
                    chartData.protein[index] = dayData.totalNutrition.protein || 0;
                    chartData.carbs[index] = dayData.totalNutrition.carbs || 0;
                    chartData.fat[index] = dayData.totalNutrition.fat || 0;
                    
                    totals.calories += dayData.totalNutrition.calories || 0;
                    totals.protein += dayData.totalNutrition.protein || 0;
                    totals.carbs += dayData.totalNutrition.carbs || 0;
                    totals.fat += dayData.totalNutrition.fat || 0;
                    
                    totalDays++;
                }
            }
        }
        
        // For single day, duplicate data to make chart visible
        if (totalDays === 1 && this.currentPeriod === 'day') {
            chartData.labels = ['Today'];
        }
        
        const averages = {
            calories: totalDays > 0 ? Math.round(totals.calories / totalDays) : 0,
            protein: totalDays > 0 ? Math.round(totals.protein / totalDays) : 0,
            carbs: totalDays > 0 ? Math.round(totals.carbs / totalDays) : 0,
            fat: totalDays > 0 ? Math.round(totals.fat / totalDays) : 0
        };
        
        return { chartData, totals, averages, period: this.currentPeriod };
    }

    initializeChartData(startDate, endDate) {
        let dayCount = 1;
        let labels = ['Today'];
        
        if (this.currentPeriod !== 'day') {
            dayCount = this.getDayDifference(startDate, endDate) + 1;
            labels = [];
            
            const currentDate = new Date(startDate);
            for (let i = 0; i < dayCount; i++) {
                labels.push(this.formatDateForChart(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        
        return {
            labels,
            calories: new Array(dayCount).fill(0),
            protein: new Array(dayCount).fill(0),
            carbs: new Array(dayCount).fill(0),
            fat: new Array(dayCount).fill(0)
        };
    }

    getDayDifference(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    formatDateForChart(date) {
        if (this.currentPeriod === 'week') {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (this.currentPeriod === 'month') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short' });
        }
    }

    generateCondensedChartData() {
        const stats = this.generateStats();
        return stats.chartData;
    }

    getDateIndex(date, startDate, endDate) {
        if (date < startDate || date > endDate) return -1;
        return this.getDayDifference(startDate, date);
    }

    renderChart(ctx, chartData) {
        // Destroy previous chart if it exists
        if (this.nutritionChart) {
            this.nutritionChart.destroy();
        }

        const datasets = [
            {
                label: 'Calories',
                data: chartData.calories,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'Protein (g)',
                data: chartData.protein,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'Carbs (g)',
                data: chartData.carbs,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                tension: 0.1
            },
            {
                label: 'Fat (g)',
                data: chartData.fat,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1
            }
        ];

        this.nutritionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Nutrition Intake Over Time'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
}