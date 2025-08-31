import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Users, CheckCircle, DollarSign } from 'lucide-react';
import apiService from '../../services/api';

const AdminStatsCard = ({ user }) => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDayWiseStats();
      
      if (response && response.data) {
        const { overallStats } = response.data;
        setStats({
          total: overallStats.totalRegistrations || 0,
          approved: overallStats.totalApproved || 0,
          totalRevenue: overallStats.totalFees || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Show stats to all users
  // No longer checking for admin status

  return (
    <div className="admin-stats-section py-4">
      <Container>
        <h3 className="text-center mb-4" style={{
          fontSize: '1.75rem',
          background: 'linear-gradient(90deg, #00eaff, #ff00e5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700',
        }}>
          Admin Dashboard Overview
        </h3>
        
        {loading ? (
          <div className="text-center py-4">Loading statistics...</div>
        ) : error ? (
          <div className="text-center py-4 text-danger">{error}</div>
        ) : (
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Card.Body className="text-center p-4">
                  <Users size={40} className="mb-3" />
                  <h2 className="mb-1 fw-bold">{stats.total}</h2>
                  <p className="mb-0 opacity-75">Total Registrations</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Card.Body className="text-center p-4">
                  <CheckCircle size={40} className="mb-3" />
                  <h2 className="mb-1 fw-bold">{stats.approved}</h2>
                  <p className="mb-0 opacity-75">Approved Registrations</p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="border-0 shadow-lg h-100" style={{
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#333',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Card.Body className="text-center p-4">
                  <DollarSign size={40} className="mb-3" />
                  <h2 className="mb-1 fw-bold">₹{stats.totalRevenue}</h2>
                  <p className="mb-0 opacity-75">Total Revenue</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AdminStatsCard;