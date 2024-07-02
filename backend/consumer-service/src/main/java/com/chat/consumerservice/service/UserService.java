package com.chat.consumerservice.service;

import com.chat.consumerservice.domain.User;
import com.chat.consumerservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> saveUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return Optional.empty(); // Username already exists
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return Optional.empty(); // Email already exists
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return Optional.of(userRepository.save(user));
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
