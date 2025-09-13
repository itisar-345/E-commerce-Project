package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT o FROM Order o WHERE o.product.vendor = :vendor")
    List<Order> findByVendor(User vendor);
}