package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RedisCartService cartService;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Transactional
    public List<Order> placeOrder(User user, String phone, String address) {
        List<Cart> cartItems = cartService.getUserCart(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Validate stock availability
        for (Cart cart : cartItems) {
            Product product = cart.getProduct();
            if (product.getStock() < cart.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getStock() + ", Requested: " + cart.getQuantity());
            }
        }
        
        List<Order> orders = cartItems.stream()
                .map(cart -> {
                    Order order = new Order(user, cart.getProduct(), cart.getPrice(), cart.getQuantity(), cart.getSize());
                    return order;
                })
                .toList();
        
        List<Order> savedOrders = orderRepository.saveAll(orders);
        cartService.clearCart(user);
        return savedOrders;
    }
    
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
    
    public List<Order> getVendorOrders(User vendor) {
        return orderRepository.findByVendor(vendor);
    }
    
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        Order.OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        
        // Reduce stock when order is delivered
        if (status == Order.OrderStatus.DELIVERED && oldStatus != Order.OrderStatus.DELIVERED) {
            Product product = order.getProduct();
            int newStock = product.getStock() - order.getQuantity();
            if (newStock < 0) newStock = 0;
            product.setStock(newStock);
            productRepository.save(product);
        }
        
        return orderRepository.save(order);
    }
}