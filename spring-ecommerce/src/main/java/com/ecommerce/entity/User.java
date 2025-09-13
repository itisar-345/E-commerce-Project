package com.ecommerce.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;
    
    @NotBlank
    private String username;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    @Enumerated(EnumType.STRING)
    private UserType usertype;
    
    public enum UserType {
        CUSTOMER, VENDOR
    }
    
    // Constructors
    public User() {}
    
    public User(String username, String email, String password, UserType usertype) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.usertype = usertype;
    }
    
    // Getters and Setters
    public Long getUserid() { return userid; }
    public void setUserid(Long userid) { this.userid = userid; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public UserType getUsertype() { return usertype; }
    public void setUsertype(UserType usertype) { this.usertype = usertype; }
}