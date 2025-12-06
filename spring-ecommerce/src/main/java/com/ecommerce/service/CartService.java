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
    
    public Cart addToCart(User user, Long productId, Integer quantity, String size) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Cart newCart = new Cart(user, product, product.getPrice());
        newCart.setQuantity(quantity != null ? quantity : 1);
        newCart.setSize(size);
        return cartRepository.save(newCart);
    }
    
    public Cart updateCart(Long cartId, Integer quantity, String size) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (quantity != null) {
            cart.setQuantity(quantity);
        }
        if (size != null) {
            cart.setSize(size);
        }
        return cartRepository.save(cart);
    }
    
    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartRepository.deleteByUser(user);
    }
}