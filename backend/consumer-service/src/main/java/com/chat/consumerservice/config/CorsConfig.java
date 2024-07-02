package com.chat.consumerservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class to define global CORS configuration.
 * This class implements a CORS policy that allows specific HTTP methods and headers
 * for cross-origin requests from a defined origin.
 */
@Configuration
public class CorsConfig {

    /**
     * Configures CORS mapping for the application.
     *
     * @return A {@link WebMvcConfigurer} with CORS configuration applied.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
