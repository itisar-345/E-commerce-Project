package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "review", uniqueConstraints = @UniqueConstraint(columnNames = {"userid", "pid"}))
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userid", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pid", nullable = false)
    private Product product;
    
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public Review() {}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
