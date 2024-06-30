package com.chat.consumerservice.service;

import com.chat.consumerservice.domain.Message;
import com.chat.consumerservice.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        message.setTimestamp(new Date());
        return messageRepository.save(message);
    }

    public List<Message> getMessages(String userId) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }
}
