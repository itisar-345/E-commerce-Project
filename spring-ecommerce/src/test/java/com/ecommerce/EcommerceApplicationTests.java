package com.ecommerce;

import com.ecommerce.service.RedisCartService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
class EcommerceApplicationTests {

	@MockBean
	private RedisTemplate<String, Object> redisTemplate;

	@MockBean
	private RedisCartService redisCartService;

	@Test
	void contextLoads() {
	}

}