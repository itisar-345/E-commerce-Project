package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class RedisCartService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_TTL_HOURS = 24;
    
    private String getCartKey(Long userId) {
        return CART_KEY_PREFIX + userId;
    }
    
    public List<Cart> getUserCart(User user) {
        String cartKey = getCartKey(user.getUserid());
        HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
        
        Map<String, Object> cartItems = hashOps.entries(cartKey);
        
        if (cartItems.isEmpty()) {
            List<Cart> dbCart = cartRepository.findByUser(user);
            syncToRedis(user.getUserid(), dbCart);
            return dbCart;
        }
        
        List<Cart> carts = new ArrayList<>();
        for (Map.Entry<String, Object> entry : cartItems.entrySet()) {
            Cart cart = (Cart) entry.getValue();
            carts.add(cart);
        }
        return carts;
    }
    
    public Cart addToCart(User user, Long productId, Integer quantity, String size) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStock() == 0) {
            throw new RuntimeException("Product is out of stock");
        }
        
        int requestedQty = quantity != null ? quantity : 1;
        if (product.getStock() < requestedQty) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }
        
        Cart newCart = new Cart(user, product, product.getPrice());
        newCart.setQuantity(requestedQty);
        newCart.setSize(size);
        Cart savedCart = cartRepository.save(newCart);
        
        String cartKey = getCartKey(user.getUserid());
        HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
        hashOps.put(cartKey, String.valueOf(savedCart.getId()), savedCart);
        redisTemplate.expire(cartKey, CART_TTL_HOURS, TimeUnit.HOURS);
        
        return savedCart;
    }
    
    public Cart updateCart(Long cartId, Integer quantity, String size) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (quantity != null) {
            Product product = cart.getProduct();
            if (product.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
            }
            cart.setQuantity(quantity);
        }
        if (size != null) {
            cart.setSize(size);
        }
        Cart updatedCart = cartRepository.save(cart);
        
        String cartKey = getCartKey(cart.getUser().getUserid());
        HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
        hashOps.put(cartKey, String.valueOf(cartId), updatedCart);
        
        return updatedCart;
    }
    
    public void removeFromCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            String cartKey = getCartKey(cart.getUser().getUserid());
            HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
            hashOps.delete(cartKey, String.valueOf(cartId));
        }
        cartRepository.deleteById(cartId);
    }
    
    @Transactional
    public void clearCart(User user) {
        String cartKey = getCartKey(user.getUserid());
        redisTemplate.delete(cartKey);
        cartRepository.deleteByUser(user);
    }
    
    public void incrementQuantity(Long userId, Long cartId) {
        String cartKey = getCartKey(userId);
        HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
        
        Cart cart = (Cart) hashOps.get(cartKey, String.valueOf(cartId));
        if (cart != null) {
            Product product = cart.getProduct();
            if (product.getStock() > cart.getQuantity()) {
                cart.setQuantity(cart.getQuantity() + 1);
                hashOps.put(cartKey, String.valueOf(cartId), cart);
                cartRepository.save(cart);
            } else {
                throw new RuntimeException("Cannot exceed available stock");
            }
        }
    }
    
    private void syncToRedis(Long userId, List<Cart> carts) {
        if (carts.isEmpty()) return;
        
        String cartKey = getCartKey(userId);
        HashOperations<String, String, Object> hashOps = redisTemplate.opsForHash();
        
        for (Cart cart : carts) {
            hashOps.put(cartKey, String.valueOf(cart.getId()), cart);
        }
        redisTemplate.expire(cartKey, CART_TTL_HOURS, TimeUnit.HOURS);
    }
}
