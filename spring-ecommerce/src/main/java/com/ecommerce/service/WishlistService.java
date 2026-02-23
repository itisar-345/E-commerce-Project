package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public List<Wishlist> getUserWishlist(User user) {
        List<Wishlist> wishlist = wishlistRepository.findByUser(user);
        wishlist.forEach(item -> populateRatingData(item.getProduct()));
        return wishlist;
    }
    
    @Transactional
    public Wishlist addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (wishlistRepository.findByUserAndProductPid(user, productId).isPresent()) {
            throw new RuntimeException("Product already in wishlist");
        }
        
        Wishlist wishlist = new Wishlist(user, product);
        return wishlistRepository.save(wishlist);
    }
    
    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        wishlistRepository.deleteByUserAndProductPid(user, productId);
    }
    
    public boolean isInWishlist(User user, Long productId) {
        return wishlistRepository.findByUserAndProductPid(user, productId).isPresent();
    }
    
    private void populateRatingData(Product product) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getPid());
        Long reviewCount = reviewRepository.getReviewCountByProductId(product.getPid());
        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setReviewCount(reviewCount != null ? reviewCount : 0L);
    }
}