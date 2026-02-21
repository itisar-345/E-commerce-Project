package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartService cartService;
    
    @Transactional
    @CacheEvict(value = {"userOrders", "vendorOrders"}, allEntries = true)
    public List<Order> placeOrder(User user, String phone, String address) {
        List<Cart> cartItems = cartService.getUserCart(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
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
    
    @Cacheable(value = "userOrders", key = "#user.userid")
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
    
    @Cacheable(value = "vendorOrders", key = "#vendor.userid")
    public List<Order> getVendorOrders(User vendor) {
        return orderRepository.findByVendor(vendor);
    }
    
    @CacheEvict(value = {"userOrders", "vendorOrders"}, allEntries = true)
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}