package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductPid(productId);
    }
    
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public Review addReview(User user, Long productId, Integer rating, String comment) {
        // Check if user has purchased the product and it's delivered
        boolean hasDeliveredOrder = orderRepository.existsByUserUseridAndProductPidAndStatus(
            user.getUserid(), productId, Order.OrderStatus.DELIVERED
        );
        if (!hasDeliveredOrder) {
            throw new RuntimeException("You can only review products that have been delivered to you");
        }
        
        // Check if user already reviewed this product
        if (reviewRepository.existsByUserUseridAndProductPid(user.getUserid(), productId)) {
            throw new RuntimeException("You have already reviewed this product");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);
        
        return reviewRepository.save(review);
    }
    
    public boolean canUserReview(Long userId, Long productId) {
        boolean hasDeliveredOrder = orderRepository.existsByUserUseridAndProductPidAndStatus(
            userId, productId, Order.OrderStatus.DELIVERED
        );
        boolean hasReviewed = reviewRepository.existsByUserUseridAndProductPid(userId, productId);
        return hasDeliveredOrder && !hasReviewed;
    }
}
