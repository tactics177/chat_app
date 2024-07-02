package com.chat.consumerservice.controller;

import com.chat.consumerservice.domain.Message;
import com.chat.consumerservice.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message sentMessage = messageService.saveMessage(message);
        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String userId) {
        List<Message> messages = messageService.getMessages(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getMessagesBySenderAndReceiver(@PathVariable String senderId, @PathVariable String receiverId) {
        List<Message> messages = messageService.getConversationMessages(senderId, receiverId);
        return ResponseEntity.ok(messages);
    }
}
