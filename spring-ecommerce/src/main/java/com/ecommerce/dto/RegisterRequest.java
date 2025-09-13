package com.ecommerce.dto;

import com.ecommerce.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
    @NotBlank
    private String username;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    private User.UserType usertype;
    
    public RegisterRequest() {}
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public User.UserType getUsertype() { return usertype; }
    public void setUsertype(User.UserType usertype) { this.usertype = usertype; }
}