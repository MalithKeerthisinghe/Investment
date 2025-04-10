import axios from '../utils/api';

const API_URL = 'http://145.223.21.62:5021/api';

export const getAllUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    console.log('Users response:', response.data); // Log the response for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export default {getAllUsers,};