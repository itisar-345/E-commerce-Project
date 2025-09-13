package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByVendor(User vendor);
    List<Product> findByNameContainingIgnoreCase(String name);
}