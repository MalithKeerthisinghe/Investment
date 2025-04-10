import React, { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup, Alert, Spinner, Row, Col } from 'react-bootstrap';
import DataTable from '../common/DataTable';
import { formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('http://145.223.21.62:5021/api/users', {
        withCredentials: false,
      });
      
      // We know the API returns { users: [...] }
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        setError('Unexpected data format from server');
        setUsers([]);
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
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
      render: (row) => row.name || 'N/A'
    },
    {
      key: 'email',
      title: 'Email',
      render: (row) => row.email || 'N/A'
    },
    {
      key: 'username',
      title: 'Username',
      render: (row) => row.username || 'N/A'
    },
    {
      key: 'nic_number',
      title: 'NIC Number',
      render: (row) => row.nic_number || 'N/A'
    },
    {
      key: 'created_at',
      title: 'Registration Date',
      render: (row) => row.created_at ? formatDate(row.created_at) : 'N/A',
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
      
      {/* User Stats Card */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center bg-light">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Users</h6>
              <h3>{users.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            {searchTerm 
              ? `Showing ${filteredUsers.length} of ${users.length} users`
              : `All Users`}
          </span>
          <Form className="d-flex justify-content-end">
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