/**
 * Main Application Module for Meal Nutrition Tracker
 * This file initializes and coordinates all services
 */

class App {
    constructor() {
        // Initialize services
        this.apiService = new ApiService();
        this.storageService = new StorageService();
        this.uiService = new UiService();
        this.journalService = new JournalService(this.storageService);
        this.statsService = new StatsService(this.storageService);
        this.themeService = new ThemeService();
        
        // Connect UI events to handlers
        this.connectUIEvents();
        
        // Initialize the application state
        this.initializeApp();
    }

    connectUIEvents() {
        this.uiService.triggerSearch = this.handleSearch.bind(this);
        this.uiService.triggerShowDetails = this.handleShowDetails.bind(this);
        this.uiService.triggerModalSearch = this.handleModalSearch.bind(this);
        this.uiService.triggerAddMealToJournal = this.handleAddMealToJournal.bind(this);
        this.uiService.triggerRemoveMeal = this.handleRemoveMeal.bind(this);
        this.uiService.triggerJournalUpdate = this.handleJournalUpdate.bind(this);
        this.uiService.triggerDateChange = this.handleDateChange.bind(this);
        this.uiService.triggerStatsUpdate = this.handleStatsUpdate.bind(this);
        this.uiService.triggerLoadSettings = this.handleLoadSettings.bind(this);
        
        const originalTriggerSaveSettings = this.uiService.triggerSaveSettings;
        this.uiService.triggerSaveSettings = () => {
            const data = originalTriggerSaveSettings.call(this.uiService);
            if (data) {
                this.handleSaveSettings(data.settings, data.spoonacularApiKey);
            }
        };
        
        this.uiService.triggerClearData = this.handleClearData.bind(this);
    }

    initializeApp() {
        console.log('Meal Nutrition Tracker initialized');
        this.handleJournalUpdate();
        this.handleStatsUpdate('day'); // Default to daily view
    }

    async handleSearch(query, apiSource) {
        try {
            const searchResults = await this.apiService.searchByApi(query, apiSource);
            const processedResults = await this.processSearchResults(searchResults, apiSource);
            this.uiService.displaySearchResults(processedResults, apiSource);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error performing search. Please try again.');
        }
    }

    async processSearchResults(results, apiSource) {
        const processed = [];
        
        if (apiSource === 'spoonacular' && results.results) {
            for (const recipe of results.results) {
                const nutrition = {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                };
                
                if (recipe.nutrition && recipe.nutrition.nutrients) {
                    recipe.nutrition.nutrients.forEach(nutrient => {
                        if (nutrient.name === 'Calories') nutrition.calories = nutrient.amount;
                        else if (nutrient.name === 'Protein') nutrition.protein = nutrient.amount;
                        else if (nutrient.name === 'Carbohydrates') nutrition.carbs = nutrient.amount;
                        else if (nutrient.name === 'Fat') nutrition.fat = nutrient.amount;
                    });
                }
                
                processed.push({
                    id: recipe.id,
                    name: recipe.title,
                    imageUrl: recipe.image,
                    category: recipe.dishTypes ? recipe.dishTypes.join(', ') : '',
                    nutrition: nutrition
                });
            }
        }
        
        return processed;
    }

    async handleShowDetails(id, apiSource) {
        try {
            const detailsResponse = await this.apiService.getDetailsByApi(id, apiSource);
            const processedDetails = await this.processDetailsResponse(detailsResponse, apiSource, id);
            this.uiService.displayMealDetails(processedDetails, apiSource);
        } catch (error) {
            console.error('Error fetching details:', error);
            this.showError('Error loading details. Please try again.');
        }
    }

