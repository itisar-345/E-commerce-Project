package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getCart(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Cart> cartItems = cartService.getUserCart(user);
            return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", cartItems));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Add to cart request - Product ID: " + productId);
            System.out.println("Token received: " + token);
            
            String email = jwtService.extractEmail(token.substring(7));
            System.out.println("Extracted email: " + email);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("User found: " + user.getUsername());
            Cart cartItem = cartService.addToCart(user, productId);
            System.out.println("Cart item created successfully");
            
            return ResponseEntity.ok(ApiResponse.success("Product added to cart", cartItem));
        } catch (Exception e) {
            System.err.println("Error adding to cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse<String>> removeFromCart(@PathVariable Long cartId) {
        try {
            cartService.removeFromCart(cartId);
            return ResponseEntity.ok(ApiResponse.success("Item removed from cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}