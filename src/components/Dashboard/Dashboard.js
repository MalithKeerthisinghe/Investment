import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { depositService, withdrawalService, userService } from '../../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PeopleIcon from '@mui/icons-material/People';
import './Dashboard.css';

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
        
        // Safely extract pending deposits count
        let pendingDeposits = 0;
        if (depositRes && depositRes.data) {
          if (Array.isArray(depositRes.data.pendingDeposits)) {
            pendingDeposits = depositRes.data.pendingDeposits.length;
          } else if (typeof depositRes.data.pendingDeposits === 'number') {
            pendingDeposits = depositRes.data.pendingDeposits;
          } else if (Array.isArray(depositRes.data)) {
            pendingDeposits = depositRes.data.filter(deposit => deposit.status === 'pending').length;
          } else if (depositRes.data.count !== undefined) {
            pendingDeposits = depositRes.data.count;
          }
        }
        
        // Fetch pending withdrawals
        const withdrawalRes = await withdrawalService.getPendingWithdrawals();
        const pendingWithdrawals = withdrawalRes.data.pendingWithdrawals.length;
        
        // Fetch total users
        let totalUsers = 0;
        try {
          const userRes = await userService.getAllUsers();
          
          // Process the response similar to how it's done in UserList component
          let usersArray = [];
          
          if (Array.isArray(userRes.data)) {
            usersArray = userRes.data;
          } else if (userRes.data && typeof userRes.data === 'object') {
            if (userRes.data.users && Array.isArray(userRes.data.users)) {
              usersArray = userRes.data.users;
            }
          }
          
          totalUsers = usersArray.length;
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

  const StatCard = ({ title, value, link, color, icon }) => (
    <Col md={4}>
      <Link to={link} style={{ textDecoration: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
          }}
        >
          <Card className={`stat-card mb-4 shadow-sm border-${color}`}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title className="text-muted">{title}</Card.Title>
                <div className={`display-4 font-weight-bold text-${color}`}>
                  {stats.isLoading ? (
                    <div className="stat-loader"></div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                      }}
                    >
                      {value}
                    </motion.span>
                  )}
                </div>
              </div>
              <div className={`stat-icon-container bg-${color} text-white`}>
                {icon}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Link>
    </Col>
  );

  return (
    <div>
      <motion.h2 
        className="mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h2>
      
      <Row>
        <StatCard
          title="Pending Deposits"
          value={stats.pendingDeposits}
          link="/deposits/pending"
          color="primary"
          icon={<AccountBalanceIcon fontSize="large" />}
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          link="/withdrawals/pending"
          color="warning"
          icon={<MoneyOffIcon fontSize="large" />}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          link="/users"
          color="success"
          icon={<PeopleIcon fontSize="large" />}
        />
      </Row>
    </div>
  );
};

export default Dashboard;