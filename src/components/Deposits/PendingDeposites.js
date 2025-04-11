import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from '../common/DataTable';
import {
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';

const PendingDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(null); // 'approve' | 'reject' | null

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://145.223.21.62:5021/api/deposits/pending', {
        withCredentials: false,
      });

      let depositsArray = [];

      if (Array.isArray(response.data)) {
        depositsArray = response.data;
      } else if (response.data?.pendingDeposits && Array.isArray(response.data.pendingDeposits)) {
        depositsArray = response.data.pendingDeposits;
      }

      setDeposits(Array.isArray(depositsArray) ? depositsArray : []);
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError('Failed to load deposits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedDeposit || !confirmOpen) return;

    // Updated payload structure to match backend expectations
    // isPending: true means the deposit is still pending (rejected)
    // isPending: false means the deposit is approved
    const payload = {
      isPending: confirmOpen === 'reject'
    };

    try {
      console.log(`${confirmOpen === 'approve' ? 'Approving' : 'Rejecting'} deposit ${selectedDeposit.id}`, payload);
      
      const response = await axios.patch(
        `http://145.223.21.62:5021/api/deposits/${selectedDeposit.id}/status`,
        payload,
        { withCredentials: false }
      );
      
      console.log('Response:', response.data);
      fetchDeposits();
    } catch (err) {
      console.error(`Failed to ${confirmOpen} deposit:`, err);
      
      // Add more detailed error logging
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
    } finally {
      setConfirmOpen(null);
      setSelectedDeposit(null);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', minWidth: 80 },
    { key: 'transaction_id', label: 'Transaction ID', minWidth: 150 },
    { key: 'username', label: 'Username', minWidth: 120 },
    {
      key: 'amount',
      label: 'Amount',
      minWidth: 100,
      render: (value) => `$${parseFloat(value).toFixed(2)}`
    },
    {
      key: 'created_at',
      label: 'Date',
      minWidth: 150,
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'image_path',
      label: 'Receipt',
      minWidth: 100,
      render: (value) =>
        value ? (
          <a
            href={`http://145.223.21.62:5021/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2196f3', textDecoration: 'underline' }}
          >
            View
          </a>
        ) : (
          'No receipt'
        )
    },
    {
      key: 'actions',
      label: 'Actions',
      minWidth: 200,
      render: (_, row) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDeposit(row);
              setConfirmOpen('approve');
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDeposit(row);
              setConfirmOpen('reject');
            }}
          >
            Reject
          </Button>
        </Box>
      )
    }
  ];

  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchDeposits}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <DataTable
        title="Pending Deposits"
        columns={columns}
        data={deposits}
        isLoading={loading}
        searchEnabled={true}
        searchPlaceholder="Search deposits..."
        onRowClick={(row) => {
          console.log('Row clicked:', row);
        }}
      />

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmOpen} onClose={() => setConfirmOpen(null)}>
        <DialogTitle>
          {confirmOpen === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmOpen} this deposit
            {selectedDeposit ? ` (ID: ${selectedDeposit.id})?` : '?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(null)}>Cancel</Button>
          <Button
            variant="contained"
            color={confirmOpen === 'approve' ? 'success' : 'error'}
            onClick={handleConfirmAction}
          >
            {confirmOpen === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingDeposits;