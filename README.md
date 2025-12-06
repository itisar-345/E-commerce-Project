# E-Commerce Platform

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple?style=for-the-badge&logo=php)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A full-stack e-commerce platform with **two complete implementations**: a modern **Spring Boot + React** version and a traditional **PHP** version. Both feature multi-role functionality for customers and vendors with product management, shopping cart, wishlist, and order processing.

---

## 📦 Two Complete Implementations

### 🟢 Spring Boot + React (Modern)
**Location**: `spring-ecommerce/`

Modern full-stack application with RESTful API, JWT authentication, caching, pagination, and responsive UI.

**Tech Stack**:
- Backend: Spring Boot 3.2.0, Java 17, Spring Security, JPA/Hibernate
- Frontend: React 18.2.0, TypeScript 5.8.3, Vite 7.1.2, Tailwind CSS 3.4.0
- Database: MySQL 8.0 with normalized schema
- Auth: JWT tokens (HS256, 24hr expiration)
- Caching: Caffeine (10-min TTL)
- Features: Wishlist, Cart with size/quantity, Pagination

### 🔵 PHP Implementation (Traditional)
**Location**: `e-commerce/`

Traditional server-side rendered application with session-based authentication.

**Tech Stack**:
- Backend: PHP 7.4+
- Frontend: HTML5, CSS3, JavaScript
- Database: MySQL 8.0
- Auth: Session-based
- Deployment: XAMPP, WAMP, cPanel, any PHP hosting

---

## ✨ Key Features

### Spring Boot + React Version
- **Authentication**: JWT-based with role-based access control (CUSTOMER/VENDOR)
- **Product Management**: Full CRUD operations with image upload (vendors only)
- **Shopping Cart**: Add/update/remove items with size and quantity selection
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders (COD), track status, view history
- **Caching**: Caffeine cache for product queries (10-min TTL, 80% hit ratio)
- **Pagination**: Configurable page size and sorting
- **Responsive UI**: Tailwind CSS with mobile-first design
- **Security**: BCrypt password hashing, method-level security

### PHP Version
- **Authentication**: Session-based with role management
- **Product Management**: Vendor product upload, edit, delete
- **Shopping Cart**: Add to cart, view cart, checkout
- **Order Processing**: Place orders, view order history
- **Order Management**: Vendors can update order status
- **Simple Setup**: Works on any PHP hosting (XAMPP, WAMP, cPanel)

---

## 🚀 Implementation 1: Spring Boot + React

**Directory**: `spring-ecommerce/`

### Architecture Overview
- **Pattern**: MVC with RESTful API
- **Backend**: Spring Boot 3.2.0, Java 17, Spring Security, JPA/Hibernate
- **Frontend**: React 18.2.0, TypeScript 5.8.3, Vite 7.1.2
- **Database**: MySQL 8.0 with normalized schema
- **Authentication**: JWT (HS256, 24hr expiration)
- **Caching**: Caffeine (in-memory, 10-min TTL)
- **Styling**: Tailwind CSS 3.4.0 (fully responsive)

### User Roles & Features

#### 🛍️ Customer (ROLE_CUSTOMER)
- Register and login with JWT authentication
- Browse products with pagination (default 10 items/page)
- View product details
- Add to cart with size and quantity selection
- Edit cart items (update size/quantity)
- Manage wishlist (add/remove/view)
- Place orders with Cash on Delivery (COD)
- View order history with status tracking
- Responsive UI for mobile, tablet, desktop

#### 🏪 Vendor (ROLE_VENDOR)
- All customer features
- Create products with image upload
- Edit and delete own products
- View sales dashboard with statistics
- Manage product inventory
- View all orders for their products
- Cannot modify other vendors' products

#### 🔐 Security
- JWT token-based authentication (stateless)
- Role-based access control with @PreAuthorize
- BCrypt password hashing (strength 10)
- Method-level security on endpoints
- CORS configured for frontend integration

### Technology Stack

#### Backend Dependencies (Maven)
- Spring Boot Starter Web 3.2.0
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- Spring Boot Starter Cache
- MySQL Connector J (runtime)
- JWT (jjwt-api, jjwt-impl, jjwt-jackson) 0.11.5
- Caffeine Cache
- Spring DotEnv 4.0.0

#### Frontend Dependencies (npm)
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.8.0
- TypeScript 5.8.3
- Vite 7.1.2
- Tailwind CSS 3.4.0
- Axios 1.12.1
- Lucide React 0.263.1
- clsx, tailwind-merge

### Project Structure

