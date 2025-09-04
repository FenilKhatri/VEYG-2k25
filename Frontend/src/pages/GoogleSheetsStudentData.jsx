import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Users, RefreshCw, Download, FileSpreadsheet, Calendar, Mail, Phone, Building2 } from 'lucide-react';
import apiService from '../services/api';
import cookieAuth from '../utils/cookieAuth';

const GoogleSheetsStudentData = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchStudentData();
    // Auto-refresh every 30 seconds for live data
    const interval = setInterval(fetchStudentData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStudentData = async () => {
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
        throw new Error('Failed to fetch student data');
      }

      const data = await response.json();
      const registrationsList = data.data?.registrations || [];
      
      // Extract unique students from registrations
      const studentsMap = new Map();
      
      registrationsList.forEach(reg => {
        if (reg.teamLeader) {
          const studentKey = reg.teamLeader.email;
          if (!studentsMap.has(studentKey)) {
            studentsMap.set(studentKey, {
              id: reg.teamLeader._id || reg.userId,
              registrationId: reg.registrationId,
              fullName: reg.teamLeader.fullName,
              email: reg.teamLeader.email,
              phone: reg.teamLeader.phone,
              enrollmentNo: reg.teamLeader.enrollmentNo,
              college: reg.teamLeader.college,
              department: reg.teamLeader.department,
              semester: reg.teamLeader.semester,
              registrationDate: reg.createdAt || reg.registrationDate,
              status: reg.approvalStatus,
              gamesRegistered: []
            });
          }
          studentsMap.get(studentKey).gamesRegistered.push({
            gameName: reg.gameName,
            teamName: reg.teamName,
            registrationType: reg.registrationType,
            fee: reg.totalFee,
            status: reg.approvalStatus
          });
        }

        // Add team members if it's a team registration
        if (reg.teamMembers && reg.teamMembers.length > 0) {
          reg.teamMembers.forEach(member => {
            const memberKey = member.email;
            if (!studentsMap.has(memberKey)) {
              studentsMap.set(memberKey, {
                id: member._id,
                registrationId: reg.registrationId,
                fullName: member.fullName,
                email: member.email,
                phone: member.phone,
                enrollmentNo: member.enrollmentNo,
                college: member.college,
                department: member.department,
                semester: member.semester,
                registrationDate: reg.createdAt || reg.registrationDate,
                status: reg.approvalStatus,
                gamesRegistered: []
              });
            }
            studentsMap.get(memberKey).gamesRegistered.push({
              gameName: reg.gameName,
              teamName: reg.teamName,
              registrationType: reg.registrationType,
              role: 'Team Member',
              fee: reg.totalFee,
              status: reg.approvalStatus
            });
          });
        }
      });

      setStudents(Array.from(studentsMap.values()));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await apiService.exportStudentRegistrations();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `VEYG_Student_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export student data');
    }
  };

  if (loading && students.length === 0) {
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
          <p className="mt-3">Loading student data...</p>
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
            <FileSpreadsheet size={48} className="me-3" style={{ color: '#4CAF50' }} />
            <div>
              <h1 className="display-4 fw-bold text-white mb-0">Student Data Sheet</h1>
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
                  <Users size={24} className="me-2 text-primary" />
                  <div>
                    <h5 className="mb-0">Total Students: {students.length}</h5>
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
                  onClick={fetchStudentData}
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

        {/* Data Table */}
        <Card className="border-0 shadow-lg" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Card.Header style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px 12px 0 0'
          }}>
            <h5 className="mb-0 fw-bold">
              <FileSpreadsheet size={24} className="me-2" />
              Student Registration Data
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
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
                  {students.map((student, index) => (
                    <tr key={student.id || index} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td className="py-3 px-4">
                        <Badge bg="primary" className="font-monospace">
                          {student.registrationId || `ST-${index + 1}`}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div>
                          <strong>{student.fullName}</strong>
                          <div className="small text-muted">
                            <Building2 size={12} className="me-1" />
                            {student.college}
                          </div>
                          <div className="small text-muted">
                            {student.department} - Sem {student.semester}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <code>{student.enrollmentNo}</code>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="small">
                            <Mail size={12} className="me-1" />
                            {student.email}
                          </div>
                          <div className="small text-muted">
                            <Phone size={12} className="me-1" />
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge 
                          bg={student.status === 'approved' ? 'success' : 
                              student.status === 'rejected' ? 'danger' : 'warning'}
                        >
                          {student.status === 'approved' ? 'P' : 
                           student.status === 'rejected' ? 'A' : 'P'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="small">
                          {student.gamesRegistered.map((game, idx) => (
                            <Badge key={idx} bg="info" className="me-1 mb-1">
                              {game.gameName}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default GoogleSheetsStudentData;
