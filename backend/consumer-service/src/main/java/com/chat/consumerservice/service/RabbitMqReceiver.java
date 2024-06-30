package com.chat.consumerservice.service;

import com.chat.consumerservice.domain.Message;
import com.chat.consumerservice.repository.MessageRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class RabbitMqReceiver {

    @Autowired
    private MessageRepository messageRepository;

    @RabbitListener(queues = "${spring.rabbitmq.queue}")
    public void receivedMessage(Message message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(new Date()); // Set the timestamp if not already set
        }
        messageRepository.save(message);
        System.out.println("Received and saved message: " + message);
    }
}
