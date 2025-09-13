package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userid", referencedColumnName = "userid")
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pid", referencedColumnName = "pid")
    private Product product;
    
    private BigDecimal price;
    
    private Integer quantity = 1;
    
    // Constructors
    public Cart() {}
    
    public Cart(User user, Product product, BigDecimal price) {
        this.user = user;
        this.product = product;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}