import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { FiTrendingUp, FiActivity, FiClock, FiCreditCard, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdminBankDetails from './AdminBankDetails';

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

const CurrentValueCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CurrentValueText = styled.p`
  color: #4a5568;
  font-size: 1rem;
  margin: 0.5rem 0;
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f7fafc;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 4px;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: ${props => props.$active ? '#4299e1' : '#718096'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.$active ? '#4299e1' : 'transparent'};
    transition: all 0.2s ease;
  }
  
  &:hover {
    color: ${props => props.$active ? '#4299e1' : '#4a5568'};
  }
  
  &:focus {
    outline: none;
  }
`;

const TabIcon = styled.span`
  margin-right: 0.5rem;
`;

const HistorySection = styled(motion.div)`
  margin-top: 2rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #718096;
`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('coinValue');
  const [coinValueData, setCoinValueData] = useState({ value: '' });
  const [currentCoinValue, setCurrentCoinValue] = useState(null);
  const [coinHistory, setCoinHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState({
    currentValue: false,
    coinValue: false,
    coinHistory: false,
  });

  // Backend base URL
  const BASE_URL = 'http://151.106.125.212:5021';
  // Hardcoded adminId (replace with auth context if available)
  const adminId = 1;

  // Fetch current coin value on mount
  useEffect(() => {
    fetchCurrentCoinValue();
  }, []);

  const fetchCurrentCoinValue = async () => {
    setLoading({ ...loading, currentValue: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/coin-values/current`);
      setCurrentCoinValue(res.data.coinValue);
      toast.info(`Current coin value: LKR ${parseFloat(res.data.coinValue.lkrValue).toFixed(2)}`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (err) {
      setCurrentCoinValue(null);
      toast.error(err.response?.data?.message || 'Error fetching current coin value', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading({ ...loading, currentValue: false });
    }
  };

  const handleSetCoinValue = async () => {
    const value = parseFloat(coinValueData.value);
    if (isNaN(value) || value <= 0) {
      toast.error('Please enter a valid positive value', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading({ ...loading, coinValue: true });
    try {
      const response = await axios.post(`${BASE_URL}/api/coin-values`, {
        lkrValue: value,
        adminId,
      });
      toast.success(response.data.message || 'Coin value updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCoinValueData({ value: '' });
      fetchCurrentCoinValue();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error setting coin value', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading({ ...loading, coinValue: false });
    }
  };

  const handleViewHistory = async () => {
    if (coinHistory.length === 0 || !showHistory) {
      await fetchCoinHistory();
    }
    setShowHistory(!showHistory);
  };

  const fetchCoinHistory = async () => {
    setLoading({ ...loading, coinHistory: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/coin-values/history`);
      // The API returns { coinValues: [...] } structure
      const historyData = res.data.coinValues || [];
      setCoinHistory(historyData);
      toast.info(`Fetched ${historyData.length} historical records`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching coin history', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setCoinHistory([]);
    } finally {
      setLoading({ ...loading, coinHistory: false });
    }
  };

  return (
    <Container>
      <Title>
        <FiActivity size={28} />
        Admin Dashboard
      </Title>
      <ToastContainer />

      <TabContainer>
        <Tab 
          $active={activeTab === 'coinValue'} 
          onClick={() => setActiveTab('coinValue')}
        >
          <TabIcon><FiTrendingUp /></TabIcon>
          Coin Values
        </Tab>
        <Tab 
          $active={activeTab === 'bankDetails'} 
          onClick={() => setActiveTab('bankDetails')}
        >
          <TabIcon><FiCreditCard /></TabIcon>
          Bank Details
        </Tab>
      </TabContainer>
      
      <AnimatePresence mode="wait">
        {activeTab === 'coinValue' && (
          <Section
            key="coinValue"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Subtitle>
              <FiTrendingUp />
              Coin Value Management
            </Subtitle>

            <CurrentValueCard>
              {loading.currentValue ? (
                <CurrentValueText>Loading current value...</CurrentValueText>
              ) : currentCoinValue ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CurrentValueText>
                    Value: LKR {parseFloat(currentCoinValue.lkrValue).toFixed(2)}
                  </CurrentValueText>
                  <CurrentValueText>
                    Updated: {new Date(currentCoinValue.updatedAt).toLocaleString()}
                  </CurrentValueText>
                  <CurrentValueText>
                    By: {currentCoinValue.updatedByName}
                  </CurrentValueText>
                </motion.div>
              ) : (
                <CurrentValueText>No value available</CurrentValueText>
              )}
            </CurrentValueCard>
            
            <InputGroup>
              <InputLabel>New Value (LKR)</InputLabel>
              <InputIcon><FiTrendingUp /></InputIcon>
              <Input 
                placeholder="Enter new value" 
                type="number"
                step="0.01"
                value={coinValueData.value}
                onChange={e => setCoinValueData({ ...coinValueData, value: e.target.value })} 
              />
            </InputGroup>
            
            <div>
              <Button 
                onClick={handleSetCoinValue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!coinValueData.value || loading.coinValue}
              >
                {loading.coinValue ? <><LoadingSpinner /> Updating...</> : 'Set Coin Value'}
              </Button>
              
              <SecondaryButton 
                onClick={handleViewHistory}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading.coinHistory}
              >
                {loading.coinHistory ? (
                  <><LoadingSpinner /> Fetching...</>
                ) : (
                  <>
                    {showHistory ? <FiChevronUp style={{ marginRight: '4px' }} /> : <FiChevronDown style={{ marginRight: '4px' }} />}
                    {showHistory ? 'Hide History' : 'View History'}
                  </>
                )}
              </SecondaryButton>
            </div>
            
            <AnimatePresence>
              {showHistory && (
                <HistorySection
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Subtitle>
                    <FiClock />
                    Value History
                  </Subtitle>
                  
                  {coinHistory.length > 0 ? (
                    <List>
                      <AnimatePresence>
                        {coinHistory.map((item, i) => (
                          <ListItem
                            key={item.id || i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            exit={{ opacity: 0 }}
                          >
                            <ListItemDate>
                              {new Date(item.updatedAt).toLocaleString()}
                            </ListItemDate>
                            <div>
                              <ListItemValue>
                                LKR {parseFloat(item.lkrValue).toFixed(2)}
                              </ListItemValue>
                              <span style={{ fontSize: '0.75rem', color: '#718096', marginLeft: '0.5rem' }}>
                                By: {item.updatedByName}
                              </span>
                            </div>
                          </ListItem>
                        ))}
                      </AnimatePresence>
                    </List>
                  ) : (
                    <EmptyState>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        No history records available
                      </motion.p>
                    </EmptyState>
                  )}
                </HistorySection>
              )}
            </AnimatePresence>
          </Section>
        )}
        {activeTab === 'bankDetails' && (
          <motion.div
            key="bankDetails"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminBankDetails />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Admin;