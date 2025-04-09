import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import withdrawalService from '../../services/withdrawalService';
import DataTable from '../common/DataTable';
import ConfirmationModal from '../common/ConfirmationModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { getPendingWithdrawals, updateWithdrawalStatus } from '../../services/withdrawalService';

const PendingWithdrawals = () => {
  const navigate = useNavigate();
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  
  const fetchPendingWithdrawals = async () => {
    try {
      setIsLoading(true);
      const response = await getPendingWithdrawals();
      
      // The change is here - match the backend response structure
      setPendingWithdrawals(response.pendingWithdrawals || []);

       // For debugging - log the response to see its structure
       console.log('Pending withdrawals response:', response);
    } catch (error) {
      console.error('Error fetching pending withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);
  
  const handleRowClick = (withdrawal) => {
    navigate(`/withdrawals/${withdrawal.id}`);
  };
  
  const handleConfirmAction = (withdrawal, type) => {
    setSelectedWithdrawal(withdrawal);
    setActionType(type);
    setShowConfirmModal(true);
  };
  
  const handleApproveReject = async () => {
    try {
      const isPending = actionType === 'reject'; // true for pending/reject, false for approve
      await updateWithdrawalStatus(selectedWithdrawal.id, isPending);
      
      // Refresh the list
      fetchPendingWithdrawals();
      setShowConfirmModal(false);
    } catch (error) {
      console.error(`Error ${actionType === 'approve' ? 'approving' : 'rejecting'} withdrawal:`, error);
    }
  };
  
  const columns = [
    {
      key: 'transaction_id',
      title: 'Transaction ID',
    },
    {
      key: 'username',
      title: 'User',
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (withdrawal) => formatCurrency(withdrawal.amount),
    },
    {
      key: 'account_holder_name',
      title: 'Account Holder',
    },
    {
      key: 'bank_name',
      title: 'Bank',
    },
    {
      key: 'created_at',
      title: 'Date',
      render: (withdrawal) => formatDate(withdrawal.created_at),
    },
  ];
  
  const actionColumn = (withdrawal) => (
    <div className="d-flex gap-2">
      <Button 
        variant="success" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmAction(withdrawal, 'approve');
        }}
      >
        Approve
      </Button>
      <Button 
        variant="danger" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmAction(withdrawal, 'reject');
        }}
      >
        Reject
      </Button>
    </div>
  );
  
  return (
    <div>
      <h2 className="mb-4">Pending Withdrawals</h2>
      
      <Card>
        <Card.Body>
          <DataTable
            columns={columns}
            data={pendingWithdrawals}
            isLoading={isLoading}
            actionColumn={actionColumn}
            onRowClick={handleRowClick}
          />
        </Card.Body>
      </Card>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleApproveReject}
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Withdrawal`}
        message={`Are you sure you want to ${actionType} this withdrawal of ${selectedWithdrawal?.amount && formatCurrency(selectedWithdrawal.amount)} for ${selectedWithdrawal?.username}?`}
        confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
      />
    </div>
  );
};

export default PendingWithdrawals;