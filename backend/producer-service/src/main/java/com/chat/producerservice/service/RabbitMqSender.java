package com.chat.producerservice.service;

import com.chat.producerservice.domain.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Date;

/**
 * This class is responsible for sending messages to RabbitMQ.
 */
@Service
public class RabbitMqSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void send(Message message) {
        try {
            message.setTimestamp(new Date()); // Set the timestamp
            String jsonString = objectMapper.writeValueAsString(message);
            MessageProperties messageProperties = new MessageProperties();
            messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
            org.springframework.amqp.core.Message amqpMessage = new org.springframework.amqp.core.Message(jsonString.getBytes(), messageProperties);
            rabbitTemplate.send("user.exchange", "user.routingkey", amqpMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
