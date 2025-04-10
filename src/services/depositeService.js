import axios from '../utils/api'; // instead of 'axios'

// Get all deposits
export const getAllDeposits = async () => {
  try {
    const resps = await axios.get('/api/deposits');
    console.log('Deposits response:', resps.data); // Log the response for debugging
    return resps.data;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }
};

// Get pending deposits
export const getPendingDeposits = async () => {
  console.log('Fetching pending deposits...'); // Log the action for debugging
  console.log('axios instance:', axios); // Log the axios instance for debugging
  try {
    const resp = await axios.get('/deposits/pending');
    console.log('Pending deposits response:', resp.data); // Log the response for debugging
    console.log('Pending deposits response:', resp.data); // Log the response for debugging
    
    return resp.data;
  } catch (error) {
    console.error('Error fetching pending deposits:', error);
    throw error;
  }
};

// Get deposit by ID
export const getDepositById = async (depositId) => {
  try {
    const resp = await axios.get(`/api/deposits/${depositId}`);
    console.log(`Deposit ${depositId} response:`, resp.data); // Log the response for debugging
    return resp.data;
  } catch (error) {
    console.error(`Error fetching deposit with ID ${depositId}:`, error);
    throw error;
  }
};

// Update deposit status
export const updateDepositStatus = async (depositId, status) => {
  try {
    const resp = await axios.put(`/api/deposits/${depositId}/status`, { status });
    return resp.data;
  } catch (error) {
    console.error(`Error updating deposit status for ID ${depositId}:`, error);
    throw error;
  }
};

// Add new deposit
export const addDeposit = async (depositData) => {
  try {
    const resp = await axios.post('/api/deposits', depositData);
    return resp.data;
  } catch (error) {
    console.error('Error adding new deposit:', error);
    throw error;
  }
};

export default {
  getAllDeposits,
  getPendingDeposits,
  getDepositById,
  updateDepositStatus,
  addDeposit
};
