package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping("/hello")
    public String hello() {
        return "Backend is working!";
    }
    
    @GetMapping("/test/products")
    public String testProducts() {
        try {
            List<Product> products = productRepository.findAll();
            return "Database connected! Found " + products.size() + " products in database.";
        } catch (Exception e) {
            return "Database error: " + e.getMessage();
        }
    }
}