/**
 * UI Service for Meal Nutrition Tracker
 * Handles UI interactions and DOM manipulations
 */

class UiService {
    /**
     * Initialize the UI service
     * @constructor
     * @param {StatsService} statsService - Instance of the stats service
     */
    constructor(statsService) {
        this.statsService = statsService;
        this.initializeEventListeners();
        this.initializeNavigation();
    }

    /**
     * Initialize event listeners for UI elements
     */
    initializeEventListeners() {
        // Navigation menu
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                const apiSource = document.getElementById('apiSelect').value;
                if (query) {
                    this.triggerSearch(query, apiSource);
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    const apiSource = document.getElementById('apiSelect').value;
                    if (query) {
                        this.triggerSearch(query, apiSource);
                    }
                }
            });
        }

        // Journal date navigation
        const prevDayBtn = document.getElementById('prevDay');
        const nextDayBtn = document.getElementById('nextDay');
        if (prevDayBtn && nextDayBtn) {
            prevDayBtn.addEventListener('click', () => {
                this.triggerDateChange('prev');
            });
            
            nextDayBtn.addEventListener('click', () => {
                this.triggerDateChange('next');
            });
        }

        // Settings form
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.triggerSaveSettings();
            });
        }

        // Clear data
        const clearDataBtn = document.getElementById('clearData');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.showConfirmationModal('clearData', 'Are you sure you want to clear all data? This cannot be undone.');
            });
        }

        // Add meal buttons
        const addMealBtns = document.querySelectorAll('.add-meal-btn');
        addMealBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mealType = e.target.dataset.meal;
                this.showAddMealModal(mealType);
            });
        });

        // Modal close buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // Modal search
        const modalSearchBtn = document.getElementById('modalSearchBtn');
        const modalSearchInput = document.getElementById('modalSearchInput');
        if (modalSearchBtn && modalSearchInput) {
            modalSearchBtn.addEventListener('click', () => {
                const query = modalSearchInput.value.trim();
                const apiSource = document.getElementById('apiSelect').value;
                if (query) {
                    this.triggerModalSearch(query, apiSource);
                }
            });

            modalSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = modalSearchInput.value.trim();
                    const apiSource = document.getElementById('apiSelect').value;
                    if (query) {
                        this.triggerModalSearch(query, apiSource);
                    }
                }
            });
        }

        // Confirmation modal buttons
        const confirmYesBtn = document.getElementById('confirmYes');
        const confirmNoBtn = document.getElementById('confirmNo');
        if (confirmYesBtn && confirmNoBtn) {
            confirmYesBtn.addEventListener('click', () => {
                this.handleConfirmation(true);
            });
            
            confirmNoBtn.addEventListener('click', () => {
                this.handleConfirmation(false);
            });
        }

        // Stats period buttons
        const periodBtns = document.querySelectorAll('.period-btn');
        periodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changePeriod(e.target.dataset.period);
            });
        });
    }

    /**
     * Initialize navigation state
     */
    initializeNavigation() {
        // Show the search section by default
        this.showSection('search');
    }

    /**
     * Handle navigation menu clicks
     * @param {Event} event - The click event
     */
    handleNavigation(event) {
        event.preventDefault();
        const section = event.target.dataset.section;
        this.showSection(section);
    }

    /**
     * Show a specific section and hide others
     * @param {string} sectionId - The ID of the section to show
     */
    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav link
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });

        // Special actions for each section
        if (sectionId === 'journal') {
            this.triggerJournalUpdate();
        } else if (sectionId === 'stats') {
            this.triggerStatsUpdate();
        } else if (sectionId === 'settings') {
            this.loadSettings();
        }
    }

    /**
     * Create an HTML element with specified attributes
     * @param {string} tag - The HTML tag
     * @param {string} className - Optional CSS class
     * @param {string} content - Optional text content or HTML
     * @param {boolean} isHTML - Whether the content should be treated as HTML
     * @returns {HTMLElement} - The created element
     */
    createElement(tag, className = '', content = '', isHTML = false) {
        const element = document.createElement(tag);
        
        if (className) {
            element.className = className;
        }
        
        if (content) {
            if (isHTML) {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }
        }
        
        return element;
    }

    /**
     * Display search results in the UI
     * @param {Array} results - The search results to display
     * @param {string} apiSource - The API source
     */
    displaySearchResults(results, apiSource) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<p>No results found. Try a different search term.</p>';
            return;
        }
        
        results.forEach(item => {
            const card = this.createElement('div', 'meal-card');
            card.dataset.id = item.id;
            card.dataset.api = apiSource;
            
            const img = this.createElement('img');
            img.src = item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
            img.alt = item.name || 'Food item';
            
            const cardContent = this.createElement('div', 'meal-card-content');
            const title = this.createElement('h3', '', item.name);
            
            cardContent.appendChild(title);
            
            // Add nutrition summary if available
            if (item.nutrition) {
                const nutritionText = this.createElement('p', '', 
                    `${Math.round(item.nutrition.calories || 0)} kcal | ` +
                    `Protein: ${Math.round(item.nutrition.protein || 0)}g | ` +
                    `Carbs: ${Math.round(item.nutrition.carbs || 0)}g | ` +
                    `Fat: ${Math.round(item.nutrition.fat || 0)}g`
                );
                cardContent.appendChild(nutritionText);
            }
            
            card.appendChild(img);
            card.appendChild(cardContent);
            
            // Add click handler to show details
            card.addEventListener('click', () => {
                this.triggerShowDetails(item.id, apiSource);
            });
            
            searchResults.appendChild(card);
        });
    }

    /**
     * Display meal details in the UI
     * @param {Object} details - The meal details
     * @param {string} apiSource - The API source
     */
    displayMealDetails(details, apiSource) {
        const mealDetails = document.getElementById('mealDetails');
        mealDetails.innerHTML = '';
        mealDetails.classList.add('show');
        
        // Create the structure for the meal details
        const mealHeader = this.createElement('div', 'meal-header');
        
        // Image section
        const mealImage = this.createElement('div', 'meal-image');
        const img = this.createElement('img');
        img.src = details.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image';
        img.alt = details.name || 'Food item';
        mealImage.appendChild(img);
        
        // Info section
        const mealInfo = this.createElement('div', 'meal-info');
        const title = this.createElement('h2', '', details.name);
        mealInfo.appendChild(title);
        
        // Add tags if available
        if (details.tags && details.tags.length > 0) {
            const tagsContainer = this.createElement('div', 'meal-tags');
            details.tags.forEach(tag => {
                const tagElement = this.createElement('span', 'meal-tag', tag);
                tagsContainer.appendChild(tagElement);
            });
            mealInfo.appendChild(tagsContainer);
        }
        
        // Add nutrition information if available
        if (details.nutrition) {
            const nutritionSection = this.createElement('div', 'meal-nutrition');
            const nutritionTitle = this.createElement('h3', '', 'Nutrition Information');
            const nutritionGrid = this.createElement('div', 'nutrition-grid');
            
            const nutritionItems = [
                { label: 'Calories', value: Math.round(details.nutrition.calories || 0) + ' kcal' },
                { label: 'Protein', value: Math.round(details.nutrition.protein || 0) + 'g' },
                { label: 'Carbs', value: Math.round(details.nutrition.carbs || 0) + 'g' },
                { label: 'Fat', value: Math.round(details.nutrition.fat || 0) + 'g' }
            ];
            
            nutritionItems.forEach(item => {
                const nutritionItem = this.createElement('div', 'nutrition-item');
                const label = this.createElement('h4', '', item.label);
                const value = this.createElement('p', '', item.value);
                nutritionItem.appendChild(label);
                nutritionItem.appendChild(value);
                nutritionGrid.appendChild(nutritionItem);
            });
            
            nutritionSection.appendChild(nutritionTitle);
            nutritionSection.appendChild(nutritionGrid);
            mealInfo.appendChild(nutritionSection);
        }
        
        // Add meal to journal button
        const addToJournalBtn = this.createElement('button', 'primary-btn', 'Add to Journal');
        addToJournalBtn.addEventListener('click', () => {
            this.showAddMealModal('', details, apiSource);
        });
        
        mealInfo.appendChild(addToJournalBtn);
        
        mealHeader.appendChild(mealImage);
        mealHeader.appendChild(mealInfo);
        
        // Content section (ingredients, instructions)
        const mealContent = this.createElement('div', 'meal-content');
        
        // Add ingredients if available
        if (details.ingredients && details.ingredients.length > 0) {
            const ingredientsTitle = this.createElement('h3', '', 'Ingredients');
            const ingredientsList = this.createElement('div', 'ingredients-list');
            
            details.ingredients.forEach(ingredient => {
                const ingredientItem = this.createElement('div', 'ingredient-item');
                
                // Add ingredient image if available
                if (ingredient.imageUrl) {
                    const imgElement = this.createElement('img');
                    imgElement.src = ingredient.imageUrl;
                    imgElement.alt = ingredient.name;
                    ingredientItem.appendChild(imgElement);
                }
                
                const ingredientText = this.createElement('p', '', 
                    `${ingredient.amount || ''} ${ingredient.name}`
                );
                ingredientItem.appendChild(ingredientText);
                
                ingredientsList.appendChild(ingredientItem);
            });
            
            mealContent.appendChild(ingredientsTitle);
            mealContent.appendChild(ingredientsList);
        }
        
        // Add instructions if available
        if (details.instructions) {
            const instructionsTitle = this.createElement('h3', '', 'Instructions');
            const instructionsText = this.createElement('p', '', details.instructions);
            
            mealContent.appendChild(instructionsTitle);
            mealContent.appendChild(instructionsText);
        }
        
        mealDetails.appendChild(mealHeader);
        mealDetails.appendChild(mealContent);
    }

    /**
     * Show the add meal modal
     * @param {string} mealType - Meal type (breakfast, lunch, dinner, snacks)
     * @param {Object} selectedMeal - Pre-selected meal (optional)
     * @param {string} apiSource - API source (optional)
     */
    showAddMealModal(mealType, selectedMeal = null, apiSource = null) {
        console.log(`Showing add meal modal for ${mealType}`);
        const modal = document.getElementById('addMealModal');
        const mealTypeLabel = document.getElementById('mealTypeLabel');
        const modalSearchResults = document.getElementById('modalSearchResults');
        const modalSearchInput = document.getElementById('modalSearchInput');
        
        if (modal && mealTypeLabel) {
            // Clear previous results and search input
            if (modalSearchResults) modalSearchResults.innerHTML = '';
            if (modalSearchInput) modalSearchInput.value = '';
            
            // Set meal type label with proper capitalization
            mealTypeLabel.textContent = mealType.charAt(0).toUpperCase() + mealType.slice(1);
            
            // Show selected meal if provided
            if (selectedMeal && apiSource) {
                this.displayModalMeal(selectedMeal, apiSource);
            }
            
            // Display the modal
            modal.classList.add('show');
            
            // Focus the search input
            if (modalSearchInput) {
                setTimeout(() => modalSearchInput.focus(), 100);
            }
        }
    }

    /**
     * Display a meal in the add meal modal
     * @param {Object} meal - The meal object
     * @param {string} apiSource - The API source
     */
    displayModalMeal(meal, apiSource) {
        console.log('Displaying meal in modal:', meal, 'Source:', apiSource);
        const modalSearchResults = document.getElementById('modalSearchResults');
        if (!modalSearchResults) return;
        
        // Clear previous results
        modalSearchResults.innerHTML = '';
        
        if (!meal) {
            modalSearchResults.innerHTML = '<p>No results found.</p>';
            return;
        }
        
        // Create meal element
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-card';
        
        // Get meal name and image based on API source
        let mealName = meal.name || 'Unknown';
        let mealImage = meal.imageUrl || '';
        let mealId = meal.id || '';
        
        // Format nutrition info
        const calories = meal.nutrition ? Math.round(meal.nutrition.calories || 0) : 0;
        const protein = meal.nutrition ? Math.round(meal.nutrition.protein || 0) : 0;
        const carbs = meal.nutrition ? Math.round(meal.nutrition.carbs || 0) : 0;
        const fat = meal.nutrition ? Math.round(meal.nutrition.fat || 0) : 0;
        
        mealElement.innerHTML = `
            <div class="meal-image">
                <img src="${mealImage}" alt="${mealName}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            </div>
            <div class="meal-card-content">
                <h3>${mealName}</h3>
                <div class="meal-nutrition">
                    <p>Calories: ${calories} | Protein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g</p>
                </div>
                <button class="primary-btn add-to-journal-btn" data-id="${mealId}" data-api="${apiSource}">Add to Journal</button>
            </div>
        `;
        
        // Add event listener to the add to journal button
        const addToJournalBtn = mealElement.querySelector('.add-to-journal-btn');
        if (addToJournalBtn) {
            addToJournalBtn.addEventListener('click', () => {
                const mealTypeLabel = document.getElementById('mealTypeLabel');
                const mealType = mealTypeLabel ? mealTypeLabel.textContent.toLowerCase() : 'breakfast';
                
                this.triggerAddMealToJournal(meal, mealType, apiSource);
                this.closeAllModals();
            });
        }
        
        modalSearchResults.appendChild(mealElement);
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
    }

    /**
     * Show the confirmation modal
     * @param {string} action - The action to confirm
     * @param {string} message - The confirmation message
     */
    showConfirmationModal(action, message) {
        const modal = document.getElementById('confirmationModal');
        modal.dataset.action = action;
        
        const messageElement = document.getElementById('confirmationMessage');
        messageElement.textContent = message;
        
        modal.classList.add('show');
    }

    /**
     * Handle confirmation modal response
     * @param {boolean} confirmed - Whether the action was confirmed
     */
    handleConfirmation(confirmed) {
        const modal = document.getElementById('confirmationModal');
        const action = modal.dataset.action;
        
        if (confirmed) {
            switch (action) {
                case 'clearData':
                    this.triggerClearData();
                    break;
                case 'removeMeal':
                    this.triggerRemoveMeal(modal.dataset.mealType, modal.dataset.mealId);
                    break;
            }
        }
        
        this.closeAllModals();
    }

    /**
     * Load user settings into the settings form
     */
    loadSettings() {
        this.triggerLoadSettings();
    }

    /**
     * Update the journal UI with journal data
     * @param {Object} journalData - The journal data containing meals and nutrition
     * @param {string} dateString - Formatted date string
     */
    updateJournalUI(journalData, dateString) {
        console.log('Updating journal UI with data:', journalData);
        
        // Update date display
        document.getElementById('currentDate').textContent = dateString;
        
        // Update nutrition summary
        const totalCalories = document.getElementById('totalCalories');
        const totalProtein = document.getElementById('totalProtein');
        const totalCarbs = document.getElementById('totalCarbs');
        const totalFat = document.getElementById('totalFat');
        
        if (journalData.totalNutrition) {
            totalCalories.textContent = Math.round(journalData.totalNutrition.calories || 0);
            totalProtein.textContent = Math.round(journalData.totalNutrition.protein || 0) + 'g';
            totalCarbs.textContent = Math.round(journalData.totalNutrition.carbs || 0) + 'g';
            totalFat.textContent = Math.round(journalData.totalNutrition.fat || 0) + 'g';
        } else {
            totalCalories.textContent = '0';
            totalProtein.textContent = '0g';
            totalCarbs.textContent = '0g';
            totalFat.textContent = '0g';
        }
        
        // Update meal categories
        CONFIG.MEAL_CATEGORIES.forEach(category => {
            const mealItems = document.querySelector(`#${category} .meal-items`);
            if (!mealItems) return;
            
            // Clear existing meals
            mealItems.innerHTML = '';
            
            // Add meals for this category
            if (journalData[category] && journalData[category].length > 0) {
                journalData[category].forEach(meal => {
                    const mealItem = this.createMealItem(meal, category);
                    mealItems.appendChild(mealItem);
                });
            }
        });
    }

    /**
     * Create a meal item for the journal
     * @param {Object} meal - The meal data
     * @param {string} category - The meal category
     * @returns {HTMLElement} - The meal item element
     */
    createMealItem(meal, category) {
        console.log('Creating meal item for UI:', meal);
        
        const mealItem = this.createElement('div', 'meal-item');
        mealItem.dataset.id = meal.id;
        
        // Add meal image if available
        const mealImage = this.createElement('img');
        mealImage.src = meal.imageUrl || 'https://via.placeholder.com/40x40?text=Food';
        mealImage.alt = meal.name;
        
        // Add meal info
        const mealInfo = this.createElement('div', 'meal-item-info');
        const mealName = this.createElement('h4', '', meal.name);
        
        // Format nutrition info
        let nutritionText = 'No nutrition data';
        if (meal.nutrition) {
            const calories = Math.round(meal.nutrition.calories || 0);
            const protein = Math.round(meal.nutrition.protein || 0);
            const carbs = Math.round(meal.nutrition.carbs || 0);
            const fat = Math.round(meal.nutrition.fat || 0);
            
            nutritionText = `${calories} kcal | P: ${protein}g | C: ${carbs}g | F: ${fat}g`;
        }
        const nutritionInfo = this.createElement('p', '', nutritionText);
        
        mealInfo.appendChild(mealName);
        mealInfo.appendChild(nutritionInfo);
        
        // Add remove button
        const actionsDiv = this.createElement('div', 'meal-item-actions');
        const removeBtn = document.createElement('button');
        
        // Manually create and append the icon
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        removeBtn.appendChild(trashIcon);
        
        removeBtn.addEventListener('click', () => {
            this.confirmRemoveMeal(category, meal.id);
        });
        
        actionsDiv.appendChild(removeBtn);
        
        // Assemble elements
        mealItem.appendChild(mealImage);
        mealItem.appendChild(mealInfo);
        mealItem.appendChild(actionsDiv);
        
        return mealItem;
    }

    /**
     * Confirm removal of a meal from the journal
     * @param {string} mealType - The meal type
     * @param {string} mealId - The meal ID
     */
    confirmRemoveMeal(mealType, mealId) {
        const modal = document.getElementById('confirmationModal');
        modal.dataset.action = 'removeMeal';
        modal.dataset.mealType = mealType;
        modal.dataset.mealId = mealId;
        
        const messageElement = document.getElementById('confirmationMessage');
        messageElement.textContent = 'Are you sure you want to remove this meal from your journal?';
        
        modal.classList.add('show');
    }

    /**
     * Update the stats UI with statistics data
     * @param {Object} stats - The statistics data
     * @param {string} period - The time period
     */
    updateStatsUI(stats, period) {
        // Update the stats summary
        document.getElementById('avgCalories').textContent = stats.averages.calories;
        document.getElementById('avgProtein').textContent = `${stats.averages.protein}g`;
        document.getElementById('avgCarbs').textContent = `${stats.averages.carbs}g`;
        document.getElementById('avgFat').textContent = `${stats.averages.fat}g`;

        // Update the period buttons
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            }
        });

        // Render the chart
        const ctx = document.getElementById('nutritionChart').getContext('2d');
        this.statsService.renderChart(ctx, stats.chartData);
    }

    /**
     * Change the stats period
     * @param {string} period - The new period
     */
    changePeriod(period) {
        this.triggerStatsUpdate(period);
    }

    // Event trigger methods - These methods will be connected to the app controller

    /**
     * Trigger a search operation
     * @param {string} query - The search query
     * @param {string} apiSource - The API source
     */
    triggerSearch(query, apiSource) {
        // To be implemented in app.js
        console.log('Search triggered:', { query, apiSource });
    }

    /**
     * Trigger showing meal details
     * @param {string|number} id - The meal ID
     * @param {string} apiSource - The API source
     */
    triggerShowDetails(id, apiSource) {
        // To be implemented in app.js
        console.log('Show details triggered:', { id, apiSource });
    }

    /**
     * Trigger modal search
     * @param {string} query - The search query
     * @param {string} apiSource - The API source
     */
    triggerModalSearch(query, apiSource) {
        // To be implemented in app.js
        console.log('Modal search triggered:', { query, apiSource });
    }

    /**
     * Trigger adding a meal to the journal
     * @param {Object} meal - The meal data
     * @param {string} mealType - The meal type
     * @param {string} apiSource - The API source
     */
    triggerAddMealToJournal(meal, mealType, apiSource) {
        // To be implemented in app.js
        console.log('Add meal to journal triggered:', { meal, mealType, apiSource });
    }

    /**
     * Trigger removing a meal from the journal
     * @param {string} mealType - The meal type
     * @param {string} mealId - The meal ID
     */
    triggerRemoveMeal(mealType, mealId) {
        // To be implemented in app.js
        console.log('Remove meal triggered:', { mealType, mealId });
    }

    /**
     * Trigger journal update
     */
    triggerJournalUpdate() {
        // To be implemented in app.js
        console.log('Journal update triggered');
    }

    /**
     * Trigger date change in the journal
     * @param {string} direction - The direction ('prev' or 'next')
     */
    triggerDateChange(direction) {
        // To be implemented in app.js
        console.log('Date change triggered:', direction);
    }

    /**
     * Trigger stats update
     * @param {string} period - The time period
     */
    triggerStatsUpdate(period = 'week') {
        // To be implemented in app.js
        console.log('Stats update triggered:', period);
    }

    /**
     * Trigger loading user settings
     */
    triggerLoadSettings() {
        // To be implemented in app.js
        console.log('Load settings triggered');
    }

    /**
     * Trigger saving user settings
     */
    triggerSaveSettings() {
        const userName = document.getElementById('userName').value;
        const userAge = parseInt(document.getElementById('userAge').value) || 30;
        const userGender = document.getElementById('userGender').value;
        const calorieGoal = parseInt(document.getElementById('calorieGoal').value) || 2000;
        const proteinGoal = parseInt(document.getElementById('proteinGoal').value) || 150;
        const carbsGoal = parseInt(document.getElementById('carbsGoal').value) || 200;
        const fatGoal = parseInt(document.getElementById('fatGoal').value) || 65;
        const spoonacularApiKey = document.getElementById('spoonacularApiKey').value;
        
        const settings = {
            userName,
            userAge,
            userGender,
            nutritionGoals: {
                calories: calorieGoal,
                protein: proteinGoal,
                carbs: carbsGoal,
                fat: fatGoal
            }
        };
        
        // This will be bound to the App.handleSaveSettings method in App.connectUIEvents
        console.log('Settings being saved:', settings);
        console.log('API Key:', spoonacularApiKey);
        
        // Pass all data to the app
        return { settings, spoonacularApiKey };
    }

    /**
     * Trigger clearing all data
     */
    triggerClearData() {
        // To be implemented in app.js
        console.log('Clear data triggered');
    }
}