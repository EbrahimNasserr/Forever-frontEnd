# 🛍️ Forever Commerce

A modern full-stack e-commerce platform built with React, Vite, Redux Toolkit, and a scalable REST API architecture. Forever Commerce delivers a seamless online shopping experience with product discovery, advanced filtering, cart management, order processing, customer reviews, authentication, and secure payment integration.

---

## ✨ Overview

Forever Commerce is designed to provide a complete online retail experience for customers while maintaining a clean, scalable, and maintainable frontend architecture.

The application focuses on performance, responsiveness, user experience, and modern development practices.

---

## 🚀 Key Features

### Customer Experience

* Modern responsive UI optimized for desktop, tablet, and mobile devices
* Featured products, latest collections, and promotional sections
* Advanced product browsing and search experience
* Dynamic category and subcategory filtering
* Product sorting by relevance and price
* Product detail pages with images, descriptions, sizes, and colors
* Customer reviews and ratings system
* Wishlist-ready architecture
* Smooth page transitions and animations

### Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Persistent authentication state
* Secure API communication

### Shopping Cart

* Add and remove products
* Quantity management
* Real-time cart calculations
* Persistent cart state
* Checkout preparation flow

### Orders

* Create orders directly from the cart
* Order history tracking
* Order status monitoring
* Shipping and billing address management
* Stripe payment integration support

### Reviews

* Product review system
* Star ratings
* Customer feedback display
* Review moderation support

---

## 🏗️ Tech Stack

### Frontend

* React 19
* Vite
* React Router DOM
* Redux Toolkit
* RTK Query
* React Redux
* Axios

### UI & Styling

* Tailwind CSS
* Framer Motion
* Lucide React
* React Toastify

### Utilities

* date-fns
* ESLint

### Backend Integration

The frontend communicates with a dedicated REST API providing:

* Authentication
* Products
* Categories
* Cart Management
* Orders
* Reviews
* Dashboard Analytics
* Stripe Payments

---

## 📁 Project Structure

```text
src
├── assets
├── components
│   ├── layout
│   ├── share
│   ├── cart
│   ├── checkout
│   └── reviews
│
├── pages
│   ├── Home
│   ├── Collection
│   ├── Product
│   ├── Cart
│   ├── Orders
│   ├── Login
│   ├── Register
│   └── Checkout
│
├── features
│   ├── auth
│   ├── products
│   ├── categories
│   ├── cart
│   ├── orders
│   └── reviews
│
├── store
├── hooks
├── services
├── utils
└── App.jsx
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/forever-commerce.git
```

### Navigate to Project

```bash
cd forever-commerce
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Start Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## 📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Generates an optimized production build.

### Preview Production Build

```bash
npm run preview
```

Locally serves the production build.

### Lint Code

```bash
npm run lint
```

Runs ESLint validation.

---

## 🔐 Environment Variables

| Variable                    | Description          |
| --------------------------- | -------------------- |
| VITE_API_URL                | Backend API base URL |
| VITE_STRIPE_PUBLISHABLE_KEY | Stripe public key    |

---

## 💳 Payments

Forever Commerce supports Stripe Checkout integration for secure online payments.

Supported payment flows:

* Card Payments
* Secure Checkout Session
* Payment Success Handling
* Payment Cancellation Handling
* Order Status Synchronization

---

## 📊 Performance Optimizations

* RTK Query caching
* Lazy-loaded routes
* Optimized API requests
* Component reusability
* Responsive image rendering
* Efficient state management
* Code splitting via Vite

---

## 🔮 Future Enhancements

* Wishlist functionality
* Coupon and discount system
* Product recommendations
* Search suggestions
* Multi-language support
* Dark mode
* User profile management
* Email notifications
* Inventory alerts
* PWA support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ebrahim Nasser**

Frontend Developer specializing in modern React ecosystems, performance optimization, scalable architectures, and immersive user experiences.

Portfolio projects include advanced e-commerce systems, dashboard applications, educational platforms, and interactive web experiences.
