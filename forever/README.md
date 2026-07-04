# Forever Commerce

Forever Commerce is a modern React and Vite-based e-commerce storefront built for browsing products, managing a cart, placing orders, and tracking the purchase flow.

## Features

- Responsive storefront with a home page, collection pages, and product detail views
- Product browsing with filtering, sorting, and category-based navigation
- Shopping cart experience with a sidebar and checkout flow
- Authentication pages for login and sign-up
- Protected order placement and order history views
- Payment success and cancellation pages
- Toast notifications and smooth UI transitions

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Redux Toolkit and React Redux
- Framer Motion, Lucide React, and React Toastify
- Axios and date-fns
- ESLint and Tailwind CSS

## Getting Started

1. Navigate to the app folder:
   ```bash
   cd forever
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local preview in your browser, usually at:
   ```text
   http://localhost:5173
   ```

## Available Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint checks

## Project Structure

- `src/pages` - route-level pages such as Home, Collection, Cart, and Product
- `src/components` - reusable UI components for the header, footer, cart, reviews, and more
- `src/features` - feature-specific logic, slices, APIs, and helpers
- `src/store` - Redux store configuration and authentication state

## Notes

This project is designed to be run from the app directory. If you are working from the workspace root, make sure to enter the `forever` directory before installing dependencies or launching the app.
