import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Avatar,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageIcon from '@mui/icons-material/Image';

const KycRequests = () => {
  const mockKycRequests = [
    {
      id: 1001,
      username: "john_smith",
      email: "john.smith@example.com",
      id_document_path: "uploads/kyc/id_1001.jpg",
      selfie_with_id_path: "uploads/kyc/selfie_1001.jpg",
      status: "pending",
      created_at: "2025-04-10T09:15:22Z"
    },
    {
      id: 1002,
      username: "emma_johnson",
      email: "emma.j@example.com",
      id_document_path: "uploads/kyc/id_1002.jpg",
      selfie_with_id_path: "uploads/kyc/selfie_1002.jpg",
      status: "pending",
      created_at: "2025-04-09T15:30:45Z"
    },
    {
      id: 1003,
      username: "alex_martinez",
      email: "alex.m@example.com",
      id_document_path: "uploads/kyc/id_1003.jpg",
      selfie_with_id_path: "uploads/kyc/selfie_1003.jpg",
      status: "pending",
      created_at: "2025-04-08T11:22:10Z"
    },
    {
      id: 1004,
      username: "sarah_chen",
      email: "sarah.chen@example.com",
      id_document_path: "uploads/kyc/id_1004.jpg",
      selfie_with_id_path: null, // Missing selfie example
      status: "pending",
      created_at: "2025-04-07T14:05:38Z"
    },
    {
      id: 1005,
      username: "michael_patel",
      email: "m.patel@example.com",
      id_document_path: null, // Missing ID example
      selfie_with_id_path: "uploads/kyc/selfie_1005.jpg",
      status: "pending",
      created_at: "2025-04-06T08:45:19Z"
    }
  ];

  const [kycRequests, setKycRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState({ open: false, url: '', title: '' });
  
  // Use mock data if in development environment
  const useMockData = true; // Set to false when real API is ready

  useEffect(() => {
    if (useMockData) {
      // Simulate API delay
      const timer = setTimeout(() => {
        setKycRequests(mockKycRequests);
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      fetchKycRequests();
    }
  }, []);

  const fetchKycRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://151.106.125.212:5021/api/kyc/pending', {
        withCredentials: false,
      });

      console.log('API Response:', response.data);

      let requestsArray = [];

      if (Array.isArray(response.data)) {
        requestsArray = response.data;
      } else if (response.data?.pendingKyc && Array.isArray(response.data.pendingKyc)) {
        requestsArray = response.data.pendingKyc;
      }

      setKycRequests(Array.isArray(requestsArray) ? requestsArray : []);
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
      setError('Failed to load KYC requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setConfirmOpen(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType('reject');
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;

    try {
      if (useMockData) {
        // For mock data, just remove the item from the list
        setKycRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
        console.log(`KYC request ${selectedRequest.id} ${actionType}d (mock)`);
      } else {
        // Real API call
        const endpoint = `http://151.106.125.212:5021/api/kyc/${selectedRequest.id}/status`;
        const payload = { 
          status: actionType === 'approve' ? 'approved' : 'rejected' 
        };
        
        await axios.patch(endpoint, payload, { withCredentials: false });
        fetchKycRequests();
      }
    } catch (error) {
      console.error(`Error ${actionType}ing KYC request:`, error);
      alert(`Failed to ${actionType} KYC request. Please try again.`);
    } finally {
      setConfirmOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleOpenImage = (url, title) => {
    setImagePreview({
      open: true,
      url,
      title
    });
  };

  const handleCloseImage = () => {
    setImagePreview({
      open: false,
      url: '',
      title: ''
    });
  };

  const filteredRequests = kycRequests.filter(request => {
    return (
      request.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id?.toString().includes(searchTerm) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchKycRequests}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          KYC Verification Requests
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name, ID, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:focus-within': {
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }
            }
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ 
            color: 'primary.main',
            animation: 'ripple 1.2s infinite ease-in-out',
            '@keyframes ripple': {
              '0%': {
                transform: 'scale(0.8)',
                opacity: 1
              },
              '50%': {
                transform: 'scale(1)',
                opacity: 0.5
              },
              '100%': {
                transform: 'scale(0.8)',
                opacity: 1
              }
            }
          }} />
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Alert severity="info">No KYC verification requests found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 3, 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">User Information</Typography>
                      <Typography variant="h6">{request.username || 'N/A'}</Typography>
                      <Typography variant="body2" color="textSecondary">ID: {request.id}</Typography>
                      <Typography variant="body2">{request.email || 'No email provided'}</Typography>
                      <Typography variant="body2">
                        Submitted: {new Date(request.created_at).toLocaleString()}
                      </Typography>
                      <Chip 
                        label="Pending" 
                        color="warning" 
                        size="small" 
                        sx={{ mt: 1, borderRadius: 2 }} 
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">ID Document</Typography>
                      <Box 
                        sx={{ 
                          height: 120, 
                          backgroundColor: 'rgba(0,0,0,0.04)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer',
                          borderRadius: 3,
                          mt: 1,
                          transition: 'all 0.2s ease',
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            transform: 'scale(1.02)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          },
                          '&:active': {
                            transform: 'scale(0.98)'
                          }
                        }}
                        onClick={() => handleOpenImage(
                          `http://151.106.125.212:5021/${request.id_document_path}`, 
                          'ID Document'
                        )}
                      >
                        {request.id_document_path ? (
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img 
                              // Use placeholder image for demo purposes when using mock data
                              src={useMockData 
                                ? `/api/placeholder/300/200` 
                                : `http://151.106.125.212:5021/${request.id_document_path}`} 
                              alt="ID Document" 
                              style={{ 
                                objectFit: 'contain', 
                                maxHeight: '100%', 
                                maxWidth: '100%',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                            />
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <ImageIcon fontSize="large" color="disabled" />
                            <Typography variant="caption" display="block">No ID document</Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">Selfie with ID</Typography>
                      <Box 
                        sx={{ 
                          height: 120, 
                          backgroundColor: 'rgba(0,0,0,0.04)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer',
                          borderRadius: 3,
                          mt: 1,
                          transition: 'all 0.2s ease',
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.08)',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            transform: 'scale(1.02)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          },
                          '&:active': {
                            transform: 'scale(0.98)'
                          }
                        }}
                        onClick={() => handleOpenImage(
                          `http://151.106.125.212:5021/${request.selfie_with_id_path}`, 
                          'Selfie with ID'
                        )}
                      >
                        {request.selfie_with_id_path ? (
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img 
                              // Use placeholder image for demo purposes when using mock data
                              src={useMockData 
                                ? `/api/placeholder/300/200` 
                                : `http://151.106.125.212:5021/${request.selfie_with_id_path}`} 
                              alt="Selfie with ID" 
                              style={{ 
                                objectFit: 'contain', 
                                maxHeight: '100%', 
                                maxWidth: '100%',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                              }}
                            />
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <ImageIcon fontSize="large" color="disabled" />
                            <Typography variant="caption" display="block">No selfie</Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(request)}
                    sx={{ 
                      ml: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(211, 47, 47, 0.2)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleApprove(request)}
                    sx={{ 
                      ml: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(46, 125, 50, 0.3)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    Approve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle>
          {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} this KYC verification request
            {selectedRequest ? ` (ID: ${selectedRequest.id})?` : '?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            variant="contained" 
            color={actionType === 'approve' ? 'success' : 'error'} 
            onClick={handleConfirmAction}
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: actionType === 'approve' 
                  ? '0 4px 8px rgba(46, 125, 50, 0.3)' 
                  : '0 4px 8px rgba(211, 47, 47, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog 
        open={imagePreview.open} 
        onClose={handleCloseImage}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle>{imagePreview.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
            {imagePreview.url && (
              <img 
                // Use placeholder image for demo purposes when using mock data
                src={useMockData 
                  ? `/api/placeholder/800/600` 
                  : imagePreview.url} 
                alt={imagePreview.title} 
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImage} sx={{ borderRadius: 2 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KycRequests;