# Meal Nutrition Tracker

A web application that allows users to track their meal nutrition using data from various food APIs.

## Features

- Search for meals, recipes, and drinks from multiple sources:
  - TheMealDB
  - TheCocktailDB
  - Spoonacular (requires API key)
- View detailed information about meals including ingredients and instructions
- Track daily nutrition intake with a food journal
- Organize meals by breakfast, lunch, dinner, and snacks
- View nutrition statistics over time (weekly, monthly, yearly)
- Set and track progress towards nutrition goals
- Persistent data storage using localStorage

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6+)
- Chart.js for statistics visualization
- Font Awesome for icons
- LocalStorage API for data persistence
- External APIs:
  - TheMealDB API
  - TheCocktailDB API
  - Spoonacular API

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection to access external APIs
- Spoonacular API key (optional, for additional features)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. For full functionality, obtain a Spoonacular API key and add it in the Settings section

## API Keys

- **TheMealDB** and **TheCocktailDB**: Free tier API keys are included and ready to use
- **Spoonacular**: You'll need to [register for a Spoonacular API key](https://spoonacular.com/food-api/console#Dashboard) and add it in the application settings

## Usage

### Searching for Food

1. Navigate to the "Search" tab
2. Select your preferred data source (TheMealDB, TheCocktailDB, or Spoonacular)
3. Enter your search query and press Enter or click the search button
4. Click on a result to view detailed information
5. From the details view, you can add the item to your food journal

### Food Journal

1. Navigate to the "Food Journal" tab
2. Use the date navigation to select a specific date
3. Add meals to your journal by clicking "Add Food" in any meal category
4. View your total nutrition intake for the day
5. Remove items from your journal as needed

### Statistics

1. Navigate to the "Statistics" tab
2. Select your preferred time period (week, month, or year)
3. View charts showing your nutrition intake over time
4. See average daily nutrition values

### Settings

1. Navigate to the "Settings" tab
2. Enter your personal information and nutrition goals
3. Add your Spoonacular API key for additional functionality
4. Save your settings
5. Clear all data if needed (use with caution)

## Project Structure

```
meal-nutrition-tracker/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # Main stylesheet
├── js/
│   ├── config.js        # Configuration and constants
│   ├── api.js           # API service for external data
│   ├── storage.js       # Local storage service
│   ├── ui.js            # UI interaction handling
│   ├── journal.js       # Food journal functionality
│   ├── stats.js         # Statistics and charts
│   └── app.js           # Main application logic
└── README.md            # This documentation file
```

## API Information

### TheMealDB

- Free API with a wide range of meal recipes
- Provides ingredients, instructions, and images
- Does not provide nutrition information

### TheCocktailDB

- Free API with drink recipes
- Provides ingredients, instructions, and images
- Does not provide nutrition information

### Spoonacular

- Comprehensive food API with detailed nutrition information
- Requires an API key
- Provides detailed nutrition breakdown
- Limited number of requests on the free plan

## License

This project is released under the MIT License.

## Acknowledgements

- [TheMealDB](https://www.themealdb.com/) for their free meal database API
- [TheCocktailDB](https://www.thecocktaildb.com/) for their free cocktail database API
- [Spoonacular](https://spoonacular.com/food-api) for their comprehensive food API
- [Chart.js](https://www.chartjs.org/) for the charting library
- [Font Awesome](https://fontawesome.com/) for icons 