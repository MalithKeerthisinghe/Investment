import axios from '../utils/api'; // Custom axios instance

// Get all deposits
export const getAllDeposits = async () => {
  try {
    const resps = await axios.get('/api/deposits');
    console.log('Deposits response:', resps.data);
    return resps.data;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }
};

// Get pending deposits
export const getPendingDeposits = async () => {
  console.log('Fetching pending deposits...');
  try {
    // Make sure to use the correct API path
    const resp = await axios.get('/api/deposits/pending');
    console.log('Pending deposits response:', resp.data);
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
    console.log(`Deposit ${depositId} response:`, resp.data);
    return resp.data;
  } catch (error) {
    console.error(`Error fetching deposit with ID ${depositId}:`, error);
    throw error;
  }
};

// Update deposit status
export const updateDepositStatus = async (depositId, isPending) => {
  try {
    console.log(`Updating deposit ${depositId}, isPending:`, isPending);
    
    // Send only the isPending flag as expected by the backend
    const resp = await axios.patch(`/api/deposits/${depositId}/status`, {
      isPending
    });
    
    console.log(`Deposit ${depositId} status updated:`, resp.data);
    return resp.data;
  } catch (error) {
    console.error(`Error updating deposit status for ID ${depositId}:`, error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
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