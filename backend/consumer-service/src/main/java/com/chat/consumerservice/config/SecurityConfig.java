package com.chat.consumerservice.config;

import com.chat.consumerservice.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import java.util.Collections;

/**
 * Security configuration class for the application.
 * This class configures Spring Security to handle user authentication and authorization,
 * CSRF protection, and custom JWT filter integration.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security filter chain that applies to all HTTP requests.
     * This method sets up authorization rules, form login, HTTP basic authentication,
     * logout behavior, CSRF protection, and adds a custom JWT request filter.
     *
     * @param http The {@link HttpSecurity} to configure.
     * @param jwtRequestFilter The custom JWT request filter to be added to the security chain.
     * @return The configured {@link SecurityFilterChain}.
     * @throws Exception if an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/login", "/users/**", "/ws/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(AbstractHttpConfigurer::disable
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(LogoutConfigurer::permitAll)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/users/**", "/api/login", "/ws/**")
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates an {@link AuthenticationManager} bean to manage authentication.
     * This method configures a {@link DaoAuthenticationProvider} with a custom user details service
     * and password encoder.
     *
     * @param userDetailsService The user details service for loading user-specific data.
     * @param passwordEncoder The encoder for hashing and verifying passwords.
     * @return The configured {@link AuthenticationManager}.
     */
    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(Collections.singletonList(authProvider));
    }

    /**
     * Defines a custom {@link UserDetailsService} bean to load user-specific data.
     * This service is used by the authentication provider to fetch user details during authentication.
     *
     * @return The custom {@link UserDetailsService}.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    /**
     * Creates a {@link PasswordEncoder} bean that uses BCrypt hashing for password encoding.
     * This encoder is used for hashing passwords during registration and verifying passwords during authentication.
     *
     * @return The {@link BCryptPasswordEncoder} instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
