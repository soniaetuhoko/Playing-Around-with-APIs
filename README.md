# Meal Nutrition Tracker
[preview app](https://www.soniadesign.tech)

**[Youtube Video Links]** [Preview app](https://youtu.be/UnqI-7x2faQ)

A web-based application that helps users track their daily meals and nutrition information using the Spoonacular API. This application allows users to search for recipes, view detailed nutritional information, and maintain a food journal.

## Features

- 🔍 Recipe Search: Search through thousands of recipes using Spoonacular API
- 📊 Nutrition Information: Get detailed nutrition facts for any recipe
- 📝 Food Journal: Track daily meals and nutrition intake
- 📈 Statistics: View nutrition trends over time
- 🎯 Goal Setting: Set and track personal nutrition goals
- 📱 Responsive Design: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor for configuration
- Spoonacular API key (get one at [Spoonacular's website](https://spoonacular.com/food-api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/soniaetuhoko/Playing-Around-with-APIs.git
cd meal-nutrition-tracker
```

2. Create a `js/env.js` file and add your Spoonacular API key:
```javascript
const ENV = {
    SPOONACULAR_API_KEY: 'your_api_key_here'
};
```

3. Open `index.html` in your web browser.

### Configuration

1. Set your nutrition goals in the Settings panel
2. Your data will be automatically saved in the browser's local storage

## Project Structure

```
meal-nutrition-tracker/
├── index.html           # Main HTML file
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── env.js          # Environment variables (API keys)
│   ├── config.js       # Application configuration
│   ├── api.js          # API service
│   ├── storage.js      # Local storage service
│   ├── ui.js          # UI handling
│   ├── journal.js      # Food journal functionality
│   ├── stats.js        # Statistics and charts
│   └── app.js         # Main application logic
└── README.md           # This file
```

## Usage

### Searching for Recipes

1. Enter a search term in the main search bar
2. Click the search button or press Enter
3. Browse through the results
4. Click on any recipe to view detailed information

### Managing Your Food Journal

1. Navigate to the Journal section
2. Use the date picker to select a date
3. Add meals to your journal from search results
4. View your daily nutrition totals
5. Remove meals as needed

### Viewing Statistics

1. Go to the Statistics section
2. Select your preferred time period
3. View charts showing your nutrition intake over time

## Security

- The Spoonacular API key is stored in `js/env.js` and should never be committed to version control
- All user data is stored locally in the browser
- No sensitive data is transmitted to external servers except for API requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Built With

- HTML5
- CSS3
- JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) - For statistics visualization
- [Spoonacular API](https://spoonacular.com/food-api) - Food and recipe data
- [Font Awesome](https://fontawesome.com/) - Icons

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Spoonacular API for providing comprehensive food and recipe data
- Chart.js team for the charting library
- Font Awesome for the icons

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Privacy

This application stores all user data locally in your browser. No personal information is collected or transmitted to external servers except for recipe searches through the Spoonacular API. 
