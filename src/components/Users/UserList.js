import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../common/DataTable';
import { formatDate } from '../../utils/formatters';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await axios.get('http://151.106.125.212:5021/api/users', {
        withCredentials: false,
      });

      let usersData = [];

      if (response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          usersData = response.data.users;
        }
      }

      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (user) => {
    if (user?.id) {
      navigate(`/users/${user.id}`);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'username', label: 'Username' },
    { key: 'nic_number', label: 'NIC Number' },
    {
      key: 'created_at',
      label: 'Registration Date',
      render: (value) => (value ? formatDate(value) : 'N/A'),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        User Management
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Total Users Card */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Users
            </Typography>
            <Typography variant="h5">{users.length}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          title="All Users"
          columns={columns}
          data={users}
          onRowClick={handleRowClick}
          searchPlaceholder="Search by name, email, username or NIC..."
        />
      )}
    </Box>
  );
};

export default UserList;
