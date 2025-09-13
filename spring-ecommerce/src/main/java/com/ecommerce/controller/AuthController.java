package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}