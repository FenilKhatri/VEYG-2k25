import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Badge, Table, Modal, Row, Col, Container } from 'react-bootstrap'
import { Users, Search, Filter, Download, Eye, CheckCircle, Clock, Trophy, XCircle } from 'lucide-react'
import PageHeroSection from '../components/HeroSection/PageHeroSection'
import apiService from '../services/api'

export default function AdminDashboard({ showToast }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllRegistrations()
      setRegistrations(response.data?.registrations || [])
    } catch (error) {
      console.error('Error fetching registrations:', error)
      showToast('Failed to load registrations', 'error')
      // Fallback to mock data if API fails
      setRegistrations(mockRegistrations)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demonstration
  const mockRegistrations = [
    {
      _id: "1",
      uniqueId: "VEYG2025001",
      gameName: "Algo Cricket",
      gameDay: "Day 1",
      registrationType: "team",
      teamName: "Code Warriors",
      teamLeader: {
        fullName: "John Doe",
        email: "john@example.com",
        contactNumber: "+91 9876543210",
        collegeName: "Saffrony Institute of Technology",
        enrollmentNumber: "21CS001",
        branch: "Computer Science",
      },
      teamMembers: [
        {
          fullName: "Jane Smith",
          email: "jane@example.com",
          contactNumber: "+91 9876543211",
          collegeName: "Saffrony Institute of Technology",
          enrollmentNumber: "21CS002",
          branch: "Computer Science",
        },
      ],
      totalFee: 200,
      approvalStatus: "approved",
      approvedBy: "Admin",
      registrationDate: new Date().toISOString(),
    },
    {
      _id: "2",
      uniqueId: "VEYG2025002",
      gameName: "BrainGo",
      gameDay: "Day 1",
      registrationType: "individual",
      teamLeader: {
        fullName: "Alice Johnson",
        email: "alice@example.com",
        contactNumber: "+91 9876543212",
        collegeName: "Tech University",
        enrollmentNumber: "21IT001",
        branch: "Information Technology",
      },
      totalFee: 100,
      approvalStatus: "pending",
      registrationDate: new Date().toISOString(),
    },
    {
      _id: "3",
      uniqueId: "VEYG2025003",
      gameName: "Logo2Logic",
      gameDay: "Day 2",
      registrationType: "team",
      teamName: "Logic Masters",
      teamLeader: {
        fullName: "Bob Wilson",
        email: "bob@example.com",
        contactNumber: "+91 9876543213",
        collegeName: "Engineering College",
        enrollmentNumber: "21EC001",
        branch: "Electronics",
      },
      teamMembers: [
        {
          fullName: "Carol Brown",
          email: "carol@example.com",
          contactNumber: "+91 9876543214",
          collegeName: "Engineering College",
          enrollmentNumber: "21EC002",
          branch: "Electronics",
        },
      ],
      totalFee: 150,
      approvalStatus: "rejected",
      registrationDate: new Date().toISOString(),
    },
  ]

  const stats = {
    total: registrations.length,
    approved: registrations.filter((r) => r.approvalStatus === "approved").length,
    pending: registrations.filter((r) => r.approvalStatus === "pending").length,
    rejected: registrations.filter((r) => r.approvalStatus === "rejected").length,
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.gameName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.teamLeader?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    if (filterStatus !== "all") {
      matchesFilter = reg.approvalStatus === filterStatus
    }

    return matchesSearch && matchesFilter
  })

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await apiService.updateRegistrationStatus(registrationId, { approvalStatus: newStatus })
      showToast(`Registration ${newStatus} successfully!`, 'success')
      fetchRegistrations() // Refresh data
    } catch (error) {
      console.error('Error updating status:', error)
      showToast('Failed to update registration status', 'error')
    }
  }

  const handleExport = async (type) => {
    try {
      let blob
      if (type === 'students') {
        blob = await apiService.exportStudentRegistrations()
      } else if (type === 'games') {
        blob = await apiService.exportGameRegistrations()
      } else {
        blob = await apiService.exportAllRegistrations()
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      showToast(`${type} data exported successfully!`, 'success')
    } catch (error) {
      console.error('Export error:', error)
      showToast('Failed to export data', 'error')
    }
  }

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <>
        <PageHeroSection
          title="Admin Dashboard"
          subtitle="Manage Game Registrations"
          icon={Trophy}
          description="Monitor and manage all game registrations and participant activities."
        />
        <div style={{
          background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
          minHeight: '100vh',
          padding: '40px 0'
        }}>
          <Container>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Container>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeroSection
        title="Admin Dashboard"
        subtitle="Manage Game Registrations"
        icon={Trophy}
        description="Monitor and manage all game registrations and participant activities."
      />

      <div style={{
        background: 'linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)',
        minHeight: '100vh',
        padding: '40px 0'
      }}>
        <Container>
          <div className="d-flex flex-column gap-4">
            {/* Header */}
            <div className="text-center">
              <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                <Trophy className="text-primary" size={48} />
              </div>
              <h1 className="display-4 fw-bold text-dark">Admin Dashboard</h1>
              <p className="fs-5 text-muted">Manage game registrations and monitor activities</p>
            </div>

            {/* Stats Cards */}
            <Row className="g-4">
              <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="fs-6 fw-medium text-muted">Total Registrations</Card.Title>
                        <div className="fs-2 fw-bold text-dark">{stats.total}</div>
                        <small className="text-muted">All registrations</small>
                      </div>
                      <Users className="text-primary" size={20} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="fs-6 fw-medium text-muted">Approved</Card.Title>
                        <div className="fs-2 fw-bold text-success">{stats.approved}</div>
                        <small className="text-muted">Confirmed registrations</small>
                      </div>
                      <CheckCircle className="text-success" size={20} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="fs-6 fw-medium text-muted">Pending</Card.Title>
                        <div className="fs-2 fw-bold text-warning">{stats.pending}</div>
                        <small className="text-muted">Awaiting approval</small>
                      </div>
                      <Clock className="text-warning" size={20} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title className="fs-6 fw-medium text-muted">Rejected</Card.Title>
                        <div className="fs-2 fw-bold text-danger">{stats.rejected}</div>
                        <small className="text-muted">Declined registrations</small>
                      </div>
                      <XCircle className="text-danger" size={20} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters and Actions */}
            <Card className="shadow-sm">
              <Card.Header>
                <Card.Title className="mb-1">Registration Management</Card.Title>
                <Card.Text className="text-muted mb-0">Search, filter, and manage all game registrations</Card.Text>
              </Card.Header>
              <Card.Body>
                <Row className="g-3 align-items-end">
                  <Col md={6}>
                    <Form.Group className="position-relative">
                      <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
                      <Form.Control
                        type="text"
                        placeholder="Search by game name or participant name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center gap-2">
                      <Filter className="text-muted" size={16} />
                      <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button variant="outline-primary" size="sm" onClick={fetchRegistrations}>
                        Refresh Data
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Registrations Table */}
            <Card className="shadow-sm">
              <Card.Header>
                <Card.Title className="mb-0">Game Registrations ({filteredRegistrations.length})</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-5">
                    <Trophy className="text-muted mx-auto mb-3" size={64} />
                    <h5 className="text-muted mb-2">No registrations found</h5>
                    <p className="text-muted">No registrations match your current filters.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Registration ID</th>
                          <th>Game</th>
                          <th>Team/Participant</th>
                          <th>Type</th>
                          <th>Fee</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations.map((registration) => (
                          <tr key={registration._id}>
                            <td>
                              <Badge bg="outline-secondary" className="font-monospace">
                                {registration.uniqueId}
                              </Badge>
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium">{registration.gameName}</div>
                                <small className="text-muted">{registration.gameDay}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                {registration.registrationType === "team" ? (
                                  <>
                                    <div className="fw-medium text-primary">{registration.teamName}</div>
                                    <small className="text-muted d-block">
                                      Leader: {registration.teamLeader?.fullName}
                                    </small>
                                    <small className="text-muted">
                                      {1 + (registration.teamMembers?.length || 0)} members
                                    </small>
                                  </>
                                ) : (
                                  <>
                                    <div className="fw-medium">{registration.teamLeader?.fullName}</div>
                                    <small className="text-muted">{registration.teamLeader?.email}</small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge bg={registration.registrationType === "individual" ? "primary" : "secondary"}>
                                {registration.registrationType === "individual" ? "Individual" : "Team"}
                              </Badge>
                            </td>
                            <td>
                              <span className="fw-semibold text-primary">₹{registration.totalFee}</span>
                            </td>
                            <td>
                              <Badge
                                bg={
                                  registration.approvalStatus === "approved"
                                    ? "success"
                                    : registration.approvalStatus === "rejected"
                                      ? "danger"
                                      : "warning"
                                }
                              >
                                {registration.approvalStatus === "approved"
                                  ? "Approved"
                                  : registration.approvalStatus === "rejected"
                                    ? "Rejected"
                                    : "Pending"}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                {registration.approvalStatus !== "approved" && (
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleStatusUpdate(registration._id, "approved")}
                                  >
                                    Approve
                                  </Button>
                                )}
                                {registration.approvalStatus !== "rejected" && (
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleStatusUpdate(registration._id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleViewDetails(registration)}
                                >
                                  <Eye size={16} />
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
          </div>
        </Container>
      </div>

      {/* Registration Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Eye size={20} />
            Registration Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedRegistration && (
            <div className="d-flex flex-column gap-4">
              <Row className="g-4">
                <Col md={6}>
                  <h5 className="text-primary mb-3">Game Information</h5>
                  <div className="d-flex flex-column gap-2">
                    <div>
                      <strong>Game Name:</strong> {selectedRegistration.gameName}
                    </div>
                    <div>
                      <strong>Registration Type:</strong> {selectedRegistration.registrationType}
                    </div>
                    <div>
                      <strong>Total Fee:</strong> ₹{selectedRegistration.totalFee}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="text-primary mb-3">Status Information</h5>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <strong>Status:</strong>
                      <Badge
                        bg={
                          selectedRegistration.approvalStatus === "approved"
                            ? "success"
                            : selectedRegistration.approvalStatus === "rejected"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {selectedRegistration.approvalStatus}
                      </Badge>
                    </div>
                    {selectedRegistration.approvedBy && (
                      <div>
                        <strong>Approved By:</strong> {selectedRegistration.approvedBy}
                        {selectedRegistration.approvedAt && (
                          <small className="text-muted ms-2">
                            on {new Date(selectedRegistration.approvedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        )}
                      </div>
                    )}
                    {selectedRegistration.rejectedBy && (
                      <div>
                        <strong>Rejected By:</strong> {selectedRegistration.rejectedBy}
                        {selectedRegistration.rejectedAt && (
                          <small className="text-muted ms-2">
                            on {new Date(selectedRegistration.rejectedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        )}
                      </div>
                    )}
                    <div>
                      <strong>Registration Date:</strong>{" "}
                      {selectedRegistration.createdAt
                        ? new Date(selectedRegistration.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : selectedRegistration.registrationDate
                          ? new Date(selectedRegistration.registrationDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : 'N/A'
                      }
                    </div>
                  </div>
                </Col>
              </Row>

              <div>
                <h5 className="text-primary mb-3">
                  {selectedRegistration.registrationType === "team"
                    ? "Team Leader Details"
                    : "Participant Details"}
                </h5>
                <Card className="bg-light">
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <div><strong>Name:</strong> {selectedRegistration.teamLeader?.fullName}</div>
                      </Col>
                      <Col md={6}>
                        <div><strong>Email:</strong> {selectedRegistration.teamLeader?.email}</div>
                      </Col>
                      <Col md={6}>
                        <div><strong>Contact:</strong> {selectedRegistration.teamLeader?.contactNumber}</div>
                      </Col>
                      <Col md={6}>
                        <div><strong>College:</strong> {selectedRegistration.teamLeader?.collegeName}</div>
                      </Col>
                      <Col md={6}>
                        <div><strong>Enrollment:</strong> {selectedRegistration.teamLeader?.enrollmentNumber}</div>
                      </Col>
                      <Col md={6}>
                        <div><strong>Branch:</strong> {selectedRegistration.teamLeader?.branch}</div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>

              {selectedRegistration.registrationType === "team" && selectedRegistration.teamMembers?.length > 0 && (
                <div>
                  <h5 className="text-primary mb-3">Team Members</h5>
                  <div className="d-flex flex-column gap-3">
                    {selectedRegistration.teamMembers.map((member, index) => (
                      <Card key={index} className="bg-light">
                        <Card.Body>
                          <h6 className="text-success mb-2">Member {index + 1}</h6>
                          <Row className="g-3">
                            <Col md={6}>
                              <div><strong>Name:</strong> {member.fullName}</div>
                            </Col>
                            <Col md={6}>
                              <div><strong>Email:</strong> {member.email}</div>
                            </Col>
                            <Col md={6}>
                              <div><strong>Contact:</strong> {member.contactNumber}</div>
                            </Col>
                            <Col md={6}>
                              <div><strong>College:</strong> {member.collegeName}</div>
                            </Col>
                            <Col md={6}>
                              <div><strong>Enrollment:</strong> {member.enrollmentNumber}</div>
                            </Col>
                            <Col md={6}>
                              <div><strong>Branch:</strong> {member.branch}</div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
