package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class WishlistService {
    
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Cacheable(value = "wishlist", key = "#user.userid")
    public List<Wishlist> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user);
    }
    
    @Transactional
    @CacheEvict(value = "wishlist", key = "#user.userid")
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
    @CacheEvict(value = "wishlist", key = "#user.userid")
    public void removeFromWishlist(User user, Long productId) {
        wishlistRepository.deleteByUserAndProductPid(user, productId);
    }
    
    public boolean isInWishlist(User user, Long productId) {
        return wishlistRepository.findByUserAndProductPid(user, productId).isPresent();
    }
}
