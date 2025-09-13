# PHP E-Commerce Platform

A traditional server-side e-commerce platform built with PHP and MySQL, featuring session-based authentication and multi-role functionality for customers and vendors.

## 🏗️ Architecture

### Backend
- **Language**: PHP 7.4+
- **Database**: MySQL with direct queries
- **Authentication**: Session-based
- **File Structure**: MVC-inspired organization

### Frontend
- **Languages**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS
- **Forms**: Traditional HTML forms with PHP processing

## 📁 Project Structure

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

## 🔧 Database Configuration

### Connection Setup
Edit `shared/connection.php`:
```php
<?php
$conn = new mysqli("localhost", "root", "", "acme");

if($conn->connect_error) {
    echo "Connection Failed!, Aborting Execution";
    die;
}
?>
```

### Database Schema
The application uses the same database schema as the Spring Boot version:
- **user**: User authentication and roles
- **product**: Product catalog
- **cart**: Shopping cart items
- **orders**: Order management

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- MySQL 8.0 or higher
- Apache/Nginx web server
- phpMyAdmin (optional)

### Setup Instructions

1. **Web Server Setup**
   ```bash
   # For XAMPP/WAMP users
   # Copy project to htdocs/www directory
   cp -r e-commerce /path/to/htdocs/
   ```

2. **Database Setup**
   ```sql
   -- Create database
   CREATE DATABASE acme;
   
   -- Import schema (use same as Spring Boot version)
   USE acme;
   SOURCE ../spring-ecommerce/database-schema.sql;
   ```

3. **Configuration**
   ```php
   // Update shared/connection.php with your credentials
   $conn = new mysqli("localhost", "username", "password", "acme");
   ```

4. **Access Application**
   - Navigate to: `http://localhost/e-commerce/`
   - Default entry point: `index.php`

## 🎯 User Roles & Features

### Customer Portal (`/customer/`)
- **Registration**: `register.html` → `register.php`
- **Product Browsing**: `home.php` (product catalog)
- **Product Details**: `viewdetails.php?pid={id}`
- **Shopping Cart**: 
  - Add: `addcart.php`
  - View: `viewcart.php`
  - Remove: `deletecart.php`
- **Order Management**:
  - Checkout: `checkout.php`
  - Place Order: `placeorder.php`
  - View Orders: `vieworders.php`

### Vendor Portal (`/vendor/`)
- **Registration**: `register.html` → `register.php`
- **Dashboard**: `home.php` (vendor overview)
- **Product Management**:
  - Upload: `upload.php`
  - View All: `view.php`
  - Edit: `edit.php` → `editproduct.php`
  - Delete: `deleteproduct.php`
- **Order Management**:
  - View Orders: `vieworders.php`
  - Update Status: `status.php`
  - Order Details: `viewdetails.php`

## 🔐 Authentication System

### Session-Based Authentication
```php
// Login process (shared/login.php)
session_start();
$_SESSION['userid'] = $user_id;
$_SESSION['usertype'] = $user_type;

// Auth guards
include 'shared/customer-authguard.php';  // For customer pages
include 'shared/vendor-authguard.php';    // For vendor pages
```

### Access Control
- **Customer Auth Guard**: Protects customer-only pages
- **Vendor Auth Guard**: Protects vendor-only pages
- **General Auth Guard**: Basic authentication check

## 📝 Key Files Description

### Core Files
- **`index.php`**: Application entry point and routing
- **`shared/connection.php`**: Database connection configuration
- **`shared/login.php`**: User authentication processing
- **`shared/logout.php`**: Session cleanup and logout

### Customer Files
- **`customer/home.php`**: Product catalog with search/filter
- **`customer/viewcart.php`**: Shopping cart management
- **`customer/placeorder.php`**: Order processing and cart clearing

### Vendor Files
- **`vendor/upload.php`**: Product creation with image upload
- **`vendor/view.php`**: Product inventory management
- **`vendor/status.php`**: Order status updates

## 🛠️ Development Notes

### File Upload Handling
```php
// Product image upload in vendor/upload.php
$target_dir = "../shared/images/";
$target_file = $target_dir . basename($_FILES["image"]["name"]);
move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
```

### Database Queries
```php
// Example product retrieval
$sql = "SELECT * FROM product WHERE vendor_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $vendor_id);
$stmt->execute();
$result = $stmt->get_result();
```

### Session Management
```php
// Check authentication
if (!isset($_SESSION['userid'])) {
    header("Location: ../shared/login.html");
    exit();
}
```

## 🔧 Customization

### Adding New Features
1. Create new PHP files in appropriate directories
2. Include authentication guards
3. Update navigation menus (`menu.html`)
4. Add database queries as needed

### Styling
- CSS files are embedded in HTML files
- Images stored in `shared/images/`
- Responsive design can be added with CSS frameworks

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check credentials in `connection.php`
2. **File Permissions**: Ensure web server can read/write files
3. **Session Issues**: Check PHP session configuration
4. **Image Upload**: Verify `shared/images/` directory permissions

### Error Handling
```php
// Basic error handling example
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
```

## 🔄 Migration to Spring Boot

This PHP version serves as a reference implementation. For production use, consider migrating to the Spring Boot version which offers:
- Better security with JWT
- RESTful API architecture
- Modern frontend with React
- Comprehensive testing
- Better scalability