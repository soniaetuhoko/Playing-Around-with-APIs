/**
 * Configuration file for Meal Nutrition Tracker
 * Contains API endpoints, keys, and application settings
 */

const CONFIG = {
    // API Endpoints
    API: {
        THEMEALDB: {
            BASE_URL: 'https://www.themealdb.com/api/json/v1/1/',
            SEARCH_BY_NAME: 'search.php?s=',
            SEARCH_BY_LETTER: 'search.php?f=',
            LOOKUP_BY_ID: 'lookup.php?i=',
            RANDOM: 'random.php',
            CATEGORIES: 'categories.php',
            LIST_CATEGORIES: 'list.php?c=list',
            LIST_AREAS: 'list.php?a=list',
            LIST_INGREDIENTS: 'list.php?i=list',
            FILTER_BY_INGREDIENT: 'filter.php?i=',
            FILTER_BY_CATEGORY: 'filter.php?c=',
            FILTER_BY_AREA: 'filter.php?a='
        },
        THECOCKTAILDB: {
            BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1/',
            SEARCH_BY_NAME: 'search.php?s=',
            SEARCH_BY_LETTER: 'search.php?f=',
            LOOKUP_BY_ID: 'lookup.php?i=',
            RANDOM: 'random.php',
            FILTER_BY_INGREDIENT: 'filter.php?i=',
            FILTER_BY_ALCOHOLIC: 'filter.php?a=',
            FILTER_BY_CATEGORY: 'filter.php?c=',
            FILTER_BY_GLASS: 'filter.php?g=',
            LIST_CATEGORIES: 'list.php?c=list',
            LIST_GLASSES: 'list.php?g=list',
            LIST_INGREDIENTS: 'list.php?i=list',
            LIST_ALCOHOLIC: 'list.php?a=list'
        },
        SPOONACULAR: {
            BASE_URL: 'https://api.spoonacular.com/',
            SEARCH_RECIPES: 'recipes/complexSearch',
            RECIPE_INFO: 'recipes/{id}/information',
            RECIPE_NUTRITION: 'recipes/{id}/nutritionWidget.json',
            SEARCH_INGREDIENTS: 'food/ingredients/search',
            INGREDIENT_INFO: 'food/ingredients/{id}/information',
            SEARCH_PRODUCTS: 'food/products/search',
            PRODUCT_INFO: 'food/products/{id}'
        },
        CALORIENINJAS: {
            BASE_URL: 'https://api.calorieninjas.com/v1/',
            NUTRITION: 'nutrition'
        }
    },
    
    // API Keys loaded from environment variables
    API_KEYS: {
        SPOONACULAR: ENV.SPOONACULAR_API_KEY || '',
        CALORIENINJAS: '' // User needs to provide their own key
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        USER_SETTINGS: 'mealTracker_userSettings',
        JOURNAL_DATA: 'mealTracker_journalData',
        MEAL_HISTORY: 'mealTracker_mealHistory'
    },
    
    // Default User Settings
    DEFAULT_SETTINGS: {
        userName: '',
        userAge: 30,
        userGender: 'male',
        nutritionGoals: {
            calories: 2000,
            protein: 150,
            carbs: 200,
            fat: 65
        }
    },
    
    // Default meal categories
    MEAL_CATEGORIES: ['breakfast', 'lunch', 'dinner', 'snacks'],
    
    // Date format for display
    DATE_FORMAT_OPTIONS: { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }
}; 