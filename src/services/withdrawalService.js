
import api from './api';

const withdrawalService = {
  getAllWithdrawals: () => api.get('/withdrawals'),
  getPendingWithdrawals: () => api.get('/withdrawals/pending'),
  getUserWithdrawals: (userId) => api.get(`/users/${userId}/withdrawals`),
  getWithdrawalById: (id) => api.get(`/withdrawals/${id}`),
  updateWithdrawalStatus: (withdrawalId, isPending) => api.patch(`/withdrawals/${withdrawalId}/status`, { isPending }),
  deleteWithdrawal: (withdrawalId) => api.delete(`/withdrawals/${withdrawalId}`),
};

export default withdrawalService;