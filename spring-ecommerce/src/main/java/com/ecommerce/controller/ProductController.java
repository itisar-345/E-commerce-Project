package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pid") String sortBy) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
            Page<Product> productPage = productService.getAllProducts(pageable);
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", productPage));
        } catch (Exception e) {
            System.err.println("Error fetching products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch products: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam String detail,
            @RequestParam MultipartFile image,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Creating product: " + name + ", Price: " + price);
            String email = jwtService.extractEmail(token.substring(7));
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Vendor found: " + vendor.getUsername());
            Product product = productService.createProduct(name, price, detail, image, vendor);
            System.out.println("Product created with ID: " + product.getPid());
            return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam BigDecimal price,
            @RequestParam String detail,
            @RequestParam(required = false) MultipartFile image) {
        try {
            Product product = productService.updateProduct(id, name, price, detail, image);
            return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/vendor")
    public ResponseEntity<ApiResponse<List<Product>>> getVendorProducts(
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Getting vendor products - Token: " + token);
            String email = jwtService.extractEmail(token.substring(7));
            System.out.println("Extracted email: " + email);
            
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Vendor found: " + vendor.getUsername() + ", ID: " + vendor.getUserid());
            List<Product> products = productService.getProductsByVendor(vendor);
            System.out.println("Found " + products.size() + " products for vendor: " + vendor.getUsername());
            
            return ResponseEntity.ok(ApiResponse.success("Vendor products retrieved successfully", products));
        } catch (Exception e) {
            System.err.println("Error fetching vendor products: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}