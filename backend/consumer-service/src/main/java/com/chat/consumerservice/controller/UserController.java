package com.chat.consumerservice.controller;

import com.chat.consumerservice.domain.User;
import com.chat.consumerservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        Optional<User> createdUser = userService.saveUser(user);
        if (createdUser.isPresent()) {
            return ResponseEntity.ok(createdUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username or Email already exists");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<User> getUserByUserId(@PathVariable String userId) {
        return userService.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // get all users
    @GetMapping
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
