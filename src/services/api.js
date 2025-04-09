
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service for deposits
export const depositService = {
  getAllDeposits: () => api.get('/deposits'),
  getPendingDeposits: () => api.get('/deposits/pending'),
  getUserDeposits: (userId) => api.get(`/users/${userId}/deposits`),
  updateDepositStatus: (depositId, isPending) => api.patch(`/deposits/${depositId}/status`, { isPending }),
};

// Service for withdrawals
export const withdrawalService = {
  getAllWithdrawals: () => api.get('/withdrawals'),
  getPendingWithdrawals: () => api.get('/withdrawals/pending'),
  getUserWithdrawals: (userId) => api.get(`/users/${userId}/withdrawals`),
  getWithdrawalById: (id) => api.get(`/withdrawals/${id}`),
  updateWithdrawalStatus: (withdrawalId, isPending) => api.patch(`/withdrawals/${withdrawalId}/status`, { isPending }),
  deleteWithdrawal: (withdrawalId) => api.delete(`/withdrawals/${withdrawalId}`),
};

// Service for users
export const userService = {
  getAllUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  getUserTransactions: (userId) => api.get(`/users/${userId}/transactions`),
};

export default api;