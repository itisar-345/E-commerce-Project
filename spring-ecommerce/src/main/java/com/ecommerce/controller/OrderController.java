package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/place")
    public ResponseEntity<ApiResponse<List<Order>>> placeOrder(
            @RequestBody com.ecommerce.dto.CheckoutRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Order> orders = orderService.placeOrder(user, request.getPhone(), request.getAddress());
            return ResponseEntity.ok(ApiResponse.success("Order placed successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getUserOrders(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtService.extractEmail(token.substring(7));
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Order> orders = orderService.getUserOrders(user);
            return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/vendor")
    public ResponseEntity<ApiResponse<List<Order>>> getVendorOrders(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Getting vendor orders - Token: " + token);
            String email = jwtService.extractEmail(token.substring(7));
            System.out.println("Extracted email: " + email);
            
            User vendor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("Vendor found: " + vendor.getUsername() + ", ID: " + vendor.getUserid());
            List<Order> orders = orderService.getVendorOrders(vendor);
            System.out.println("Found " + orders.size() + " orders for vendor: " + vendor.getUsername());
            
            return ResponseEntity.ok(ApiResponse.success("Vendor orders retrieved successfully", orders));
        } catch (Exception e) {
            System.err.println("Error fetching vendor orders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam Order.OrderStatus status) {
        try {
            Order order = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(ApiResponse.success("Order status updated", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}