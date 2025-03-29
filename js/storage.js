/**
 * Storage Service for Meal Nutrition Tracker
 * Handles local data storage and retrieval using localStorage
 */

class StorageService {
    /**
     * Initialize the storage service
     * @constructor
     */
    constructor() {
        // Ensure we have initial user settings
        this.initializeSettings();
    }

    /**
     * Initialize default user settings if none exist
     */
    initializeSettings() {
        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.USER_SETTINGS)) {
            localStorage.setItem(
                CONFIG.STORAGE_KEYS.USER_SETTINGS,
                JSON.stringify(CONFIG.DEFAULT_SETTINGS)
            );
        }
    }

    /**
     * Get user settings
     * @returns {Object} - The user settings
     */
    getUserSettings() {
        const settings = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_SETTINGS);
        return JSON.parse(settings);
    }

    /**
     * Save user settings
     * @param {Object} settings - The user settings to save
     */
    saveUserSettings(settings) {
        localStorage.setItem(
            CONFIG.STORAGE_KEYS.USER_SETTINGS,
            JSON.stringify(settings)
        );
    }

    /**
     * Format a date as YYYY-MM-DD for storage keys
     * @param {Date} date - The date to format
     * @returns {string} - Formatted date string
     */
    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Get the journal data for a specific date
     * @param {Date} date - The date to get journal data for
     * @returns {Object} - The journal data for the date
     */
    getJournalByDate(date) {
        const dateKey = this.formatDateKey(date);
        const journalData = localStorage.getItem(CONFIG.STORAGE_KEYS.JOURNAL_DATA);
        
        if (!journalData) {
            return this.createEmptyJournal();
        }

        const allJournals = JSON.parse(journalData);
        return allJournals[dateKey] || this.createEmptyJournal();
    }

    /**
     * Save journal data for a specific date
     * @param {Date} date - The date to save journal data for
     * @param {Object} journalData - The journal data to save
     */
    saveJournalByDate(date, journalData) {
        const dateKey = this.formatDateKey(date);
        const allJournalsString = localStorage.getItem(CONFIG.STORAGE_KEYS.JOURNAL_DATA);
        
        let allJournals = {};
        if (allJournalsString) {
            allJournals = JSON.parse(allJournalsString);
        }
        
        allJournals[dateKey] = journalData;
        
        localStorage.setItem(
            CONFIG.STORAGE_KEYS.JOURNAL_DATA,
            JSON.stringify(allJournals)
        );
    }

    /**
     * Create an empty journal structure
     * @returns {Object} - Empty journal structure
     */
    createEmptyJournal() {
        const journal = {
            totalNutrition: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };
        
        // Add meal categories
        CONFIG.MEAL_CATEGORIES.forEach(category => {
            journal[category] = [];
        });
        
        return journal;
    }

    /**
     * Add a meal to the journal
     * @param {Date} date - The date to add the meal to
     * @param {string} mealType - The meal type (e.g., breakfast, lunch)
     * @param {Object} mealData - The meal data to add
     */
    addMealToJournal(date, mealType, mealData) {
        const journal = this.getJournalByDate(date);
        
        // Add meal to the appropriate category
        if (!journal[mealType]) {
            journal[mealType] = [];
        }
        
        // Add unique ID to the meal for later reference
        mealData.id = this.generateUniqueId();
        journal[mealType].push(mealData);
        
        // Update total nutrition
        this.updateJournalTotals(journal);
        
        // Save journal
        this.saveJournalByDate(date, journal);
    }

    /**
     * Remove a meal from the journal
     * @param {Date} date - The date to remove the meal from
     * @param {string} mealType - The meal type
     * @param {string} mealId - The ID of the meal to remove
     * @returns {boolean} - Whether the meal was successfully removed
     */
    removeMealFromJournal(date, mealType, mealId) {
        const journal = this.getJournalByDate(date);
        
        if (!journal[mealType]) {
            return false;
        }
        
        const initialLength = journal[mealType].length;
        journal[mealType] = journal[mealType].filter(meal => meal.id !== mealId);
        
        if (journal[mealType].length === initialLength) {
            return false; // No meal was removed
        }
        
        // Update total nutrition
        this.updateJournalTotals(journal);
        
        // Save journal
        this.saveJournalByDate(date, journal);
        return true;
    }

    /**
     * Update nutrition totals for a journal
     * @param {Object} journal - The journal to update
     */
    updateJournalTotals(journal) {
        const totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };
        
        // Sum up nutrition from all meal categories
        CONFIG.MEAL_CATEGORIES.forEach(category => {
            if (journal[category]) {
                journal[category].forEach(meal => {
                    if (meal.nutrition) {
                        totals.calories += meal.nutrition.calories || 0;
                        totals.protein += meal.nutrition.protein || 0;
                        totals.carbs += meal.nutrition.carbs || 0;
                        totals.fat += meal.nutrition.fat || 0;
                    }
                });
            }
        });
        
        journal.totalNutrition = totals;
    }

    /**
     * Generate a unique ID for meals
     * @returns {string} - A unique ID
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Get journal data for a range of dates
     * @param {Date} startDate - The start date
     * @param {Date} endDate - The end date
     * @returns {Object} - Journal data for the date range
     */
    getJournalRange(startDate, endDate) {
        const journalData = localStorage.getItem(CONFIG.STORAGE_KEYS.JOURNAL_DATA);
        
        if (!journalData) {
            return {};
        }
        
        const allJournals = JSON.parse(journalData);
        const rangeData = {};
        
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateKey = this.formatDateKey(currentDate);
            if (allJournals[dateKey]) {
                rangeData[dateKey] = allJournals[dateKey];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return rangeData;
    }

    /**
     * Clear all application data
     */
    clearAllData() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.JOURNAL_DATA);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.MEAL_HISTORY);
        
        // Reset settings to defaults
        localStorage.setItem(
            CONFIG.STORAGE_KEYS.USER_SETTINGS,
            JSON.stringify(CONFIG.DEFAULT_SETTINGS)
        );
    }
}