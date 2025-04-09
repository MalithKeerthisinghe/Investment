
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Layout
import Layout from './components/Layouts/Layout';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import PendingDeposits from './components/Deposits/PendingDeposites';
import DepositDetails from './components/Deposits/DepositeDetails';
import PendingWithdrawals from './components/Withdrawals/Pendingwithdrawals';
import WithdrawalDetails from './components/Withdrawals/withdrawalDetails';
import UserList from './components/Users/UserList';
import UserDetails from './components/Users/UserDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />
        
        {/* Deposits Routes */}
        <Route 
          path="/deposits/pending" 
          element={
            <Layout>
              <PendingDeposits />
            </Layout>
          } 
        />
        <Route 
          path="/deposits/:id" 
          element={
            <Layout>
              <DepositDetails />
            </Layout>
          } 
        />
        
        {/* Withdrawals Routes */}
        <Route 
          path="/withdrawals/pending" 
          element={
            <Layout>
              <PendingWithdrawals />
            </Layout>
          } 
        />
        <Route 
          path="/withdrawals/:id" 
          element={
            <Layout>
              <WithdrawalDetails />
            </Layout>
          } 
        />
        
        {/* Users Routes */}
        <Route 
          path="/users" 
          element={
            <Layout>
              <UserList />
            </Layout>
          } 
        />
        <Route 
          path="/users/:id" 
          element={
            <Layout>
              <UserDetails />
            </Layout>
          } 
        />
        
        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;