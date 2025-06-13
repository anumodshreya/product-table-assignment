Product Catalog Application
This project is a React-based web application for dynamic display and management of product data. It focuses on core frontend skills, including mocked API integration, React Hook-based state management, and a responsive user interface.

Live Demo
View the deployed application here:
https://jocular-kataifi-382491.netlify.app/

Features ✨
Product Listing: Displays product details including Image, Title, Brand, Category, Price, Rating, Return Policy, and MOQ.

Inline Editing: Edit product titles and MOQ values directly within the table, with client-side validation and simulated API updates. ✏️

Dynamic Filtering:

Search by title or brand. 🔍

Dropdown filters for Brand, Category, Price, and Rating, with options dynamically updated based on current results.

Reset Filters button to clear all criteria. 🔄

Column Visibility: Toggle visibility for specific table columns. 👀

Sorting: Sort columns (Price, Rating, MOQ) in ascending or descending order. ↕️

Product Management: Delete existing products and add new ones via a form. 🗑️➕

Pagination: Navigate through product listings efficiently. 📄

User Feedback: Includes clear loading states, error handling for API calls, and a "No results found" message.

Reset Filters Button: A dedicated button to clear all active filters and search queries.

Technologies Used 💻
React.js: Frontend library for UI.

React Hooks: For state and side effects (useState, useEffect).

Vite: Frontend build tool.

JavaScript (ES6+): Application logic.

CSS (Inline Styles): Styling applied directly within React components.

HTML5: Page structure.

Setup Instructions 🚀
To run this project locally:

Clone the Repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name # Replace 'your-repo-name'

(Remember to replace your-username/your-repo-name.git with your actual GitHub repository URL)

Install Dependencies:

npm install
# OR
yarn install

Run the Development Server:

npm run dev
# OR
yarn dev

The application typically opens at http://localhost:5173/.

Mock API (productService.js) 📡
The project uses a mock API service (src/api/productService.js) to simulate data operations:

Fetches initial product data from https://dummyjson.com/products.

Stores data in-memory.

Implements CRUD operations (getAllProducts, updateProductTitle, updateProductMOQ, deleteProduct) using Promises and setTimeout to mimic asynchronous network requests.

Note: Data changes are not persistent across browser refreshes.

Project Structure 📁
.
├── public/                 # Public assets (e.g., index.html)
├── src/
│   ├── api/                # Mock API service (productService.js)
│   ├── components/
│   │   └── ProductTable.jsx # Main UI and logic component
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global CSS styles
├── .gitignore              # Files ignored by Git
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