```
spring-ecommerce/
├── src/main/java/com/ecommerce/
│   ├── config/
│   │   ├── SecurityConfig.java          # Spring Security + JWT
│   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   ├── CacheConfig.java            # Caffeine cache
│   │   └── EnvConfig.java              # Environment config
│   ├── controller/
│   │   ├── AuthController.java         # Login/Register
│   │   ├── ProductController.java      # Product CRUD + Pagination
│   │   ├── CartController.java         # Cart management
│   │   ├── WishlistController.java     # Wishlist
│   │   └── OrderController.java        # Orders
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ProductService.java         # With caching
│   │   ├── CartService.java
│   │   ├── WishlistService.java
│   │   └── JwtService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   ├── CartRepository.java
│   │   ├── WishlistRepository.java
│   │   └── OrderRepository.java
│   ├── entity/
│   │   ├── User.java                   # CUSTOMER/VENDOR
│   │   ├── Product.java
│   │   ├── Cart.java                   # With size/quantity
│   │   ├── Wishlist.java
│   │   └── Order.java
│   └── dto/
│       ├── LoginRequest.java
│       ├── RegisterRequest.java
│       └── ApiResponse.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Wishlist.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── VendorDashboard.tsx
│   │   │   ├── VendorOrders.tsx
│   │   │   ├── PublicHomepage.tsx
│   │   │   └── PublicProductList.tsx
│   │   ├── services/
│   │   │   └── api.ts                  # Axios API service
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript types
│   │   ├── hooks/                      # Custom hooks
│   │   ├── lib/                        # Utilities
│   │   ├── pages/                      # Page components
│   │   └── App.tsx
│   └── package.json
├── database-schema.sql
├── pom.xml
└── .env                                # Environment variables
```

### Database Schema

```sql
user (userid, username, email, password, usertype, created_at)
product (pid, name, price, detail, imgpath, vendor_id, created_at)
cart (id, userid, pid, price, quantity, size, added_at)
wishlist (id, userid, pid, added_at)
orders (id, userid, pid, price, order_date, status)
```

**Relationships:**
- User → Product (One-to-Many via vendor_id)
- User → Cart (One-to-Many via userid)
- User → Wishlist (One-to-Many via userid)
- User → Orders (One-to-Many via userid)
- Foreign keys with CASCADE delete
- Unique constraint on wishlist (userid, pid)

### RESTful API Endpoints

#### Authentication (Public)
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
```

#### Products (Cached)
```
GET  /api/products?page=0&size=10&sortBy=pid  # Paginated list
GET  /api/products/{id}                       # Get by ID (cached)
POST /api/products                            # Create (VENDOR only)
PUT  /api/products/{id}                       # Update (VENDOR only)
DELETE /api/products/{id}                     # Delete (VENDOR only)
GET  /api/products/vendor                     # Vendor's products
```

#### Cart (Authenticated)
```
GET  /api/cart                                # Get user's cart
POST /api/cart/add/{productId}?quantity=1&size=M  # Add with size/qty
PUT  /api/cart/{cartId}?quantity=2&size=L     # Update cart item
DELETE /api/cart/{cartId}                     # Remove from cart
```

#### Wishlist (Authenticated)
```
GET  /api/wishlist                            # Get user's wishlist
POST /api/wishlist/add/{productId}            # Add to wishlist
DELETE /api/wishlist/remove/{productId}       # Remove from wishlist
GET  /api/wishlist/check/{productId}          # Check if in wishlist
```

#### Orders (Authenticated)
```
GET  /api/orders                              # Get user's orders
POST /api/orders/place                        # Place order (COD)
GET  /api/orders/vendor                       # Vendor's orders
```

**Features:**
- JSON request/response
- JWT Bearer token authentication
- Pagination support (page, size, sortBy)
- Caching on product queries
- Role-based access control
- Proper HTTP status codes

### Quick Start

#### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

#### Setup Instructions

**1. Clone Repository**
```bash
git clone <repository-url>
cd E-commerce-Project/spring-ecommerce
```

**2. Setup Database**
```bash
mysql -u root -p
CREATE DATABASE ecom;
USE ecom;
SOURCE database-schema.sql;
exit;
```

**3. Configure Environment**
```bash
# Create .env file in spring-ecommerce directory
echo "JWT_SECRET=your-secret-key-here" > .env
echo "DB_PASSWORD=your-mysql-password" >> .env
```

**4. Start Backend**
```bash
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

**5. Start Frontend**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Build for Production

