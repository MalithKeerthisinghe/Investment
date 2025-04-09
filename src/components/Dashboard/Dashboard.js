
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { depositService, withdrawalService, userService } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalUsers: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch pending deposits
        const depositRes = await depositService.getPendingDeposits();
        const pendingDeposits = depositRes.data.pendingDeposits.length;
        
        // Fetch pending withdrawals
        const withdrawalRes = await withdrawalService.getPendingWithdrawals();
        const pendingWithdrawals = withdrawalRes.data.pendingWithdrawals.length;
        
        // Fetch users (assuming an endpoint exists)
        // Note: The backend code didn't have a specific endpoint for getting all users
        // You might need to create one or adapt this code
        let totalUsers = 0;
        try {
          const userRes = await userService.getAllUsers();
          totalUsers = userRes.data.users.length;
        } catch (error) {
          console.error('Error fetching users:', error);
          totalUsers = 0;
        }
        
        setStats({
          pendingDeposits,
          pendingWithdrawals,
          totalUsers,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    fetchDashboardStats();
  }, []);

  const StatCard = ({ title, value, link, color }) => (
    <Col md={4}>
      <Link to={link} style={{ textDecoration: 'none' }}>
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="text-muted">{title}</Card.Title>
            <div className={`display-4 font-weight-bold text-${color}`}>{value}</div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <StatCard
          title="Pending Deposits"
          value={stats.isLoading ? '...' : stats.pendingDeposits}
          link="/deposits/pending"
          color="primary"
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.isLoading ? '...' : stats.pendingWithdrawals}
          link="/withdrawals/pending"
          color="warning"
        />
        <StatCard
          title="Total Users"
          value={stats.isLoading ? '...' : stats.totalUsers}
          link="/users"
          color="success"
        />
      </Row>
    </div>
  );
};

export default Dashboard;