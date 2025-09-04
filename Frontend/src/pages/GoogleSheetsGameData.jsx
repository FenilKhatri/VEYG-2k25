import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Button, Nav, Tab } from 'react-bootstrap';
import { Trophy, RefreshCw, Download, FileSpreadsheet, Users, User, Calendar } from 'lucide-react';
import apiService from '../services/api';
import cookieAuth from '../utils/cookieAuth';

const GoogleSheetsGameData = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');

  // Define the 4 main games plus "all" tab
  const gameTabs = [
    { key: 'all', name: 'All Games', icon: '🎮' },
    { key: 'Technical Adventure', name: 'Technical Adventure', icon: '⚡' },
    { key: 'TTH', name: 'TTH', icon: '🎯' },
    { key: 'Treasure Hunt', name: 'Treasure Hunt', icon: '🗺️' },
    { key: 'Quiz Competition', name: 'Quiz Competition', icon: '🧠' }
  ];

  useEffect(() => {
    fetchGameData();
    // Auto-refresh every 30 seconds for live data
    const interval = setInterval(fetchGameData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const authData = cookieAuth.getAuthData();
      if (!authData || !authData.token || !authData.isAdmin) {
        setError('Admin authentication required');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations`, {
        headers: {
          'Authorization': `Bearer ${authData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game data');
      }

      const data = await response.json();
      setRegistrations(data.data?.registrations || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching game data:', error);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await apiService.exportGameRegistrations();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VEYG_Game_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export game data');
    }
  };

  const getFilteredRegistrations = (gameName) => {
    if (gameName === 'all') return registrations;
    return registrations.filter(reg => reg.gameName === gameName);
  };

  const renderGameTable = (gameRegistrations) => (
    <div className="table-responsive">
      <Table hover className="mb-0">
        <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 10 }}>
          <tr>
            <th className="border-0 py-3 px-4">Team ID</th>
            <th className="border-0 py-3">Name of Participants</th>
            <th className="border-0 py-3">Enrollment No.</th>
            <th className="border-0 py-3">Email</th>
            <th className="border-0 py-3">Present/Absent</th>
            <th className="border-0 py-3">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {gameRegistrations.map((registration, index) => {
            // Create rows for team leader and members
            const rows = [];
            
            // Team leader row
            if (registration.teamLeader) {
              rows.push({
                ...registration.teamLeader,
                registrationId: registration.registrationId,
                gameName: registration.gameName,
                teamName: registration.teamName,
                registrationType: registration.registrationType,
                status: registration.approvalStatus,
                role: 'Team Leader',
                isLeader: true
              });
            }

            // Team members rows
            if (registration.teamMembers && registration.teamMembers.length > 0) {
              registration.teamMembers.forEach(member => {
                rows.push({
                  ...member,
                  registrationId: registration.registrationId,
                  gameName: registration.gameName,
                  teamName: registration.teamName,
                  registrationType: registration.registrationType,
                  status: registration.approvalStatus,
                  role: 'Team Member',
                  isLeader: false
                });
              });
            }

            return rows.map((participant, participantIndex) => (
              <tr key={`${registration._id}-${participantIndex}`} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td className="py-3 px-4">
                  <div>
                    <Badge bg="primary" className="font-monospace mb-1">
                      {participant.registrationId || `${registration.gameName?.substring(0,2).toUpperCase()}-${index + 1}`}
                    </Badge>
                    {participant.isLeader && (
                      <div className="small text-success">
                        <Users size={12} className="me-1" />
                        {participant.teamName || 'Team'}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <strong>{participant.fullName}</strong>
                    {participant.isLeader && (
                      <Badge bg="success" className="ms-2 small">Leader</Badge>
                    )}
                    <div className="small text-muted">
                      {participant.college}
                    </div>
                    <div className="small text-muted">
                      {participant.department} - Sem {participant.semester}
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <code>{participant.enrollmentNo}</code>
                </td>
                <td className="py-3">
                  <div className="small">
                    {participant.email}
                  </div>
                  <div className="small text-muted">
                    {participant.phone}
                  </div>
                </td>
                <td className="py-3">
                  <Badge 
                    bg={participant.status === 'approved' ? 'success' : 
                        participant.status === 'rejected' ? 'danger' : 'warning'}
                  >
                    {participant.status === 'approved' ? 'P' : 
                     participant.status === 'rejected' ? 'A' : 'P'}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="small">
                    <Badge bg="info" className="mb-1">
                      {participant.gameName}
                    </Badge>
                    <div className="text-muted">
                      {participant.role}
                    </div>
                  </div>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </div>
  );

  if (loading && registrations.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff'
      }}>
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading game data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      minHeight: '100vh',
      paddingTop: '2rem'
    }}>
      <Container fluid className="px-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center mb-4"
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '20px 40px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
            <Trophy size={48} className="me-3" style={{ color: '#FFD700' }} />
            <div>
              <h1 className="display-4 fw-bold text-white mb-0">Game Data Sheet</h1>
              <p className="text-white-50 mb-0">Live Google Sheets View - VEYG 2K25</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Card className="border-0 shadow-lg mb-4" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={6}>
                <div className="d-flex align-items-center">
                  <Trophy size={24} className="me-2 text-warning" />
                  <div>
                    <h5 className="mb-0">Total Registrations: {registrations.length}</h5>
                    <small className="text-muted">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                      {loading && <span className="ms-2">🔄 Updating...</span>}
                    </small>
                  </div>
                </div>
              </Col>
              <Col md={6} className="text-end">
                <Button
                  variant="outline-primary"
                  onClick={fetchGameData}
                  disabled={loading}
                  className="me-2"
                  style={{ borderRadius: '12px' }}
                >
                  <RefreshCw size={16} className="me-1" />
                  Refresh
                </Button>
                <Button
                  variant="success"
                  onClick={handleExport}
                  style={{ borderRadius: '12px' }}
                >
                  <Download size={16} className="me-1" />
                  Export Excel
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabbed Data */}
        <Card className="border-0 shadow-lg" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Card.Header style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px 12px 0 0'
          }}>
            <h5 className="mb-0 fw-bold">
              <FileSpreadsheet size={24} className="me-2" />
              Game Registration Data
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="px-3 pt-3" style={{ borderBottom: '2px solid #e9ecef' }}>
                {gameTabs.map(tab => {
                  const filteredData = getFilteredRegistrations(tab.key);
                  return (
                    <Nav.Item key={tab.key}>
                      <Nav.Link 
                        eventKey={tab.key}
                        style={{ 
                          borderRadius: '8px 8px 0 0',
                          fontWeight: '600',
                          border: 'none',
                          marginRight: '4px'
                        }}
                      >
                        <span className="me-2">{tab.icon}</span>
                        {tab.name}
                        <Badge bg="secondary" className="ms-2">
                          {filteredData.length}
                        </Badge>
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
              
              <Tab.Content>
                {gameTabs.map(tab => (
                  <Tab.Pane key={tab.key} eventKey={tab.key}>
                    <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {renderGameTable(getFilteredRegistrations(tab.key))}
                    </div>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GoogleSheetsGameData;
