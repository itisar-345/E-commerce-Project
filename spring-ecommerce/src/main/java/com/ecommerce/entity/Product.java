package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pid;
    
    @NotBlank
    private String name;
    
    @Positive
    private BigDecimal price;
    
    @Column(columnDefinition = "TEXT")
    private String detail;
    
    private String imgpath;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", referencedColumnName = "userid")
    private User vendor;
    
    // Constructors
    public Product() {}
    
    public Product(String name, BigDecimal price, String detail, String imgpath, User vendor) {
        this.name = name;
        this.price = price;
        this.detail = detail;
        this.imgpath = imgpath;
        this.vendor = vendor;
    }
    
    // Getters and Setters
    public Long getPid() { return pid; }
    public void setPid(Long pid) { this.pid = pid; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
    
    public String getImgpath() { return imgpath; }
    public void setImgpath(String imgpath) { this.imgpath = imgpath; }
    
    public User getVendor() { return vendor; }
    public void setVendor(User vendor) { this.vendor = vendor; }
}