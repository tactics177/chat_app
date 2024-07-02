import axios from 'axios';

const API_URL_CONSUMER = 'http://localhost:8080';
const userCache: { [key: string]: string } = {}; // Cache for storing userId -> username mappings

export const getUsernameById = async (userId: string, token: string): Promise<string> => {
  if (userCache[userId]) {
    return userCache[userId];
  }

  try {
    const response = await axios.get(`${API_URL_CONSUMER}/users/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const username = response.data.username;
    userCache[userId] = username;
    return username;
  } catch (error) {
    console.error('Error fetching username', error);
    return userId; // Fallback to userId if there's an error
  }
};
