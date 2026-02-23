package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.RedisWishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    
    @Autowired
    private RedisWishlistService wishlistService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getWishlist(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Wishlist> wishlist = wishlistService.getUserWishlist(user);
            return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved successfully", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> addToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Wishlist wishlist = wishlistService.addToWishlist(user, productId);
            return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<String>> removeFromWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            wishlistService.removeFromWishlist(user, productId);
            return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean isInWishlist = wishlistService.isInWishlist(user, productId);
            return ResponseEntity.ok(ApiResponse.success("Wishlist status", isInWishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
