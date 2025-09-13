# E-Commerce Platform

A comprehensive e-commerce platform built with modern technologies, featuring both a **Spring Boot + React** implementation and a **PHP** version. The project supports multi-role functionality for customers and vendors with complete product management, cart, and order processing capabilities.

## 🚀 Primary Implementation: Spring Boot + React

### Architecture Overview
- **Backend**: Spring Boot 3.2.0 with Java 17
- **API**: RESTful API with JSON responses
- **Frontend**: React 18 with TypeScript and Vite
- **Database**: MySQL with JPA/Hibernate
- **Authentication**: JWT-based security
- **Styling**: Tailwind CSS with custom UI components

### Key Features

#### 🛍️ Customer Features
- User registration and authentication
- Browse products with detailed views
- Shopping cart management
- Order placement and tracking
- Wishlist functionality
- Responsive design for all devices

#### 🏪 Vendor Features
- Vendor dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates
- Image upload for products
- Sales tracking

#### 🔐 Security Features
- JWT token-based authentication
- Role-based access control (CUSTOMER/VENDOR)
- Secure password hashing
- Protected API endpoints

### Technology Stack

#### Backend Dependencies
```xml
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- MySQL Connector
- JWT (jjwt) 0.11.5
- Spring DotEnv 4.0.0
```

#### Frontend Dependencies
```json
- React 18.2.0
- TypeScript 5.8.3
- React Router DOM 6.8.0
- Axios 1.12.1
- Tailwind CSS 3.4.0
- Lucide React (icons)
- Vite 7.1.2
```

### Project Structure

```
spring-ecommerce/
├── src/main/java/com/ecommerce/
│   ├── config/          # Security & JWT configuration
│   ├── controller/      # REST API controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── repository/     # Data access layer
│   ├── service/        # Business logic
│   └── EcommerceApplication.java
├── src/main/resources/
│   ├── static/images/  # Product images
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx
│   └── package.json
├── database-schema.sql
└── pom.xml
```

### Database Schema

The application uses a MySQL database with the following main tables:
- **user**: User authentication and role management
- **product**: Product catalog with vendor relationships
- **cart**: Shopping cart items
- **orders**: Order history and status tracking

### RESTful API Endpoints

The backend provides a comprehensive RESTful API following REST principles with proper HTTP methods and status codes.

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Vendor only)
- `PUT /api/products/{id}` - Update product (Vendor only)
- `DELETE /api/products/{id}` - Delete product (Vendor only)

#### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/{id}` - Remove item from cart
- `POST /api/orders/checkout` - Place order
- `GET /api/orders` - Get user's orders

**API Features:**
- JSON request/response format
- JWT token-based authentication
- Proper HTTP status codes
- Error handling with meaningful messages
- CORS support for frontend integration

### Setup Instructions

#### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

#### Backend Setup
1. Clone the repository
2. Navigate to `spring-ecommerce` directory
3. Create MySQL database named `ecom`
4. Run the database schema: `mysql -u root -p ecom < database-schema.sql`
5. Configure database connection in `application.properties`
6. Set JWT secret in environment variables or `.env` file
7. Run: `mvn spring-boot:run`

#### Frontend Setup
1. Navigate to `spring-ecommerce/frontend` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access application at `http://localhost:5173`

#### Quick Start Scripts
- **Windows**: Use `start-application.bat` to start the backend
- **Frontend**: Use `install-deps.bat` and `start-dev.bat` in frontend directory

### Environment Configuration

Create a `.env` file in the root directory:
```env
JWT_SECRET=your-secret-key-here
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecom
DB_USERNAME=root
DB_PASSWORD=your-password
```

---

## 📱 Alternative Implementation: PHP Version

### Overview
A traditional PHP-based e-commerce platform with similar functionality, located in the `e-commerce` directory.

### Features
- **Customer Portal**: Product browsing, cart management, order placement
- **Vendor Portal**: Product management, order tracking
- **Admin Features**: User management, platform oversight

### Technology Stack
- **Backend**: PHP with MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MySQL with direct queries
- **Authentication**: Session-based

### Structure
```
e-commerce/
├── customer/           # Customer-facing pages
├── vendor/            # Vendor management pages
├── shared/            # Common utilities and images
│   ├── images/        # Product images
│   ├── connection.php # Database connection
│   └── auth files     # Authentication logic
└── index.php          # Entry point
```

### Key Files
- `shared/connection.php` - Database configuration
- `customer/home.php` - Product catalog
- `vendor/upload.php` - Product management
- `shared/login.php` - Authentication

### Setup
1. Configure database connection in `shared/connection.php`
2. Import database schema (similar to Spring version)
3. Deploy to web server with PHP support
4. Access via `index.php`

---

## 🎯 User Roles & Responsibilities

### Customer
- ✅ Authentication and registration
- ✅ Browse and search products
- ✅ Add products to cart and wishlist
- ✅ Place and track orders
- ✅ View order history

### Vendor
- ✅ Authentication and registration
- ✅ Product management (CRUD operations)
- ✅ Upload product images
- ✅ View and manage orders
- ✅ Update order status
- ✅ Dashboard analytics

### Super Admin (Future Enhancement)
- 🔄 Platform management
- 🔄 User management
- 🔄 Customer support handling

---

## 🚀 Getting Started (Recommended: Spring Boot Version)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-commerce-Project/spring-ecommerce
   ```

2. **Database Setup**
   ```bash
   mysql -u root -p
   CREATE DATABASE ecom;
   USE ecom;
   SOURCE database-schema.sql;
   ```

3. **Backend**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

---

## 📝 Development Notes

- The Spring Boot version is the primary, production-ready implementation
- PHP version serves as an alternative or learning reference
- Both versions share similar database schema and business logic
- JWT authentication provides stateless, scalable security
- React frontend offers modern, responsive user experience
- Comprehensive test coverage included in Spring Boot version

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).