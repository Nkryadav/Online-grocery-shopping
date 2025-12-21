# FreshMart - Online Grocery Shopping System 🛒

A comprehensive full-stack e-commerce platform for online grocery shopping with advanced features including personalized offers, analytics dashboard, and complete order management. Built with the MERN stack.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing**: Browse products with category filtering and search
- **Shopping Cart**: Real-time cart updates with persistent storage
- **Wishlist**: Save favorite products for later
- **Checkout**: Secure checkout with Razorpay payment integration
- **Order Management**: Track orders with detailed status updates
- **Offers & Coupons**: Apply discount codes at checkout
- **User Profile**: Manage personal information and view order history

### 🔧 Admin Features
- **Product Management**: Full CRUD operations for products with custom categories
- **Order Management**: View and update order status, filter by status
- **Offer Management**: Create and manage discount coupons with validation
- **Analytics Dashboard**: 
  - Sales trends (daily/weekly/monthly)
  - Top selling products
  - Revenue breakdown by offers
  - Summary statistics (revenue, orders, customers, avg order value)

### 🎨 UI/UX Features
- **Modern Design**: Dark theme with glassmorphism effects
- **Responsive**: Fully responsive design for all devices
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for passwords
- **Protected Routes**: Role-based access control
- **Input Validation**: Form validation on client and server

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Payment**: Razorpay integration

### Frontend
- **Library**: React.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Storage**: localStorage for cart persistence

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/grocery-shop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

4. **Seed database with sample data:**
```bash
npm run seed
```

