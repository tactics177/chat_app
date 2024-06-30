package com.chat.producerservice.controller;

import com.chat.producerservice.domain.Message;
import com.chat.producerservice.service.RabbitMqSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private RabbitMqSender rabbitMqSender;

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {
        rabbitMqSender.send(message);
        return ResponseEntity.ok("Message sent successfully");
    }
}
