package com.ecommerce.repository;

import com.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductPid(Long pid);
    Optional<Review> findByUserUseridAndProductPid(Long userid, Long pid);
    boolean existsByUserUseridAndProductPid(Long userid, Long pid);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.pid = :pid")
    Double getAverageRatingByProductId(Long pid);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.pid = :pid")
    Long getReviewCountByProductId(Long pid);
}
