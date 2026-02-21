package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    private final String uploadDir = "src/main/resources/static/images/";
    
    @Cacheable("products")
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(this::populateRatingData);
        return products;
    }
    
    public Page<Product> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        products.forEach(this::populateRatingData);
        return products;
    }
    
    public List<Product> getProductsByVendor(User vendor) {
        return productRepository.findByVendor(vendor);
    }
    
    @Cacheable(value = "product", key = "#id")
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        populateRatingData(product);
        return product;
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public Product createProduct(String name, BigDecimal price, String detail, 
                               MultipartFile image, User vendor, Integer stock, String sizes) throws IOException {
        String imagePath = saveImage(image);
        
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDetail(detail);
        product.setImgpath(imagePath);
        product.setVendor(vendor);
        product.setStock(stock != null ? stock : 0);
        product.setSizes(sizes);
        
        return productRepository.save(product);
    }
    
    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public Product updateProduct(Long id, String name, BigDecimal price, 
                               String detail, MultipartFile image, Integer stock, String sizes) throws IOException {
        Product product = getProductById(id);
        
        product.setName(name);
        product.setPrice(price);
        product.setDetail(detail);
        if (stock != null) product.setStock(stock);
        if (sizes != null) product.setSizes(sizes);
        
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            product.setImgpath(imagePath);
        }
        
        return productRepository.save(product);
    }
    
    @CacheEvict(value = {"products", "product"}, allEntries = true)
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
    
    private void populateRatingData(Product product) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getPid());
        Long reviewCount = reviewRepository.getReviewCountByProductId(product.getPid());
        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setReviewCount(reviewCount != null ? reviewCount : 0L);
    }
}