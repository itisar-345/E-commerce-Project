# Spring Boot E-Commerce Application

A modern, full-stack e-commerce platform built with Spring Boot 3.2.0 and React 18, featuring JWT authentication, RESTful APIs, and role-based access control.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security + JWT
- **API**: RESTful with JSON responses

### Frontend (React)
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.0
- **HTTP Client**: Axios 1.12.1

## 📁 Project Structure

```
spring-ecommerce/
├── src/main/java/com/ecommerce/
│   ├── config/
│   │   ├── SecurityConfig.java          # Spring Security configuration
│   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   └── EnvConfig.java              # Environment configuration
│   ├── controller/
│   │   ├── AuthController.java         # Authentication endpoints
│   │   ├── ProductController.java      # Product CRUD operations
│   │   ├── CartController.java         # Shopping cart management
│   │   └── OrderController.java        # Order processing
│   ├── service/
│   │   ├── AuthService.java           # Authentication logic
│   │   ├── ProductService.java        # Product business logic
│   │   ├── CartService.java           # Cart operations
│   │   └── JwtService.java            # JWT token handling
│   ├── repository/
│   │   ├── UserRepository.java        # User data access
│   │   ├── ProductRepository.java     # Product data access
│   │   ├── CartRepository.java        # Cart data access
│   │   └── OrderRepository.java       # Order data access
│   ├── entity/
│   │   ├── User.java                  # User entity
│   │   ├── Product.java               # Product entity
│   │   ├── Cart.java                  # Cart entity
│   │   └── Order.java                 # Order entity
│   └── dto/
│       ├── LoginRequest.java          # Login request DTO
│       ├── RegisterRequest.java       # Registration request DTO
│       └── ApiResponse.java           # Standard API response
├── frontend/
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── services/api.ts          # API service layer
│   │   ├── types/index.ts           # TypeScript definitions
│   │   └── App.tsx                  # Main application component
│   └── package.json
├── database-schema.sql              # Database setup script
└── pom.xml                         # Maven dependencies
```

## 🔌 RESTful API Documentation

### Authentication Endpoints
```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password"
}

POST /api/auth/register
Content-Type: application/json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "userType": "CUSTOMER"
}
```

### Product Endpoints
```http
GET /api/products                    # Get all products
GET /api/products/{id}              # Get product by ID
POST /api/products                  # Create product (Vendor only)
PUT /api/products/{id}              # Update product (Vendor only)
DELETE /api/products/{id}           # Delete product (Vendor only)
```

### Cart & Order Endpoints
```http
GET /api/cart                       # Get user's cart
POST /api/cart                      # Add item to cart
DELETE /api/cart/{id}               # Remove cart item
POST /api/orders/checkout           # Place order
GET /api/orders                     # Get user's orders
```

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup
```bash
# Navigate to project directory
cd spring-ecommerce

# Create database
mysql -u root -p
CREATE DATABASE ecom;
USE ecom;
SOURCE database-schema.sql;

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run application
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Base**: http://localhost:8080/api

## 🔧 Configuration

### Environment Variables (.env)
```env
JWT_SECRET=your-jwt-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecom
DB_USERNAME=root
DB_PASSWORD=your-password
```

### Application Properties
```properties
spring.application.name=spring-ecommerce
jwt.secret=${JWT_SECRET:defaultSecret}
jwt.expiration=86400000
```

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ProductServiceTest

# Generate test coverage report
mvn jacoco:report
```

## 📦 Build & Deployment

```bash
# Build JAR file
mvn clean package

# Build frontend for production
cd frontend
npm run build

# Run production JAR
java -jar target/spring-ecommerce-1.0.0.jar
```

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Role-based Access**: CUSTOMER and VENDOR roles
- **Password Encryption**: BCrypt hashing
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Request validation with Spring Validation

## 🎯 User Roles

### Customer
- Browse products
- Manage cart and wishlist
- Place and track orders
- View order history

### Vendor
- Manage products (CRUD)
- Upload product images
- View and update order status
- Access sales dashboard

## 📚 Dependencies

### Backend (Maven)
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- MySQL Connector
- JWT (jjwt) 0.11.5
- Spring DotEnv 4.0.0

### Frontend (npm)
- React 18.2.0
- TypeScript 5.8.3
- Vite 7.1.2
- Tailwind CSS 3.4.0
- Axios 1.12.1
- Lucide React (icons)

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Ensure MySQL is running and credentials are correct
2. **JWT Secret**: Set a strong JWT secret in environment variables
3. **Port Conflicts**: Backend runs on 8080, frontend on 5173
4. **CORS Issues**: Backend is configured for localhost:5173

### Logs
```bash
# View application logs
tail -f logs/spring-ecommerce.log

# Enable debug logging
java -jar target/spring-ecommerce-1.0.0.jar --logging.level.com.ecommerce=DEBUG
```