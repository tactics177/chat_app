package com.chat.consumerservice.repository;

import com.chat.consumerservice.domain.Message;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdOrReceiverId(String senderId, String receiverId);
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId, Sort sort);
}
