import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import {
      Users, Search, Download, Eye, CheckCircle, Clock, Trophy, XCircle,
      User, Mail, Phone, Building2, Calendar, DollarSign,
      TrendingUp
} from 'lucide-react'
import apiService from '../services/api'
import cookieAuth from '../utils/cookieAuth'

const AdminDashboardNew = () => {
      const [registrations, setRegistrations] = useState([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState('')
      const [searchTerm, setSearchTerm] = useState('')
      const [filterStatus, setFilterStatus] = useState('all')
      const [filterGame, setFilterGame] = useState('all')
      const [selectedRegistration, setSelectedRegistration] = useState(null)
      const [showDetailsModal, setShowDetailsModal] = useState(false)
      const [stats, setStats] = useState({
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            totalRevenue: 0,
            todayRegistrations: 0
      })

      useEffect(() => {
            fetchRegistrations()
      }, [])

      const fetchRegistrations = async () => {
            try {
                  setLoading(true)
                  const authData = cookieAuth.getAuthData()
                  if (!authData || !authData.token || !authData.isAdmin) {
                        setError('Admin authentication required')
                        return
                  }

                  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations`, {
                        headers: {
                              'Authorization': `Bearer ${authData.token}`,
                              'Content-Type': 'application/json'
                        }
                  })

                  if (!response.ok) {
                        throw new Error('Failed to fetch registrations')
                  }

                  const data = await response.json()
                  const registrationsList = data.data?.registrations || []

                  setRegistrations(registrationsList)

                  // Calculate enhanced stats
                  const today = new Date().toDateString()
                  const newStats = {
                        total: registrationsList.length,
                        approved: registrationsList.filter(r => r.approvalStatus === 'approved').length,
                        pending: registrationsList.filter(r => r.approvalStatus === 'pending').length,
                        rejected: registrationsList.filter(r => r.approvalStatus === 'rejected').length,
                        totalRevenue: registrationsList
                              .filter(r => r.approvalStatus === 'approved')
                              .reduce((sum, r) => sum + (r.totalFee || 0), 0),
                        todayRegistrations: registrationsList.filter(r =>
                              new Date(r.createdAt || r.registrationDate).toDateString() === today
                        ).length
                  }
                  setStats(newStats)
            } catch (error) {
                  console.error('Error fetching registrations:', error)
                  setError('Failed to load registrations')
                  setRegistrations([])
            } finally {
                  setLoading(false)
            }
      }

      const handleStatusUpdate = async (registrationId, newStatus) => {
            try {
                  const authData = cookieAuth.getAuthData()
                  if (!authData || !authData.token || !authData.isAdmin) {
                        setError('Admin authentication required')
                        return
                  }

                  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations/${registrationId}/status`, {
                        method: 'PATCH',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${authData.token}`
                        },
                        body: JSON.stringify({ approvalStatus: newStatus })
                  })

                  if (!response.ok) {
                        throw new Error('Failed to update status')
                  }

                  await fetchRegistrations()
                  console.log(`Registration ${registrationId} status updated to ${newStatus}`)
            } catch (error) {
                  console.error('Error updating status:', error)
                  setError('Failed to update registration status')
            }
      }

      const handleExport = async (type) => {
            try {
                  setLoading(true)
                  let blob

                  if (type === 'students') {
                        blob = await apiService.exportStudentRegistrations()
                  } else if (type === 'games') {
                        blob = await apiService.exportGameRegistrations()
                  } else {
                        blob = await apiService.exportAllRegistrations()
                  }

                  const url = window.URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `VEYG_${type}_${new Date().toISOString().split('T')[0]}.xlsx`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  window.URL.revokeObjectURL(url)

                  console.log(`${type} data exported successfully`)
            } catch (error) {
                  console.error('Error exporting data:', error)
                  setError(`Failed to export ${type} data`)
            } finally {
                  setLoading(false)
            }
      }

      const filteredRegistrations = Array.isArray(registrations) ? registrations.filter(reg => {
            const matchesSearch = reg.gameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  reg.teamLeader?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  reg.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  reg.registrationId?.toLowerCase().includes(searchTerm.toLowerCase())

            let matchesStatusFilter = true
            if (filterStatus !== 'all') {
                  matchesStatusFilter = reg.approvalStatus === filterStatus
            }

            let matchesGameFilter = true
            if (filterGame !== 'all') {
                  matchesGameFilter = reg.gameName === filterGame
            }

            return matchesSearch && matchesStatusFilter && matchesGameFilter
      }) : []

      const uniqueGames = [...new Set(registrations.map(reg => reg.gameName))].filter(Boolean)

      if (loading) {
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
                              <p className="mt-3">Loading admin dashboard...</p>
                        </div>
                  </div>
            )
      }

      return (
            <>
                  <style>
                        {`
                              .dropdown-menu {
                                    z-index: 1060 !important;
                                    position: fixed !important;
                              }
                              .dropdown-toggle::after {
                                    margin-left: 0.5em;
                              }
                              .table-responsive {
                                    overflow-x: auto;
                                    overflow-y: visible;
                              }
                              .position-static .dropdown-menu {
                                    position: absolute !important;
                                    z-index: 1060 !important;
                                    transform: none !important;
                              }
                        `}
                  </style>
                  <div style={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        minHeight: '100vh',
                        paddingTop: '2rem'
                  }}>
                        <Container fluid className="px-4">
                              {/* Modern Header */}
                              <div className="text-center mb-5">
                                    <div className="d-inline-flex align-items-center justify-content-center mb-4"
                                          style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: '20px',
                                                padding: '20px 40px',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                          }}>
                                          <Trophy size={48} className="me-3" style={{ color: '#ffd700' }} />
                                          <div>
                                                <h1 className="display-4 fw-bold text-white mb-0">Admin Dashboard</h1>
                                                <p className="text-white-50 mb-0">VEYG 2K25 Management Portal</p>
                                          </div>
                                    </div>
                              </div>

                              {error && (
                                    <Alert variant="danger" className="mb-4 mx-auto" style={{ maxWidth: '800px' }}>
                                          <div className="d-flex align-items-center">
                                                <XCircle size={20} className="me-2" />
                                                {error}
                                          </div>
                                    </Alert>
                              )}

                              {/* Enhanced Stats Cards */}
                              <Row className="mb-5 g-4">
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                color: 'white'
                                          }}>
                                                <Card.Body className="text-center p-4">
                                                      <Users size={40} className="mb-3" />
                                                      <h2 className="mb-1 fw-bold">{stats.total}</h2>
                                                      <p className="mb-0 opacity-75">Total Registrations</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                color: 'white'
                                          }}>
                                                <Card.Body className="text-center p-4">
                                                      <CheckCircle size={40} className="mb-3" />
                                                      <h2 className="mb-1 fw-bold">{stats.approved}</h2>
                                                      <p className="mb-0 opacity-75">Approved</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                                color: 'white'
                                          }}>
                                                <Card.Body className="text-center p-4">
                                                      <Clock size={40} className="mb-3" />
                                                      <h2 className="mb-1 fw-bold">{stats.pending}</h2>
                                                      <p className="mb-0 opacity-75">Pending</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                                                color: 'white'
                                          }}>
                                                <Card.Body className="text-center p-4">
                                                      <XCircle size={40} className="mb-3" />
                                                      <h2 className="mb-1 fw-bold">{stats.rejected}</h2>
                                                      <p className="mb-0 opacity-75">Rejected</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                                color: '#333'
                                          }}>
                                                <Card.Body className="text-center text-white p-5 ">
                                                      <h2 className="mb-1 fw-bold">₹{stats.totalRevenue}</h2>
                                                      <p className="mb-0">Total Revenue</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                                    <Col xl={2} lg={4} md={6}>
                                          <Card className="border-0 shadow-lg h-100" style={{
                                                background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                                                color: '#333'
                                          }}>
                                                <Card.Body className="text-center text-white p-4">
                                                      <TrendingUp size={40} className="mb-3" />
                                                      <h2 className="mb-1 fw-bold">{stats.todayRegistrations}</h2>
                                                      <p className="mb-0 opacity-75">Today's Registrations</p>
                                                </Card.Body>
                                          </Card>
                                    </Col>
                              </Row>

                              {/* Modern Filters */}
                              <Card className="border-0 shadow-lg mb-4" style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    position: 'relative',
                                    zIndex: 1
                              }}>
                                    <Card.Body className="p-4">
                                          <Row className="align-items-center g-3">
                                                <Col lg={4}>
                                                      <div className="position-relative">
                                                            <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                                            <Form.Control
                                                                  type="text"
                                                                  placeholder="Search registrations..."
                                                                  value={searchTerm}
                                                                  onChange={(e) => setSearchTerm(e.target.value)}
                                                                  style={{
                                                                        paddingLeft: '3rem',
                                                                        borderRadius: '12px',
                                                                        border: '2px solid #e9ecef',
                                                                        fontSize: '16px'
                                                                  }}
                                                            />
                                                      </div>
                                                </Col>
                                                <Col lg={2}>
                                                      <Form.Select
                                                            value={filterStatus}
                                                            onChange={(e) => setFilterStatus(e.target.value)}
                                                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                                                      >
                                                            <option value="all">All Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                      </Form.Select>
                                                </Col>
                                                <Col lg={2}>
                                                      <Form.Select
                                                            value={filterGame}
                                                            onChange={(e) => setFilterGame(e.target.value)}
                                                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                                                      >
                                                            <option value="all">All Games</option>
                                                            {uniqueGames.map(game => (
                                                                  <option key={game} value={game}>{game}</option>
                                                            ))}
                                                      </Form.Select>
                                                </Col>
                                                <Col lg={4}>
                                                      <div className="d-flex gap-2">
                                                            <Button
                                                                  variant="outline-primary"
                                                                  onClick={fetchRegistrations}
                                                                  disabled={loading}
                                                                  style={{ borderRadius: '12px', fontWeight: '600' }}
                                                            >
                                                                  Refresh Data
                                                            </Button>
                                                      </div>
                                                </Col>
                                          </Row>
                                    </Card.Body>
                              </Card>

                              {/* Modern Table */}
                              <Card className="border-0 shadow-lg" style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(10px)',
                                    overflow: 'visible'
                              }}>
                                    <Card.Header style={{
                                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '12px 12px 0 0'
                                    }}>
                                          <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0 fw-bold">
                                                      <Trophy size={24} className="me-2" />
                                                      Game Registrations ({filteredRegistrations.length})
                                                </h5>
                                                <Badge bg="light" text="dark" style={{ fontSize: '14px' }}>
                                                      {filteredRegistrations.length} of {registrations.length}
                                                </Badge>
                                          </div>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                          {filteredRegistrations.length === 0 ? (
                                                <div className="text-center py-5">
                                                      <Trophy size={64} className="mb-4 text-muted" />
                                                      <h5 className="text-muted">No registrations found</h5>
                                                      <p className="text-muted">No registrations match your current filters.</p>
                                                </div>
                                          ) : (
                                                <div className="table-responsive">
                                                      <Table hover className="mb-0">
                                                            <thead style={{ background: '#f8f9fa' }}>
                                                                  <tr>
                                                                        <th className="border-0 py-3 px-4">Registration Details</th>
                                                                        <th className="border-0 py-3">Game Info</th>
                                                                        <th className="border-0 py-3">Participant/Team</th>
                                                                        <th className="border-0 py-3">Status</th>
                                                                        <th className="border-0 py-3">Fee</th>
                                                                        <th className="border-0 py-3 text-center">Actions</th>
                                                                  </tr>
                                                            </thead>
                                                            <tbody>
                                                                  {filteredRegistrations.map((registration) => (
                                                                        <tr key={registration._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                                                              <td className="py-3 px-4">
                                                                                    <div>
                                                                                          <Badge
                                                                                                bg="primary"
                                                                                                className="mb-2 font-monospace"
                                                                                                style={{ fontSize: '11px' }}
                                                                                          >
                                                                                                {registration.registrationId || 'N/A'}
                                                                                          </Badge>
                                                                                          <div className="small text-muted">
                                                                                                <Calendar size={14} className="me-1" />
                                                                                                {new Date(registration.createdAt || registration.registrationDate).toLocaleDateString()}
                                                                                          </div>
                                                                                    </div>
                                                                              </td>
                                                                              <td className="py-3">
                                                                                    <div>
                                                                                          <strong className="text-primary">{registration.gameName}</strong>
                                                                                          <div className="small text-muted">{registration.gameDay || 'Day 1'}</div>
                                                                                    </div>
                                                                              </td>
                                                                              <td className="py-3">
                                                                                    <div>
                                                                                          {registration.registrationType === 'team' ? (
                                                                                                <>
                                                                                                      <div className="fw-bold text-success">
                                                                                                            <Users size={16} className="me-1" />
                                                                                                            {registration.teamName || 'Team'}
                                                                                                      </div>
                                                                                                      <div className="small text-muted">
                                                                                                            Leader: {registration.teamLeader?.fullName || 'N/A'}
                                                                                                      </div>
                                                                                                      <div className="small text-muted">
                                                                                                            {1 + (registration.teamMembers?.length || 0)} members
                                                                                                      </div>
                                                                                                </>
                                                                                          ) : (
                                                                                                <>
                                                                                                      <div className="fw-bold">
                                                                                                            <User size={16} className="me-1" />
                                                                                                            {registration.teamLeader?.fullName || 'N/A'}
                                                                                                      </div>
                                                                                                      <div className="small text-muted">
                                                                                                            {registration.teamLeader?.email || 'N/A'}
                                                                                                      </div>
                                                                                                </>
                                                                                          )}
                                                                                    </div>
                                                                              </td>
                                                                              <td className="py-3">
                                                                                    <div>
                                                                                          <Badge
                                                                                                bg={registration.approvalStatus === 'approved' ? 'success' :
                                                                                                      registration.approvalStatus === 'rejected' ? 'danger' : 'warning'}
                                                                                                style={{ fontSize: '12px' }}
                                                                                          >
                                                                                                {registration.approvalStatus === 'approved' ? 'Approved' :
                                                                                                      registration.approvalStatus === 'rejected' ? 'Rejected' : 'Pending'}
                                                                                          </Badge>
                                                                                          {registration.approvedBy && (
                                                                                                <div className="small text-success mt-1">
                                                                                                      By: {registration.approvedBy}
                                                                                                </div>
                                                                                          )}
                                                                                    </div>
                                                                              </td>
                                                                              <td className="py-3">
                                                                                    <strong className="text-success fs-5">₹{registration.totalFee}</strong>
                                                                              </td>
                                                                              <td className="py-3 text-center">
                                                                                    <div className="d-flex gap-1 justify-content-center">
                                                                                          {registration.approvalStatus !== 'approved' && (
                                                                                                <Button
                                                                                                      size="sm"
                                                                                                      variant="outline-success"
                                                                                                      onClick={() => handleStatusUpdate(registration._id, 'approved')}
                                                                                                      style={{ borderRadius: '8px' }}
                                                                                                >
                                                                                                      <CheckCircle size={14} />
                                                                                                </Button>
                                                                                          )}
                                                                                          {registration.approvalStatus !== 'rejected' && (
                                                                                                <Button
                                                                                                      size="sm"
                                                                                                      variant="outline-danger"
                                                                                                      onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                                                                                                      style={{ borderRadius: '8px' }}
                                                                                                >
                                                                                                      <XCircle size={14} />
                                                                                                </Button>
                                                                                          )}
                                                                                          <Button
                                                                                                size="sm"
                                                                                                variant="outline-primary"
                                                                                                onClick={() => {
                                                                                                      setSelectedRegistration(registration)
                                                                                                      setShowDetailsModal(true)
                                                                                                }}
                                                                                                style={{ borderRadius: '8px' }}
                                                                                          >
                                                                                                <Eye size={14} />
                                                                                          </Button>
                                                                                    </div>
                                                                              </td>
                                                                        </tr>
                                                                  ))}
                                                            </tbody>
                                                      </Table>
                                                </div>
                                          )}
                                    </Card.Body>
                              </Card>

                              {/* Enhanced Details Modal */}
                              <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="xl" centered>
                                    <Modal.Header closeButton style={{
                                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          color: 'white',
                                          border: 'none'
                                    }}>
                                          <Modal.Title className="d-flex align-items-center">
                                                <Eye size={24} className="me-2" />
                                                Registration Details
                                          </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', background: '#f8f9fa' }}>
                                          {selectedRegistration && (
                                                <div className="d-flex flex-column gap-4">
                                                      {/* Registration Overview */}
                                                      <Card className="border-0 shadow-sm">
                                                            <Card.Header style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                                                                  <h5 className="mb-0">Registration Overview</h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                  <Row className="g-4">
                                                                        <Col md={6}>
                                                                              <div className="d-flex flex-column gap-3">
                                                                                    <div>
                                                                                          <strong>Registration ID:</strong>
                                                                                          <Badge bg="primary" className="ms-2 font-monospace">
                                                                                                {selectedRegistration.registrationId || 'N/A'}
                                                                                          </Badge>
                                                                                    </div>
                                                                                    <div>
                                                                                          <strong>Game Name:</strong> {selectedRegistration.gameName}
                                                                                    </div>
                                                                                    <div>
                                                                                          <strong>Registration Type:</strong>
                                                                                          <Badge bg={selectedRegistration.registrationType === 'individual' ? 'info' : 'secondary'} className="ms-2">
                                                                                                {selectedRegistration.registrationType}
                                                                                          </Badge>
                                                                                    </div>
                                                                                    <div>
                                                                                          <strong>Total Fee:</strong>
                                                                                          <span className="text-success fw-bold fs-5 ms-2">₹{selectedRegistration.totalFee}</span>
                                                                                    </div>
                                                                              </div>
                                                                        </Col>
                                                                        <Col md={6}>
                                                                              <div className="d-flex flex-column gap-3">
                                                                                    <div>
                                                                                          <strong>Status:</strong>
                                                                                          <Badge
                                                                                                bg={selectedRegistration.approvalStatus === 'approved' ? 'success' :
                                                                                                      selectedRegistration.approvalStatus === 'rejected' ? 'danger' : 'warning'}
                                                                                                className="ms-2"
                                                                                          >
                                                                                                {selectedRegistration.approvalStatus}
                                                                                          </Badge>
                                                                                    </div>
                                                                                    {selectedRegistration.approvedBy && (
                                                                                          <div>
                                                                                                <strong>Approved By:</strong>
                                                                                                <span className="text-success ms-2">{selectedRegistration.approvedBy}</span>
                                                                                                {selectedRegistration.approvedAt && (
                                                                                                      <div className="small text-muted">
                                                                                                            on {new Date(selectedRegistration.approvedAt).toLocaleString()}
                                                                                                      </div>
                                                                                                )}
                                                                                          </div>
                                                                                    )}
                                                                                    <div>
                                                                                          <strong>Registration Date:</strong>
                                                                                          <span className="ms-2">
                                                                                                {new Date(selectedRegistration.createdAt || selectedRegistration.registrationDate).toLocaleString()}
                                                                                          </span>
                                                                                    </div>
                                                                              </div>
                                                                        </Col>
                                                                  </Row>
                                                            </Card.Body>
                                                      </Card>

                                                      {/* Team Leader/Participant Details */}
                                                      <Card className="border-0 shadow-sm">
                                                            <Card.Header style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                                                                  <h5 className="mb-0">
                                                                        {selectedRegistration.registrationType === 'team' ? 'Team Leader Details' : 'Participant Details'}
                                                                  </h5>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                  <Row className="g-3">
                                                                        <Col md={6}>
                                                                              <div className="d-flex align-items-center mb-2">
                                                                                    <User size={16} className="me-2 text-muted" />
                                                                                    <strong>Name:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.fullName || 'N/A'}</span>
                                                                              </div>
                                                                              <div className="d-flex align-items-center mb-2">
                                                                                    <Mail size={16} className="me-2 text-muted" />
                                                                                    <strong>Email:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.email || 'N/A'}</span>
                                                                              </div>
                                                                              <div className="d-flex align-items-center mb-2">
                                                                                    <Phone size={16} className="me-2 text-muted" />
                                                                                    <strong>Contact:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.contactNumber || 'N/A'}</span>
                                                                              </div>
                                                                        </Col>
                                                                        <Col md={6}>
                                                                              <div className="d-flex align-items-center mb-2">
                                                                                    <Building2 size={16} className="me-2 text-muted" />
                                                                                    <strong>College:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.collegeName || 'N/A'}</span>
                                                                              </div>
                                                                              <div className="mb-2">
                                                                                    <strong>Enrollment:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.enrollmentNumber || 'N/A'}</span>
                                                                              </div>
                                                                              <div className="mb-2">
                                                                                    <strong>Branch:</strong>
                                                                                    <span className="ms-2">{selectedRegistration.teamLeader?.branch || 'N/A'}</span>
                                                                              </div>
                                                                        </Col>
                                                                  </Row>
                                                            </Card.Body>
                                                      </Card>

                                                      {/* Team Members */}
                                                      {selectedRegistration.registrationType === 'team' && selectedRegistration.teamMembers?.length > 0 && (
                                                            <Card className="border-0 shadow-sm">
                                                                  <Card.Header style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                                                                        <h5 className="mb-0">Team Members ({selectedRegistration.teamMembers.length})</h5>
                                                                  </Card.Header>
                                                                  <Card.Body>
                                                                        <Row className="g-3">
                                                                              {selectedRegistration.teamMembers.map((member, index) => (
                                                                                    <Col md={6} key={index}>
                                                                                          <Card className="border-0" style={{ background: '#f8f9fa' }}>
                                                                                                <Card.Body className="p-3">
                                                                                                      <h6 className="text-primary mb-2">Member {index + 1}</h6>
                                                                                                      <div className="small">
                                                                                                            <div className="mb-1">
                                                                                                                  <User size={14} className="me-1" />
                                                                                                                  <strong>Name:</strong> {member.fullName || 'N/A'}
                                                                                                            </div>
                                                                                                            <div className="mb-1">
                                                                                                                  <Mail size={14} className="me-1" />
                                                                                                                  <strong>Email:</strong> {member.email || 'N/A'}
                                                                                                            </div>
                                                                                                            <div className="mb-1">
                                                                                                                  <Phone size={14} className="me-1" />
                                                                                                                  <strong>Contact:</strong> {member.contactNumber || 'N/A'}
                                                                                                            </div>
                                                                                                            <div className="mb-1">
                                                                                                                  <Building2 size={14} className="me-1" />
                                                                                                                  <strong>College:</strong> {member.collegeName || 'N/A'}
                                                                                                            </div>
                                                                                                      </div>
                                                                                                </Card.Body>
                                                                                          </Card>
                                                                                    </Col>
                                                                              ))}
                                                                        </Row>
                                                                  </Card.Body>
                                                            </Card>
                                                      )}
                                                </div>
                                          )}
                                    </Modal.Body>
                                    <Modal.Footer style={{ background: '#f8f9fa', border: 'none' }}>
                                          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                                                Close
                                          </Button>
                                          {selectedRegistration && (
                                                <div className="d-flex gap-2">
                                                      {selectedRegistration.approvalStatus !== 'approved' && (
                                                            <Button
                                                                  variant="success"
                                                                  onClick={() => {
                                                                        handleStatusUpdate(selectedRegistration._id, 'approved')
                                                                        setShowDetailsModal(false)
                                                                  }}
                                                            >
                                                                  <CheckCircle size={16} className="me-2" />
                                                                  Approve
                                                            </Button>
                                                      )}
                                                      {selectedRegistration.approvalStatus !== 'rejected' && (
                                                            <Button
                                                                  variant="danger"
                                                                  onClick={() => {
                                                                        handleStatusUpdate(selectedRegistration._id, 'rejected')
                                                                        setShowDetailsModal(false)
                                                                  }}
                                                            >
                                                                  <XCircle size={16} className="me-2" />
                                                                  Reject
                                                            </Button>
                                                      )}
                                                </div>
                                          )}
                                    </Modal.Footer>
                              </Modal>
                        </Container>
                  </div>
            </>
      )
}

export default AdminDashboardNew