    async processDetailsResponse(response, apiSource, id) {
        if (apiSource === 'spoonacular' && response.details) {
            const recipe = response.details;
            const nutrition = response.nutrition || {};
            
            const nutritionInfo = {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            };
            
            if (nutrition.calories) nutritionInfo.calories = parseFloat(nutrition.calories);
            
            if (nutrition.nutrients) {
                nutrition.nutrients.forEach(nutrient => {
                    if (nutrient.name === 'Protein') nutritionInfo.protein = nutrient.amount;
                    else if (nutrient.name === 'Carbohydrates') nutritionInfo.carbs = nutrient.amount;
                    else if (nutrient.name === 'Fat') nutritionInfo.fat = nutrient.amount;
                });
            }
            
            const ingredients = recipe.extendedIngredients ? recipe.extendedIngredients.map(ingredient => ({
                name: ingredient.name,
                amount: `${ingredient.amount} ${ingredient.unit}`,
                imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
            })) : [];
            
            return {
                id: recipe.id,
                name: recipe.title,
                category: recipe.dishTypes ? recipe.dishTypes.join(', ') : '',
                imageUrl: recipe.image,
                tags: [...(recipe.diets || []), ...(recipe.cuisines || [])],
                instructions: recipe.instructions ? this.stripHtmlTags(recipe.instructions) : 'No instructions available.',
                ingredients: ingredients,
                nutrition: nutritionInfo
            };
        }
        
        return {
            id: id,
            name: 'Unknown Item',
            imageUrl: '',
            instructions: 'No details available.',
            ingredients: [],
            nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
        };
    }

    async handleModalSearch(query, apiSource) {
        try {
            const searchResults = await this.apiService.searchByApi(query, apiSource);
            const processedResults = await this.processSearchResults(searchResults, apiSource);
            
            if (processedResults.length > 0) {
                this.uiService.displayModalMeal(processedResults[0], apiSource);
            } else {
                this.showError('No items found. Please try a different search.');
            }
        } catch (error) {
            console.error('Modal search error:', error);
            this.showError('Error performing search. Please try again.');
        }
    }

    handleAddMealToJournal(meal, mealType, apiSource) {
        if (!meal.nutrition) {
            meal.nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        
        const processedMeal = this.journalService.processMealData(meal, apiSource);
        const updatedJournal = this.journalService.addMealToJournal(processedMeal, mealType);
        
        this.uiService.updateJournalUI(updatedJournal, this.journalService.formatCurrentDate());
        this.showMessage(`${meal.name} added to ${mealType}.`);
        
        // Update stats immediately after adding a meal
        this.handleStatsUpdate('day');
    }

    handleRemoveMeal(mealType, mealId) {
        const updatedJournal = this.journalService.removeMealFromJournal(mealType, mealId);
        this.uiService.updateJournalUI(updatedJournal, this.journalService.formatCurrentDate());
        this.showMessage(`Item removed from ${mealType}.`);
        
        // Update stats immediately after removing a meal
        this.handleStatsUpdate('day');
    }

    handleJournalUpdate() {
        const journal = this.journalService.getCurrentJournal();
        const dateString = this.journalService.formatCurrentDate();
        this.uiService.updateJournalUI(journal, dateString);
    }

    handleDateChange(direction) {
        this.journalService.changeDate(direction);
        this.handleJournalUpdate();
        this.handleStatsUpdate('day'); // Update stats when date changes
    }

    handleStatsUpdate(period = 'day') {
        this.statsService.setPeriod(period);
        const stats = this.statsService.generateStats();
        const chartData = this.statsService.generateCondensedChartData();
        stats.chartData = chartData;
        this.uiService.updateStatsUI(stats, period);
    }

    handleLoadSettings() {
        const settings = this.storageService.getUserSettings();
        
        document.getElementById('userName').value = settings.userName || '';
        document.getElementById('userAge').value = settings.userAge || '';
        document.getElementById('userGender').value = settings.userGender || 'male';
        document.getElementById('calorieGoal').value = settings.nutritionGoals.calories || '';
        document.getElementById('proteinGoal').value = settings.nutritionGoals.protein || '';
        document.getElementById('carbsGoal').value = settings.nutritionGoals.carbs || '';
        document.getElementById('fatGoal').value = settings.nutritionGoals.fat || '';
        
        const apiKeys = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEYS);
        if (apiKeys) {
            const keys = JSON.parse(apiKeys);
            document.getElementById('spoonacularApiKey').value = keys.SPOONACULAR || '';
        }
    }

    handleSaveSettings(settings, spoonacularApiKey) {
        this.storageService.saveUserSettings(settings);
        
        if (spoonacularApiKey) {
            this.apiService.setApiKey('SPOONACULAR', spoonacularApiKey);
        }
        
        this.showMessage('Settings saved successfully.');
    }

    handleClearData() {
        this.storageService.clearAllData();
        this.showMessage('All data has been cleared.');
        this.handleJournalUpdate();
        this.handleStatsUpdate('day');
        this.handleLoadSettings();
    }

    stripHtmlTags(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    showMessage(message) {
        alert(message);
    }

    showError(message) {
        alert(`Error: ${message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});