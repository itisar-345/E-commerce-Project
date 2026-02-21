package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable Long productId) {
        try {
            List<Review> reviews = reviewService.getProductReviews(productId);
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/product/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @PathVariable Long productId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String comment,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Review review = reviewService.addReview(user, productId, rating, comment);
            return ResponseEntity.ok(ApiResponse.success("Review added successfully", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/can-review/{productId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Boolean>> canUserReview(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean canReview = reviewService.canUserReview(user.getUserid(), productId);
            return ResponseEntity.ok(ApiResponse.success("Check completed", canReview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
