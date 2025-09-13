package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Cart> getUserCart(User user) {
        return cartRepository.findByUser(user);
    }
    
    public Cart addToCart(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        return cartRepository.findByUserAndProduct(user, product)
                .map(existingCart -> {
                    existingCart.setQuantity(existingCart.getQuantity() + 1);
                    return cartRepository.save(existingCart);
                })
                .orElseGet(() -> {
                    Cart newCart = new Cart(user, product, product.getPrice());
                    return cartRepository.save(newCart);
                });
    }
    
    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteByUser(user);
    }
}