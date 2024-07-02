package com.chat.consumerservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for RabbitMQ.
 * Defines beans for queue, exchange, and bindings necessary for RabbitMQ messaging.
 * Also configures connection factory and message converter for JSON message format.
 */
@Configuration
public class RabbitMQConfig {

    // Queue name loaded from application properties
    @Value("${spring.rabbitmq.queue}")
    private String queue;

    // Exchange name loaded from application properties
    @Value("${spring.rabbitmq.exchange}")
    private String exchange;

    // Routing key loaded from application properties
    @Value("${spring.rabbitmq.routingkey}")
    private String routingKey;

    // RabbitMQ username loaded from application properties
    @Value("${spring.rabbitmq.username}")
    private String username;

    // RabbitMQ password loaded from application properties
    @Value("${spring.rabbitmq.password}")
    private String password;

    // RabbitMQ host loaded from application properties
    @Value("${spring.rabbitmq.host}")
    private String host;

    /**
     * Defines a bean for the queue.
     * @return A durable queue with the name specified in application properties.
     */
    @Bean
    Queue queue() {
        return new Queue(queue, true);
    }

    /**
     * Defines a bean for the exchange.
     * @return A durable direct exchange with the name specified in application properties.
     */
    @Bean
    Exchange myExchange() {
        return ExchangeBuilder.directExchange(exchange).durable(true).build();
    }

    /**
     * Defines a bean for the binding between queue and exchange using the routing key.
     * @return A binding object that links the queue and exchange with the routing key.
     */
    @Bean
    Binding binding() {
        return BindingBuilder
                .bind(queue())
                .to(myExchange())
                .with(routingKey)
                .noargs();
    }

    /**
     * Defines a bean for the connection factory.
     * Configures the connection factory with RabbitMQ host, username, and password.
     * @return A connection factory configured for RabbitMQ access.
     */
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory(host);
        cachingConnectionFactory.setUsername(username);
        cachingConnectionFactory.setPassword(password);
        return cachingConnectionFactory;
    }

    /**
     * Defines a bean for the message converter.
     * @return A message converter that serializes and deserializes messages to and from JSON format.
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * Configures the RabbitTemplate with the custom connection factory and JSON message converter.
     * @param connectionFactory The connection factory bean configured for RabbitMQ access.
     * @return A RabbitTemplate configured for sending messages with JSON format.
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
