import axios from 'axios';
import { Message } from '../types/message';

const API_URL_CONSUMER = 'http://localhost:8080';
const API_URL_PRODUCER = 'http://localhost:9091';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL_CONSUMER}/api/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Invalid username or password');
  }
};

export const signup = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL_CONSUMER}/users`, { username, email, password });
    return response.data;
  } catch (error) {
    throw new Error('Username or Email already exists');
  }
};

export const getUserByUsername = async (username: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL_CONSUMER}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL_CONSUMER}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
};

export const getMessages = async (senderId: string, receiverId: string, token: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL_CONSUMER}/messages/${senderId}/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages', error);
    throw error;
  }
};

export const sendMessage = async (message: Message, token: string): Promise<Message> => {
  try {
    const response = await axios.post(`${API_URL_PRODUCER}/messages`, message, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message', error);
    throw error;
  }
};
