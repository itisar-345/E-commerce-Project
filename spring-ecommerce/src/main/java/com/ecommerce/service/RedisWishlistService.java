package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class RedisWishlistService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private static final String WISHLIST_KEY_PREFIX = "wishlist:user:";
    private static final long WISHLIST_TTL_MINUTES = 15;

    private String getWishlistKey(Long userId) {
        return WISHLIST_KEY_PREFIX + userId;
    }

    public List<Wishlist> getUserWishlist(User user) {
        String key = getWishlistKey(user.getUserid());
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();

        Set<Object> cachedIds = setOps.members(key);

        if (cachedIds != null && !cachedIds.isEmpty()) {
            return wishlistRepository.findByUser(user).stream()
                    .peek(item -> populateRatingData(item.getProduct()))
                    .collect(Collectors.toList());
        }

        List<Wishlist> wishlist = wishlistRepository.findByUser(user);
        wishlist.forEach(item -> {
            populateRatingData(item.getProduct());
            setOps.add(key, item.getProduct().getPid());
        });

        if (!wishlist.isEmpty()) {
            redisTemplate.expire(key, WISHLIST_TTL_MINUTES, TimeUnit.MINUTES);
        }

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
        Wishlist saved = wishlistRepository.save(wishlist);

        String key = getWishlistKey(user.getUserid());
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();
        setOps.add(key, productId);
        redisTemplate.expire(key, WISHLIST_TTL_MINUTES, TimeUnit.MINUTES);

        return saved;
    }

    @Transactional
    public void removeFromWishlist(User user, Long productId) {
        wishlistRepository.deleteByUserAndProductPid(user, productId);

        String key = getWishlistKey(user.getUserid());
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();
        setOps.remove(key, productId);
    }

    public boolean isInWishlist(User user, Long productId) {
        String key = getWishlistKey(user.getUserid());
        SetOperations<String, Object> setOps = redisTemplate.opsForSet();

        Boolean isMember = setOps.isMember(key, productId);
        if (isMember != null && isMember) {
            return true;
        }

        return wishlistRepository.findByUserAndProductPid(user, productId).isPresent();
    }

    private void populateRatingData(Product product) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getPid());
        Long reviewCount = reviewRepository.getReviewCountByProductId(product.getPid());
        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setReviewCount(reviewCount != null ? reviewCount : 0L);
    }
}
