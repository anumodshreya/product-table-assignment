Product Catalog Application
This React-based web application provides a dynamic and interactive interface for managing product data. It showcases key frontend development skills through its features, mock API integration, and user-centric design.

Live Demo ✨
Explore the deployed application here:
https://jocular-kataifi-382491.netlify.app/

Key Features 🚀
Product Display: View a comprehensive list of products with essential details.

Inline Editing: Easily modify product titles and Minimum Order Quantities (MOQ) directly in the table. ✏️

Dynamic Filtering:

Search products by title or brand using the search bar. 🔍

Filter by specific brands, categories, prices, or ratings using intelligent dropdowns that adapt to available data.

One-click "Reset Filters" button to clear all active filters. 🔄

Customizable View: Toggle the visibility of different table columns to personalize your view. 👀

Data Sorting: Sort products by price, rating, or MOQ in ascending or descending order. ↕️

Product Management: Add new products to the list and delete existing ones. ➕🗑️

Pagination: Navigate through large datasets with efficient page controls. 📄

User Feedback: Clear visual indicators for loading states and error messages, plus a "No results found" message when filters yield no data.

Technologies Used 💻
React.js: Primary library for building the user interface.

React Hooks: Utilized for efficient state management (useState, useEffect).

Vite: Fast and lightweight development server and build tool.

JavaScript (ES6+): Core programming language for application logic.

CSS (Inline Styles): All styling implemented directly within React components.

HTML5: Structured content for web pages.

Setup Instructions 🛠️
To get a local copy of this project up and running, follow these steps:

Clone the Repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name # Navigate into your project directory

(Remember to replace your-username/your-repo-name.git with your actual GitHub repository URL.)

Install Dependencies:

npm install
# OR
yarn install

Run the Development Server:

npm run dev
# OR
yarn dev

The application should then open in your browser, typically at http://localhost:5173/.

Mock API (productService.js) 📡
This project uses an in-memory mock API to simulate backend interactions. The src/api/productService.js file:

Fetches initial product data from https://dummyjson.com/products.

Manages subsequent data operations (updates, deletions) in memory.

Simulates network delays using setTimeout for a more realistic user experience.

Note: As this is a mock API, any changes made are not persistent and will reset upon page refresh.

Project Structure 📁
.
├── public/                 # Public assets (e.g., index.html)
├── src/
│   ├── api/                # Mock API service (productService.js)
│   ├── components/
│   │   └── ProductTable.jsx # Main table UI and logic
│   ├── App.jsx             # Root application component
│   ├── main.jsx            # React application entry point
│   └── index.css           # Global styles
├── .gitignore              # Files/folders to be ignored by Git
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite build tool configuration
└── README.md               # This documentation file