5. **Start development server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment variables (`.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start development server:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 🚀 Usage

### Default Accounts

**Admin Account:**
- Email: `admin@freshmart.com`
- Password: `admin123`

**Customer Account:**
- Email: `john@example.com`
- Password: `password123`

### Sample Offer Codes
- `WEEKEND25` - 25% off on orders above ₹200
- `FIRST100` - Flat ₹100 off on orders above ₹500
- `MEGA30` - 30% off on orders above ₹1000

## 📁 Project Structure

```
Grcoc/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Offer.js              # Offer schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── users.js              # User routes
│   │   ├── products.js           # Product routes
│   │   ├── offers.js             # Offer routes
│   │   ├── orders.js             # Order routes
│   │   ├── reviews.js            # Review routes
│   │   ├── wishlist.js           # Wishlist routes
│   │   └── analytics.js          # Analytics routes
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   ├── seeder.js                 # Database seeder
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios configuration
    │   ├── components/
    │   │   ├── Navbar.js         # Navigation bar
    │   │   ├── Footer.js         # Footer component
    │   │   ├── ProductCard.js    # Product card component
    │   │   └── OfferBanner.js    # Offer banner component
    │   ├── context/
    │   │   ├── AuthContext.js    # Authentication context
    │   │   ├── CartContext.js    # Shopping cart context
    │   │   └── WishlistContext.js # Wishlist context
    │   ├── pages/
    │   │   ├── Home.js           # Home page
    │   │   ├── Products.js       # Products listing
    │   │   ├── Cart.js           # Shopping cart
    │   │   ├── Checkout.js       # Checkout page
    │   │   ├── Login.js          # Login/Register
    │   │   ├── Offers.js         # Offers page
    │   │   ├── MyOrders.js       # User orders
    │   │   ├── Wishlist.js       # Wishlist page
    │   │   ├── Profile.js        # User profile
    │   │   ├── OrderTracking.js  # Order tracking
    │   │   ├── AdminDashboard.js # Admin dashboard
    │   │   ├── AdminProducts.js  # Product management
    │   │   ├── AdminOffers.js    # Offer management
    │   │   ├── AdminOrders.js    # Order management
    │   │   └── AdminAnalytics.js # Analytics dashboard
    │   ├── App.js                # Main app component
    │   ├── index.js              # Entry point
    │   └── index.css             # Global styles
    ├── .env                      # Environment variables
    ├── tailwind.config.js        # Tailwind configuration
    └── package.json
```

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/login` | Login user | No |
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |

### Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/featured` | Get featured products | No |
| GET | `/api/products/on-offer` | Get products on offer | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| GET | `/api/orders/myorders/list` | Get user orders | Yes |
| PUT | `/api/orders/:id/pay` | Update to paid | Yes |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/deliver` | Update to delivered | Admin |
| DELETE | `/api/orders/:id` | Delete order | Admin |

### Offer Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/offers` | Get all offers | No |
| GET | `/api/offers/personalized` | Get personalized offers | Yes |
| POST | `/api/offers/validate` | Validate offer code | Yes |
| POST | `/api/offers` | Create offer | Admin |
| PUT | `/api/offers/:id` | Update offer | Admin |
| DELETE | `/api/offers/:id` | Delete offer | Admin |

### Analytics Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/stats` | Get summary statistics |
| GET | `/api/analytics/sales` | Get sales data (daily/weekly/monthly) |
| GET | `/api/analytics/top-products` | Get top selling products |
| GET | `/api/analytics/offer-revenue` | Get revenue breakdown by offers |

### Wishlist Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist` | Get user wishlist | Yes |
| POST | `/api/wishlist/:productId` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist | Yes |

## 🎯 Key Features in Detail

### 1. Analytics Dashboard
- **Sales Trends**: Visualize sales data with interactive bar charts
- **Time Period Filters**: View data for 7, 30, 90, or 365 days
- **Period Toggle**: Switch between daily, weekly, and monthly views
- **Top Products**: See best-selling products with revenue metrics
- **Offer Performance**: Track revenue and discounts from promotional offers

### 2. Shopping Cart
- Add/remove products with quantity selection
- Real-time price calculations with tax
- Persistent cart using localStorage
- Apply discount codes
- Cart count badge in navbar

### 3. Order Management
- Complete order history for customers
- Order status tracking (Pending, Processing, Shipped, Delivered)
- Delete orders with confirmation
- Admin can update order status
- Filter orders by status

### 4. Offer System
- Percentage and flat discount types
- Minimum purchase requirements
- Maximum discount limits
- Usage limits per offer
- Expiry date validation
- Automatic offer application

### 5. Admin Panel
- Dedicated admin dashboard
- Product CRUD with custom categories
- Order management with status updates
- Offer creation and management
- Analytics and reporting
- No shopping cart/wishlist for admin users

## 🎨 Design Features

- **Dark Theme**: Modern dark mode with gradient accents
- **Glassmorphism**: Frosted glass effects on cards
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adapts to all screen sizes
- **Custom Scrollbar**: Styled scrollbar with gradient
- **Loading States**: Skeleton screens and spinners

## 🔒 Security Measures

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Protected API routes
- Role-based access control (Admin/Customer)
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### User Model
- name, email, password (hashed)
- isAdmin (boolean)
- createdAt, updatedAt

### Product Model
- name, description, price
- category, unit, stock
- image, discount, featured
- ratings, numReviews

### Order Model
- user, orderItems[], shippingAddress
- paymentMethod, paymentResult
- totalPrice, taxPrice, shippingPrice
- isPaid, paidAt, isDelivered, deliveredAt
- status, appliedOffer

### Offer Model
- code, description, discountType
- discountValue, minPurchase, maxDiscount
- validFrom, validUntil, usageLimit, usedCount

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update MongoDB URI to production database
3. Deploy using Git

### Frontend Deployment (Vercel/Netlify)
1. Build production bundle: `npm run build`
2. Set environment variable for API URL
3. Deploy build folder

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- MongoDB for database
- Razorpay for payment integration
- Tailwind CSS for styling
- React team for the amazing library

## 📧 Support

For support, email support@freshmart.com or create an issue in the repository.

---

**Made with ❤️ for academic project**
