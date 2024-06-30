import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws'; // Consumer-Service WebSocket URL

let stompClient: Client | null = null;
let isSubscribed = false; // Flag to ensure single subscription

export const connect = (onMessageReceived: (message: any) => void) => {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        if (!isSubscribed) {
          stompClient?.subscribe('/topic/messages', (message) => {
            onMessageReceived(JSON.parse(message.body));
          });
          isSubscribed = true; // Set the flag to true after subscribing
        }
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        isSubscribed = false; // Reset the flag on disconnect
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    stompClient.activate();
  }
};

export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isSubscribed = false; // Reset the flag on disconnect
  }
};
