// package com.example.fannation;

// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication
// public class FanNationApplication {
// 	public static void main(String[] args) {
// 		SpringApplication.run(FanNationApplication.class, args);
// 	}
// }

package com.example.fannation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class FanNationApplication {
	public static void main(String[] args) {
		SpringApplication.run(FanNationApplication.class, args);
	}

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true); // Allow cookies/credentials if needed
		config.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow your frontend origin
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow necessary HTTP
																							// methods
		config.setAllowedHeaders(Arrays.asList("*")); // Allow all headers
		config.setExposedHeaders(Arrays.asList("Authorization")); // Expose headers if needed
		source.registerCorsConfiguration("/**", config); // Apply to all endpoints
		return new CorsFilter(source);
	}
}