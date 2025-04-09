
import api from './api';

const userService = {
  getAllUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  getUserTransactions: (userId) => api.get(`/users/${userId}/transactions`),
  resetUserPassword: (userId, newPassword) => api.patch(`/users/${userId}/reset-password`, { newPassword }),
};

export default userService;