package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    
    @Value("${DB_USERNAME:root}")
    private String dbUsername;
    
    @Value("${DB_PASSWORD:password}")
    private String dbPassword;
    
    @Value("${JWT_SECRET:defaultSecret}")
    private String jwtSecret;
    
    public void printConfig() {
        System.out.println("DB_USERNAME: " + dbUsername);
        System.out.println("DB_PASSWORD: " + (dbPassword.equals("password") ? "DEFAULT" : "FROM_ENV"));
        System.out.println("JWT_SECRET: " + (jwtSecret.equals("defaultSecret") ? "DEFAULT" : "FROM_ENV"));
    }
}