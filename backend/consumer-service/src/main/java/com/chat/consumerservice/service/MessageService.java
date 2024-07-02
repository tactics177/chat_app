package com.chat.consumerservice.service;

import com.chat.consumerservice.domain.Message;
import com.chat.consumerservice.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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

    public List<Message> getConversationMessages(String user1Id, String user2Id) {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt"); // Ensure "createdAt" is the correct field name
        List<Message> messages1 = messageRepository.findBySenderIdAndReceiverId(user1Id, user2Id, sort);
        List<Message> messages2 = messageRepository.findBySenderIdAndReceiverId(user2Id, user1Id, sort);
        messages1.addAll(messages2);

        // Sort the combined list
        messages1.sort(Comparator.comparing(Message::getTimestamp));

        return messages1;
    }
}
