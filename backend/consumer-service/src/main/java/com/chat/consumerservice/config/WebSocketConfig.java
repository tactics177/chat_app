package com.chat.consumerservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuration class for WebSocket messaging.
 * Enables WebSocket message brokering through STOMP (Simple Text Oriented Messaging Protocol).
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configures the message broker for WebSocket communication.
     * Defines "/topic" as the prefix for destinations that will be routed to the message broker.
     * Sets "/app" as the prefix for filtering destinations targeted to methods annotated with @MessageMapping.
     *
     * @param config Configuration for the message broker.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Registers STOMP endpoints mapping each to a specific URL and enabling SockJS fallback options.
     * Allows cross-origin requests from "http://localhost:3000".
     *
     * @param registry The registry for STOMP endpoints.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }
}
