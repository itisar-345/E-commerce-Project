package com.ecommerce.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default configuration - 10 minutes TTL
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeValuesWith(
                    RedisSerializationContext.SerializationPair.fromSerializer(
                        new GenericJackson2JsonRedisSerializer()
                    )
                )
                .disableCachingNullValues();
        
        // Tiered expiration strategy
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Product list - 5 minutes (frequently changing with stock updates)
        cacheConfigurations.put("products", 
            defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Individual product - 30 minutes (static content like description, images)
        cacheConfigurations.put("product", 
            defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // Wishlist - 15 minutes (user-specific, moderate change frequency)
        cacheConfigurations.put("wishlist", 
            defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Cart - 10 minutes (user-specific, frequently updated)
        cacheConfigurations.put("cart", 
            defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware() // Ensures cache operations are part of transactions
                .build();
    }
}
