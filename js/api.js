/**
 * API Service for Meal Nutrition Tracker
 * Handles all API requests to the meal and nutrition databases
 */

class ApiService {
    /**
     * Initialize the API service
     * @constructor
     */
    constructor() {
        this.loadApiKeys();
    }

    /**
     * Load API keys from local storage
     */
    loadApiKeys() {
        const storedKeys = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEYS);
        if (storedKeys) {
            const keys = JSON.parse(storedKeys);
            if (keys.SPOONACULAR) {
                CONFIG.API_KEYS.SPOONACULAR = keys.SPOONACULAR;
            }
        }
    }

    /**
     * Set a new API key
     * @param {string} apiName - The name of the API (e.g., 'SPOONACULAR')
     * @param {string} key - The API key
     */
    setApiKey(apiName, key) {
        if (CONFIG.API_KEYS.hasOwnProperty(apiName)) {
            CONFIG.API_KEYS[apiName] = key;
            
            // Store in local storage
            const storedKeys = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEYS) || '{}';
            const keys = JSON.parse(storedKeys);
            keys[apiName] = key;
            localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
            
            return true;
        }
        return false;
    }

    /**
     * Perform a generic API request
     * @async
     * @param {string} url - The URL to fetch
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} - The API response
     */
    async fetchFromApi(url, options = {}) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    /**
     * Search for recipes using Spoonacular API
     * @async
     * @param {string} query - The search query
     * @param {Object} params - Additional search parameters
     * @returns {Promise<Object>} - The search results
     */
    async searchSpoonacularRecipes(query, params = {}) {
        if (!CONFIG.API_KEYS.SPOONACULAR) {
            throw new Error('Spoonacular API key is required. Please set it in the settings.');
        }

        const searchParams = new URLSearchParams({
            apiKey: CONFIG.API_KEYS.SPOONACULAR,
            query: query,
            addRecipeNutrition: true,
            number: 10,
            ...params
        });

        const url = `${CONFIG.API.SPOONACULAR.BASE_URL}${CONFIG.API.SPOONACULAR.SEARCH_RECIPES}?${searchParams.toString()}`;
        return this.fetchFromApi(url);
    }

    /**
     * Get recipe details by ID from Spoonacular
     * @async
     * @param {number} id - The recipe ID
     * @returns {Promise<Object>} - The recipe details
     */
    async getSpoonacularRecipeById(id) {
        if (!CONFIG.API_KEYS.SPOONACULAR) {
            throw new Error('Spoonacular API key is required. Please set it in the settings.');
        }

        const url = `${CONFIG.API.SPOONACULAR.BASE_URL}${CONFIG.API.SPOONACULAR.RECIPE_INFO.replace('{id}', id)}?apiKey=${CONFIG.API_KEYS.SPOONACULAR}`;
        return this.fetchFromApi(url);
    }

    /**
     * Get nutrition information for a recipe from Spoonacular
     * @async
     * @param {number} id - The recipe ID
     * @returns {Promise<Object>} - The recipe nutrition information
     */
    async getSpoonacularRecipeNutrition(id) {
        if (!CONFIG.API_KEYS.SPOONACULAR) {
            throw new Error('Spoonacular API key is required. Please set it in the settings.');
        }

        const url = `${CONFIG.API.SPOONACULAR.BASE_URL}${CONFIG.API.SPOONACULAR.RECIPE_NUTRITION.replace('{id}', id)}?apiKey=${CONFIG.API_KEYS.SPOONACULAR}`;
        return this.fetchFromApi(url);
    }

    /**
     * Search for ingredients using Spoonacular API
     * @async
     * @param {string} query - The search query
     * @param {Object} params - Additional search parameters
     * @returns {Promise<Object>} - The search results
     */
    async searchSpoonacularIngredients(query, params = {}) {
        if (!CONFIG.API_KEYS.SPOONACULAR) {
            throw new Error('Spoonacular API key is required. Please set it in the settings.');
        }

        const searchParams = new URLSearchParams({
            apiKey: CONFIG.API_KEYS.SPOONACULAR,
            query: query,
            ...params
        });

        const url = `${CONFIG.API.SPOONACULAR.BASE_URL}${CONFIG.API.SPOONACULAR.SEARCH_INGREDIENTS}?${searchParams.toString()}`;
        return this.fetchFromApi(url);
    }

    /**
     * Get ingredient information from Spoonacular
     * @async
     * @param {number} id - The ingredient ID
     * @param {Object} params - Additional parameters
     * @returns {Promise<Object>} - The ingredient information
     */
    async getSpoonacularIngredientInfo(id, params = {}) {
        if (!CONFIG.API_KEYS.SPOONACULAR) {
            throw new Error('Spoonacular API key is required. Please set it in the settings.');
        }

        const searchParams = new URLSearchParams({
            apiKey: CONFIG.API_KEYS.SPOONACULAR,
            ...params
        });

        const url = `${CONFIG.API.SPOONACULAR.BASE_URL}${CONFIG.API.SPOONACULAR.INGREDIENT_INFO.replace('{id}', id)}?${searchParams.toString()}`;
        return this.fetchFromApi(url);
    }

    /**
     * Handle API search based on the selected API source
     * @async
     * @param {string} query - The search query
     * @param {string} apiSource - The API source ('themealdb', 'cocktaildb', 'spoonacular')
     * @returns {Promise<Object>} - The search results
     */
    async searchByApi(query, apiSource) {
        switch (apiSource) {
            case 'spoonacular':
                return this.searchSpoonacularRecipes(query, {
                    number: 10,
                    addRecipeNutrition: true
                });
            default:
                throw new Error('Invalid API source specified');
        }
    }

    /**
     * Get details for an item based on the selected API source
     * @async
     * @param {string|number} id - The item ID
     * @param {string} apiSource - The API source ('themealdb', 'cocktaildb', 'spoonacular')
     * @returns {Promise<Object>} - The item details
     */
    async getDetailsByApi(id, apiSource) {
        switch (apiSource) {
            case 'spoonacular':
                const details = await this.getSpoonacularRecipeById(id);
                const nutrition = await this.getSpoonacularRecipeNutrition(id);
                return { details, nutrition };
            default:
                throw new Error('Invalid API source specified');
        }
    }
}