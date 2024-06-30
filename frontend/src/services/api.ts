import axios from 'axios';
import { Message } from '../types/message';

const API_URL_CONSUMER = 'http://localhost:8080';
const API_URL_PRODUCER = 'http://localhost:9091';

export const getMessages = async (userId: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL_CONSUMER}/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages', error);
    throw error;
  }
};

export const sendMessage = async (message: Message): Promise<Message> => {
  try {
    const response = await axios.post(`${API_URL_PRODUCER}/messages`, message);
    return response.data;
  } catch (error) {
    console.error('Error sending message', error);
    throw error;
  }
};
