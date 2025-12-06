-- E-commerce Database Schema
-- Run this script to set up the database structure

CREATE DATABASE IF NOT EXISTS ecom;
USE ecom;

-- User table for authentication
CREATE TABLE IF NOT EXISTS user (
    userid BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    usertype ENUM('CUSTOMER', 'VENDOR') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS product (
    pid BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    detail TEXT,
    imgpath VARCHAR(500),
    vendor_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES user(userid) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userid BIGINT NOT NULL,
    pid BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    size VARCHAR(10),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userid BIGINT NOT NULL,
    pid BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT DEFAULT 1,
    size VARCHAR(10),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    userid BIGINT NOT NULL,
    pid BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
    FOREIGN KEY (pid) REFERENCES product(pid) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (userid, pid)
);

-- Insert sample data
INSERT INTO user (username, email, password, usertype) VALUES
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'VENDOR'),
('customer1', 'customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER');

-- Insert sample products
INSERT INTO product (name, price, detail, imgpath, vendor_id) VALUES
('Men Formal Shirt', 1299.00, 'Premium quality formal shirt for men', '/images/MFormal.jpg', 1),
('Men Jeans', 1599.00, 'Comfortable denim jeans for casual wear', '/images/MJeans.jpg', 1),
('Men Kurta', 899.00, 'Traditional kurta for ethnic occasions', '/images/MKurta.jpg', 1),
('Men Polo T-Shirt', 799.00, 'Stylish polo t-shirt for casual outings', '/images/MPolo.jpg', 1),
('Women Blazer', 2199.00, 'Professional blazer for office wear', '/images/wBLAZER.jpg', 1),
('Women Dress', 1799.00, 'Elegant dress for special occasions', '/images/WDress.jpg', 1),
('Women Jeans', 1399.00, 'Trendy jeans for everyday wear', '/images/WJeans.jpg', 1),
('Women Kurti', 699.00, 'Beautiful kurti for casual and ethnic wear', '/images/Wkurti.jpg', 1);