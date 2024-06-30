package com.chat.producerservice.service;

import com.chat.producerservice.domain.User;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RabbitMqSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void send(User user) {
        try {
            String jsonString = objectMapper.writeValueAsString(user);
            MessageProperties messageProperties = new MessageProperties();
            messageProperties.setContentType(MessageProperties.CONTENT_TYPE_JSON);
            Message message = new Message(jsonString.getBytes(), messageProperties);
            rabbitTemplate.send("user.exchange", "user.routingkey", message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
