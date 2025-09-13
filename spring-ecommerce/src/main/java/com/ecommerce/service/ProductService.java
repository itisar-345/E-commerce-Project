package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    private final String uploadDir = "src/main/resources/static/images/";
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getProductsByVendor(User vendor) {
        return productRepository.findByVendor(vendor);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public Product createProduct(String name, BigDecimal price, String detail, 
                               MultipartFile image, User vendor) throws IOException {
        String imagePath = saveImage(image);
        
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDetail(detail);
        product.setImgpath(imagePath);
        product.setVendor(vendor);
        
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, String name, BigDecimal price, 
                               String detail, MultipartFile image) throws IOException {
        Product product = getProductById(id);
        
        product.setName(name);
        product.setPrice(price);
        product.setDetail(detail);
        
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            product.setImgpath(imagePath);
        }
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    private String saveImage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path path = Paths.get(uploadDir + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());
        return "/images/" + fileName;
    }
}