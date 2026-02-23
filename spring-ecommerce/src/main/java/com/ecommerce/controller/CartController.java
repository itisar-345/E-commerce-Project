package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.RedisCartService;
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
    private RedisCartService cartService;
    
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
            @RequestParam(required = false, defaultValue = "1") Integer quantity,
            @RequestParam(required = false) String size,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Cart cartItem = cartService.addToCart(user, productId, quantity, size);
            return ResponseEntity.ok(ApiResponse.success("Product added to cart", cartItem));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{cartId}")
    public ResponseEntity<ApiResponse<Cart>> updateCart(
            @PathVariable Long cartId,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) String size) {
        try {
            Cart cartItem = cartService.updateCart(cartId, quantity, size);
            return ResponseEntity.ok(ApiResponse.success("Cart updated successfully", cartItem));
        } catch (Exception e) {
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