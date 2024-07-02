package com.chat.consumerservice.controller;

import com.chat.consumerservice.domain.User;
import com.chat.consumerservice.service.UserService;
import com.chat.consumerservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService; // Assuming you have a UserService to fetch user details

    @PostMapping("/api/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails.getUsername());

            // Fetch user ID based on the username
            User user = userService.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("username", userDetails.getUsername());
            response.put("userId", user.getId()); // Include user ID in the response
            response.put("token", jwt);
            return response;
        } catch (AuthenticationException e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Invalid username or password");
            return response;
        }
    }
}
