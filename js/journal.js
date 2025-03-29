/**
 * Journal Service for Meal Nutrition Tracker
 * Handles food journal functionality
 */

class JournalService {
    /**
     * Initialize the journal service
     * @constructor
     * @param {StorageService} storageService - Instance of the storage service
     */
    constructor(storageService) {
        this.storageService = storageService;
        this.currentDate = new Date();
    }

    /**
     * Get the current journal date
     * @returns {Date} - The current journal date
     */
    getCurrentDate() {
        return this.currentDate;
    }

    /**
     * Set the current journal date
     * @param {Date} date - The date to set
     */
    setCurrentDate(date) {
        this.currentDate = date;
    }

    /**
     * Format the current date for display
     * @returns {string} - Formatted date string
     */
    formatCurrentDate() {
        return this.currentDate.toLocaleDateString('en-US', CONFIG.DATE_FORMAT_OPTIONS);
    }

    /**
     * Change the current date
     * @param {string} direction - 'prev' for previous day, 'next' for next day
     * @returns {Date} - The new current date
     */
    changeDate(direction) {
        const newDate = new Date(this.currentDate);
        
        if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
        } else if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        }
        
        this.currentDate = newDate;
        return this.currentDate;
    }

    /**
     * Get the journal data for the current date
     * @returns {Object} - The journal data
     */
    getCurrentJournal() {
        return this.storageService.getJournalByDate(this.currentDate);
    }

    /**
     * Add a meal to the current journal
     * @param {Object} mealData - The meal data to add
     * @param {string} mealType - The meal type (breakfast, lunch, dinner, snacks)
     * @returns {Object} - The updated journal data
     */
    addMealToJournal(mealData, mealType) {
        this.storageService.addMealToJournal(this.currentDate, mealType, mealData);
        return this.getCurrentJournal();
    }

    /**
     * Remove a meal from the current journal
     * @param {string} mealType - The meal type
     * @param {string} mealId - The ID of the meal to remove
     * @returns {Object} - The updated journal data
     */
    removeMealFromJournal(mealType, mealId) {
        this.storageService.removeMealFromJournal(this.currentDate, mealType, mealId);
        return this.getCurrentJournal();
    }

    /**
     * Process meal data from API responses for adding to journal
     * @param {Object} mealDetails - The meal details from the API
     * @param {string} apiSource - The API source
     * @returns {Object} - Processed meal data
     */
    processMealData(mealDetails, apiSource) {
        let processedData = {
            id: null, // Will be assigned by storage service
            apiId: mealDetails.id || null,
            apiSource: apiSource,
            name: mealDetails.name || mealDetails.title || 'Unknown Meal',
            imageUrl: mealDetails.imageUrl || mealDetails.image || null,
            nutrition: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };

        // Process nutrition data
        if (mealDetails.nutrition) {
            processedData.nutrition = {
                calories: mealDetails.nutrition.calories || 0,
                protein: mealDetails.nutrition.protein || 0,
                carbs: mealDetails.nutrition.carbs || 0,
                fat: mealDetails.nutrition.fat || 0
            };
        }

        return processedData;
    }
}