**Backend:**
```bash
mvn clean package
java -jar target/spring-ecommerce-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔷 Implementation 2: PHP (Traditional)

**Directory**: `e-commerce/`

### Overview
A traditional PHP-based e-commerce platform with session-based authentication, ideal for shared hosting environments.

### Technology Stack
- **Backend**: PHP 7.4+
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: MySQL 8.0
- **Authentication**: Session-based
- **Deployment**: XAMPP, WAMP, cPanel, any PHP hosting

### Project Structure

```
e-commerce/
├── customer/                    # Customer portal
│   ├── home.php                # Product catalog
│   ├── viewdetails.php         # Product details
│   ├── addcart.php             # Add to cart
│   ├── viewcart.php            # Shopping cart
│   ├── checkout.php            # Checkout process
│   ├── placeorder.php          # Order placement
│   ├── vieworders.php          # Order history
│   ├── deletecart.php          # Remove cart items
│   ├── register.html           # Customer registration form
│   ├── register.php            # Registration processing
│   └── menu.html               # Customer navigation
├── vendor/                     # Vendor portal
│   ├── home.php                # Vendor dashboard
│   ├── upload.php              # Product upload
│   ├── view.php                # Product management
│   ├── edit.php                # Product editing
│   ├── editproduct.php         # Edit processing
│   ├── deleteproduct.php       # Product deletion
│   ├── vieworders.php          # Order management
│   ├── status.php              # Order status updates
│   ├── viewdetails.php         # Order details
│   ├── register.html           # Vendor registration form
│   ├── register.php            # Registration processing
│   └── menu.html               # Vendor navigation
├── shared/                     # Common utilities
│   ├── images/                 # Product images
│   ├── connection.php          # Database connection
│   ├── login.html              # Login form
│   ├── login.php               # Login processing
│   ├── logout.php              # Logout handling
│   ├── authguard.php           # General authentication
│   ├── customer-authguard.php  # Customer auth guard
│   └── vendor-authguard.php    # Vendor auth guard
├── index.php                   # Application entry point
└── readme.txt                  # Basic project info
```

### Features

#### Customer Portal
- User registration and login
- Browse products
- View product details
- Add to cart
- Checkout and place orders
- View order history

#### Vendor Portal
- Vendor registration and login
- Upload products with images
- Edit and delete products
- View orders
- Update order status

### Setup Instructions

#### Using XAMPP/WAMP (Local)
1. Install XAMPP or WAMP
2. Copy `e-commerce` folder to `htdocs/` (XAMPP) or `www/` (WAMP)
3. Create database:
   ```sql
   CREATE DATABASE acme;
   ```
4. Import schema from `spring-ecommerce/database-schema.sql`
5. Configure database in `shared/connection.php`:
   ```php
   $conn = new mysqli("localhost", "root", "", "acme");
   ```
6. Access: `http://localhost/e-commerce/`

#### Using cPanel (Production)
1. Upload files via FTP or File Manager
2. Create MySQL database in cPanel
3. Import database schema
4. Update `shared/connection.php` with credentials
5. Set folder permissions (755 for folders, 644 for files)
6. Access via your domain

### Key Files
- `shared/connection.php` - Database configuration
- `shared/login.php` - User authentication
- `customer/home.php` - Product listing
- `vendor/upload.php` - Product management
- `index.php` - Landing page

---

## 📊 Implementation Comparison

| Feature | Spring Boot + React | PHP |
|---------|-------------------|-----|
| **Architecture** | RESTful API, MVC | Server-side rendering |
| **Authentication** | JWT (Stateless) | Session (Stateful) |
| **Frontend** | React + TypeScript | HTML + CSS + JS |
| **Scalability** | High (horizontal scaling) | Moderate (vertical scaling) |
| **Deployment** | Requires build process | Direct upload |
| **Development** | Hot reload, TypeScript | Manual refresh |
| **Performance** | High (caching, optimization) | Good |
| **Learning Curve** | Moderate-High | Low-Moderate |
| **Hosting** | Requires Java + Node | Any PHP hosting |
| **Best For** | Modern applications | Simple projects, learning |

---

## 🎯 Which Implementation to Choose?

### Choose Spring Boot + React if:
- ✅ Building a modern, scalable application
- ✅ Need RESTful API for mobile apps
- ✅ Want caching and performance optimization
- ✅ Prefer stateless authentication (JWT)
- ✅ Need pagination and advanced features
- ✅ Want TypeScript for type safety

### Choose PHP if:
- ✅ Learning web development basics
- ✅ Have shared hosting (cPanel)
- ✅ Need quick deployment without build process
- ✅ Prefer traditional server-side rendering
- ✅ Want simpler codebase
- ✅ Budget-conscious hosting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌟 Support

If you find this project useful, please consider giving it a star ⭐

---

**Made with ❤️**
