/**
 * Theme Service
 * Handles theme switching between light and dark modes
 */

class ThemeService {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.icon = this.themeToggle.querySelector('i');
        
        // Load saved theme preference
        this.loadTheme();
        
        // Add event listener for theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    /**
     * Load the saved theme preference from localStorage
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        this.setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // Update Chart.js theme if it exists
        if (window.chart) {
            this.updateChartTheme();
        }
    }
    
    /**
     * Set the theme of the application
     * @param {string} theme - The theme to set ('light' or 'dark')
     */
    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.icon.classList.remove('fa-moon');
            this.icon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            this.icon.classList.remove('fa-sun');
            this.icon.classList.add('fa-moon');
        }
    }
    
    /**
     * Update Chart.js theme colors
     */
    updateChartTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#ffffff' : '#333333';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        Chart.defaults.color = textColor;
        Chart.defaults.borderColor = gridColor;
        
        // Update existing charts if any
        Object.values(Chart.instances).forEach(chart => {
            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.update();
        });
    }
} 