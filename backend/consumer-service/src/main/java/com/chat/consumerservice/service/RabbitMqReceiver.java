package com.chat.consumerservice.service;

import com.chat.consumerservice.domain.Message;
import com.chat.consumerservice.repository.MessageRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Service class for receiving messages from RabbitMQ and broadcasting them via WebSocket.
 * This class listens for messages on a RabbitMQ queue, saves them to a repository,
 * and then broadcasts the messages to WebSocket subscribers.
 */
@Service
public class RabbitMqReceiver {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Listens for messages on the configured RabbitMQ queue.
     * Upon receiving a message, it sets the current timestamp if not already set,
     * saves the message to the repository, and broadcasts it to WebSocket subscribers.
     *
     * @param message The message received from RabbitMQ.
     */
    @RabbitListener(queues = "${spring.rabbitmq.queue}")
    public void receivedMessage(Message message) {
        if (message.getTimestamp() == null) {
            message.setTimestamp(new Date()); // Set the timestamp if not already set
        }
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/messages", message); // Broadcast via WebSocket
        System.out.println("Received and saved message: " + message);
    }
}
