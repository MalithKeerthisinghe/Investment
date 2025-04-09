
import React, { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import userService from '../../services/userService';
import DataTable from '../common/DataTable';
import { formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // In a real implementation, call the actual endpoint
      const response = await userService.getAllUsers();
      if (response && response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        // For demo purposes if the API doesn't return the expected structure
        setError('Unable to retrieve user data. Using sample data instead.');
        // Set some dummy data
        setUsers([
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            nic_number: '1234567890',
            created_at: '2023-01-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            username: 'janesmith',
            nic_number: '0987654321',
            created_at: '2023-01-02T00:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Using sample data instead.');
      // Set some dummy data for demonstration purposes
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          nic_number: '1234567890',
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          username: 'janesmith',
          nic_number: '0987654321',
          created_at: '2023-01-02T00:00:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRowClick = (user) => {
    if (user && user.id) {
      navigate(`/users/${user.id}`);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.nic_number && user.nic_number.toLowerCase().includes(searchLower))
    );
  });
  
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (user) => user.name || 'N/A'
    },
    {
      key: 'email',
      title: 'Email',
      render: (user) => user.email || 'N/A'
    },
    {
      key: 'username',
      title: 'Username',
      render: (user) => user.username || 'N/A'
    },
    {
      key: 'nic_number',
      title: 'NIC Number',
      render: (user) => user.nic_number || 'N/A'
    },
    {
      key: 'created_at',
      title: 'Registration Date',
      render: (user) => user.created_at ? formatDate(user.created_at) : 'N/A',
    },
  ];
  
  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="mb-4">User Management</h2>
      
      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Card>
        <Card.Header>
          <Form>
            <InputGroup>
              <Form.Control
                placeholder="Search users by name, email, username, or NIC..."
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search users"
              />
              <Button 
                variant="outline-secondary"
                onClick={handleClearSearch}
                disabled={!searchTerm}
              >
                Clear
              </Button>
            </InputGroup>
          </Form>
        </Card.Header>
        <Card.Body>
          <DataTable
            columns={columns}
            data={filteredUsers}
            isLoading={false}
            onRowClick={handleRowClick}
            keyField="id"
          />
          
          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center my-4">
              <p className="text-muted">
                {searchTerm ? 'No users match your search criteria' : 'No users found in the system'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserList;