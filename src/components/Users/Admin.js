import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FiUser, FiDollarSign, FiTrendingUp, FiActivity, FiClock } from 'react-icons/fi';

// Styled components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2d3748;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2.5rem;
  overflow: hidden;
  border: 1px solid #edf2f7;
`;

const Title = styled.h1`
  color: #1a202c;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Subtitle = styled.h3`
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-weight: 600;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    background-color: white;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 2.6rem;
  color: #a0aec0;
`;

const Button = styled(motion.button)`
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 1rem;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:disabled {
    background-color: #cbd5e0;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #e2e8f0;
  color: #4a5568;
  
  &:hover {
    background-color: #cbd5e0;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
`;

const ListItem = styled(motion.li)`
  background: #f8fafc;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9375rem;
`;

const ListItemDate = styled.span`
  color: #718096;
  font-size: 0.8125rem;
`;

const ListItemValue = styled.span`
  font-weight: 600;
  color: #2d3748;
`;

const Divider = styled(motion.hr)`
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 2rem 0;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Admin = () => {
  const [depositData, setDepositData] = useState({ userId: '', amount: '', coin: '' });
  const [coinValueData, setCoinValueData] = useState({ coin: '', value: '' });
  const [coinHistory, setCoinHistory] = useState([]);
  const [commissionData, setCommissionData] = useState({ userId: '' });
  const [commissionHistory, setCommissionHistory] = useState([]);
  const [loading, setLoading] = useState({
    deposit: false,
    coinValue: false,
    coinHistory: false,
    commissionHistory: false
  });

  const handleCreateDeposit = async () => {
    setLoading({...loading, deposit: true});
    try {
      await axios.post('/admin/deposit', depositData);
      toast.success('Deposit created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setDepositData({ userId: '', amount: '', coin: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating deposit', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading({...loading, deposit: false});
    }
  };

  const handleSetCoinValue = async () => {
    setLoading({...loading, coinValue: true});
    try {
      await axios.post('/coin/set-value', coinValueData);
      toast.success('Coin value updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCoinValueData({ coin: '', value: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error setting coin value', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading({...loading, coinValue: false});
    }
  };

  const fetchCoinHistory = async () => {
    setLoading({...loading, coinHistory: true});
    try {
      const res = await axios.get(`/coin/value-history?coin=${coinValueData.coin}`);
      setCoinHistory(res.data);
      toast.info(`Fetched ${res.data.length} historical records`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching coin history', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCoinHistory([]);
    } finally {
      setLoading({...loading, coinHistory: false});
    }
  };

  const fetchCommissionHistory = async () => {
    setLoading({...loading, commissionHistory: true});
    try {
      const res = await axios.get(`/admin/user-commission-history?user_id=${commissionData.userId}`);
      setCommissionHistory(res.data);
      toast.info(`Found ${res.data.length} commission records`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching commission history', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCommissionHistory([]);
    } finally {
      setLoading({...loading, commissionHistory: false});
    }
  };

  return (
    <Container>
      <Title>
        <FiActivity size={28} />
        Admin Dashboard
      </Title>
      <ToastContainer />
      
      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Subtitle>
          <FiDollarSign />
          Create Deposit
        </Subtitle>
        
        <InputGroup>
          <InputLabel>User ID</InputLabel>
          <InputIcon><FiUser /></InputIcon>
          <Input 
            placeholder="Enter user ID" 
            value={depositData.userId}
            onChange={e => setDepositData({ ...depositData, userId: e.target.value })} 
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel>Amount</InputLabel>
          <InputIcon><FiDollarSign /></InputIcon>
          <Input 
            placeholder="Enter amount" 
            type="number"
            value={depositData.amount}
            onChange={e => setDepositData({ ...depositData, amount: e.target.value })} 
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel>Coin Type</InputLabel>
          <InputIcon><FiDollarSign /></InputIcon>
          <Input 
            placeholder="Enter coin symbol" 
            value={depositData.coin}
            onChange={e => setDepositData({ ...depositData, coin: e.target.value })} 
          />
        </InputGroup>
        
        <Button 
          onClick={handleCreateDeposit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!depositData.userId || !depositData.amount || !depositData.coin || loading.deposit}
        >
          {loading.deposit ? <><LoadingSpinner /> Processing...</> : 'Create Deposit'}
        </Button>
      </Section>

      <Divider />

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Subtitle>
          <FiTrendingUp />
          Coin Value Management
        </Subtitle>
        
        <InputGroup>
          <InputLabel>Coin Symbol</InputLabel>
          <InputIcon><FiDollarSign /></InputIcon>
          <Input 
            placeholder="Enter coin symbol" 
            value={coinValueData.coin}
            onChange={e => setCoinValueData({ ...coinValueData, coin: e.target.value })} 
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel>New Value</InputLabel>
          <InputIcon><FiDollarSign /></InputIcon>
          <Input 
            placeholder="Enter new value" 
            type="number"
            step="0.000001"
            value={coinValueData.value}
            onChange={e => setCoinValueData({ ...coinValueData, value: e.target.value })} 
          />
        </InputGroup>
        
        <div>
          <Button 
            onClick={handleSetCoinValue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!coinValueData.coin || !coinValueData.value || loading.coinValue}
          >
            {loading.coinValue ? <><LoadingSpinner /> Updating...</> : 'Set Coin Value'}
          </Button>
          
          <SecondaryButton 
            onClick={fetchCoinHistory}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!coinValueData.coin || loading.coinHistory}
          >
            {loading.coinHistory ? <><LoadingSpinner /> Fetching...</> : 'View History'}
          </SecondaryButton>
        </div>
        
        <AnimatePresence>
          {coinHistory.length > 0 && (
            <>
              <Subtitle style={{ marginTop: '2rem' }}>
                <FiClock />
                Value History for {coinValueData.coin.toUpperCase()}
              </Subtitle>
              <List>
                <AnimatePresence>
                  {coinHistory.map((item, i) => (
                    <ListItem
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      exit={{ opacity: 0 }}
                    >
                      <ListItemDate>
                        {new Date(item.date).toLocaleString()}
                      </ListItemDate>
                      <ListItemValue>
                        ${parseFloat(item.value).toFixed(6)}
                      </ListItemValue>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </List>
            </>
          )}
        </AnimatePresence>
      </Section>

      <Divider />

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Subtitle>
          <FiUser />
          User Commission History
        </Subtitle>
        
        <InputGroup>
          <InputLabel>User ID</InputLabel>
          <InputIcon><FiUser /></InputIcon>
          <Input 
            placeholder="Enter user ID" 
            value={commissionData.userId}
            onChange={e => setCommissionData({ ...commissionData, userId: e.target.value })} 
          />
        </InputGroup>
        
        <Button 
          onClick={fetchCommissionHistory}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!commissionData.userId || loading.commissionHistory}
        >
          {loading.commissionHistory ? <><LoadingSpinner /> Fetching...</> : 'Get Commission History'}
        </Button>
        
        <AnimatePresence>
          {commissionHistory.length > 0 && (
            <>
              <Subtitle style={{ marginTop: '2rem' }}>
                <FiClock />
                Commission Records
              </Subtitle>
              <List>
                <AnimatePresence>
                  {commissionHistory.map((item, i) => (
                    <ListItem
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      exit={{ opacity: 0 }}
                    >
                      <div>
                        <ListItemDate>
                          {new Date(item.date).toLocaleString()}
                        </ListItemDate>
                        <div style={{ textTransform: 'capitalize' }}>{item.type}</div>
                      </div>
                      <ListItemValue>
                        ${parseFloat(item.amount).toFixed(2)}
                      </ListItemValue>
                    </ListItem>
                  ))}
                </AnimatePresence>
              </List>
            </>
          )}
        </AnimatePresence>
      </Section>
    </Container>
  );
};

export default Admin;