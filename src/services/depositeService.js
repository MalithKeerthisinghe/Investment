import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Sample mock data (remove this in production)
const MOCK_DEPOSITS = [
  {
    id: 'dep-001',
    userId: 'user-123',
    userName: 'John Doe',
    amount: 1000,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'bank transfer',
    transactionId: 'tx-9876543',
    createdAt: '2025-04-05T10:30:00Z',
  },
  {
    id: 'dep-002',
    userId: 'user-456',
    userName: 'Jane Smith',
    amount: 500,
    currency: 'EUR',
    status: 'completed',
    paymentMethod: 'credit card',
    transactionId: 'tx-1234567',
    createdAt: '2025-04-04T14:20:00Z',
  },
  {
    id: 'dep-003',
    userId: 'user-789',
    userName: 'Robert Brown',
    amount: 2500,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'cryptocurrency',
    transactionId: 'tx-3456789',
    createdAt: '2025-04-03T09:45:00Z',
  },
  {
    id: 'dep-004',
    userId: 'user-101',
    userName: 'Sarah Wilson',
    amount: 750,
    currency: 'GBP',
    status: 'failed',
    paymentMethod: 'bank transfer',
    transactionId: 'tx-7654321',
    createdAt: '2025-04-02T16:15:00Z',
  },
  {
    id: 'dep-005',
    userId: 'user-202',
    userName: 'Michael Taylor',
    amount: 1200,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'credit card',
    transactionId: 'tx-2345678',
    createdAt: '2025-04-01T11:50:00Z',
  }
];

// Function to simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all deposits
export const getAllDeposits = async () => {
  try {
    
    await delay(800);
    return MOCK_DEPOSITS;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw error;
  }
};

// Get pending deposits
export const getPendingDeposits = async () => {
  try {
   
    await delay(800);
    return MOCK_DEPOSITS.filter(dep => dep.status === 'pending');
  } catch (error) {
    console.error('Error fetching pending deposits:', error);
    throw error;
  }
};

// Get deposit by ID
export const getDepositById = async (depositId) => {
  try {
    
    await delay(500);
    const deposit = MOCK_DEPOSITS.find(dep => dep.id === depositId);
    
    if (!deposit) {
      throw new Error('Deposit not found');
    }
    
    return deposit;
  } catch (error) {
    console.error(`Error fetching deposit with ID ${depositId}:`, error);
    throw error;
  }
};

// Update deposit status
export const updateDepositStatus = async (depositId, status) => {
  try {
    
    await delay(700);
    
    return { 
      success: true, 
      message: `Deposit ${depositId} status updated to ${status}` 
    };
  } catch (error) {
    console.error(`Error updating deposit status for ID ${depositId}:`, error);
    throw error;
  }
};

// Add new deposit (for testing)
export const addDeposit = async (depositData) => {
  try {
    
    await delay(1000);
    // In a real app, this would add to the database
    return { 
      success: true, 
      message: 'Deposit added successfully',
      depositId: `dep-${Math.floor(Math.random() * 10000)}`
    };
  } catch (error) {
    console.error('Error adding new deposit:', error);
    throw error;
  }
};

export default {
  getAllDeposits,
  getPendingDeposits,
  getDepositById,
  updateDepositStatus,
  addDeposit
};