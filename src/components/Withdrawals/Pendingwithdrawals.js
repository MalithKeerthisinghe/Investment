// PendingWithdrawals.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getPendingWithdrawals, updateWithdrawalStatus } from '../../services/withdrawalService';
import DataTable from '../common/DataTable';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PendingWithdrawals = () => {
    const navigate = useNavigate();
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(null); // 'approve' | 'reject' | null

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getPendingWithdrawals();

            let withdrawalsArray = [];

            if (Array.isArray(response)) {
                withdrawalsArray = response;
            } else if (response?.pendingWithdrawals && Array.isArray(response.pendingWithdrawals)) {
                withdrawalsArray = response.pendingWithdrawals;
            }

            console.log('Fetched withdrawals:', withdrawalsArray);
            setWithdrawals(Array.isArray(withdrawalsArray) ? withdrawalsArray : []);
        } catch (err) {
            console.error('Error fetching withdrawals:', err);
            setError('Failed to load withdrawals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!selectedWithdrawal || !confirmOpen) return;

        const isPending = confirmOpen === 'reject';

        try {
            console.log(`${confirmOpen === 'approve' ? 'Approving' : 'Rejecting'} withdrawal ${selectedWithdrawal.id}`);

            await updateWithdrawalStatus(selectedWithdrawal.id, isPending);

            fetchWithdrawals();

            alert(`Withdrawal ${confirmOpen === 'approve' ? 'approved' : 'rejected'} successfully!`);
        } catch (err) {
            console.error(`Failed to ${confirmOpen} withdrawal:`, err);

            if (err.response) {
                console.error("Response data:", err.response.data);
                console.error("Response status:", err.response.status);

                const errorMsg = err.response?.data?.error
                    ? `${err.response.data.message}: ${err.response.data.error}`
                    : err.response?.data?.message || 'Failed to update withdrawal status';

                alert(`Error: ${errorMsg}`);
            } else {
                alert('Network error. Please try again.');
            }
        } finally {
            setConfirmOpen(null);
            setSelectedWithdrawal(null);
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
            render: (withdrawal) => formatCurrency(withdrawal.amount)
        },
        {
            key: 'created_at',
            label: 'Date',
            minWidth: 150,
            render: (withdrawal) => formatDate(withdrawal.created_at)
        },
        {
            key: 'account_holder_name',
            label: 'Account Holder',
            minWidth: 150
        },
        {
            key: 'bank_name',
            label: 'Bank Name',
            minWidth: 150
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
                            setSelectedWithdrawal(row);
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
                            setSelectedWithdrawal(row);
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
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Pending Withdrawals</Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <DataTable columns={columns} data={withdrawals} />

                    <Dialog
                        open={!!confirmOpen}
                        onClose={() => setConfirmOpen(null)}
                    >
                        <DialogTitle>{`Confirm ${confirmOpen === 'approve' ? 'Approval' : 'Rejection'}`}</DialogTitle>
                        <DialogContent>
                            <Typography>
                                {`Are you sure you want to ${confirmOpen} this withdrawal?`}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setConfirmOpen(null)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmAction} color={confirmOpen === 'approve' ? "success" : "error"} variant="contained">
                                {confirmOpen === 'approve' ? 'Approve' : 'Reject'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default PendingWithdrawals;
