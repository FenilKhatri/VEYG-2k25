import React from 'react'
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap'
import { Calendar, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react'
import { useDayWiseRegistration } from '../hooks/useDayWiseRegistration'

const DayWiseRegistrationStatus = ({ onRegisterClick, showRegisterButton = true }) => {
      const {
            dayWiseStatus,
            loading,
            error,
            getRegistrationSummary,
            canRegisterForDay,
            getRegisteredGameForDay
      } = useDayWiseRegistration()

      const summary = getRegistrationSummary()

      if (loading) {
            return (
                  <Card className="mb-4">
                        <Card.Body className="text-center py-4">
                              <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                              </div>
                              <p className="mt-2 mb-0">Loading registration status...</p>
                        </Card.Body>
                  </Card>
            )
      }

      if (error) {
            return (
                  <Alert variant="danger" className="mb-4">
                        <strong>Error:</strong> {error}
                  </Alert>
            )
      }

      const getDayStatusBadge = (day) => {
            const registered = !canRegisterForDay(day)
            return registered ? (
                  <Badge bg="success" className="d-flex align-items-center gap-1">
                        <CheckCircle size={14} />
                        Registered
                  </Badge>
            ) : (
                  <Badge bg="secondary" className="d-flex align-items-center gap-1">
                        <Clock size={14} />
                        Available
                  </Badge>
            )
      }

      const getDayCard = (day) => {
            const registeredGame = getRegisteredGameForDay(day)
            const canRegister = canRegisterForDay(day)

            return (
                  <Card className={`h-100 ${canRegister ? 'border-primary' : 'border-success'}`}>
                        <Card.Header className={`d-flex justify-content-between align-items-center ${canRegister ? 'bg-light' : 'bg-success text-white'}`}>
                              <div className="d-flex align-items-center gap-2">
                                    <Calendar size={18} />
                                    <strong>Day {day}</strong>
                              </div>
                              {getDayStatusBadge(day)}
                        </Card.Header>
                        <Card.Body>
                              {registeredGame ? (
                                    <div>
                                          <div className="d-flex align-items-center gap-2 mb-2">
                                                <Trophy size={16} className="text-warning" />
                                                <strong className="text-primary">{registeredGame.gameName}</strong>
                                          </div>
                                          <p className="text-muted small mb-2">
                                                Registration ID: <code>{registeredGame.registrationId}</code>
                                          </p>
                                          <div className="d-flex gap-2">
                                                <Badge bg={registeredGame.approvalStatus === 'approved' ? 'success' :
                                                      registeredGame.approvalStatus === 'rejected' ? 'danger' : 'warning'}>
                                                      {registeredGame.approvalStatus || 'pending'}
                                                </Badge>
                                                <Badge bg={registeredGame.paymentStatus === 'paid' ? 'success' :
                                                      registeredGame.paymentStatus === 'failed' ? 'danger' : 'warning'}>
                                                      {registeredGame.paymentStatus || 'pending'}
                                                </Badge>
                                          </div>
                                    </div>
                              ) : (
                                    <div className="text-center py-3">
                                          <XCircle size={32} className="text-muted mb-2" />
                                          <p className="text-muted mb-3">No registration for Day {day}</p>
                                          {showRegisterButton && canRegister && (
                                                <Button
                                                      variant="primary"
                                                      size="sm"
                                                      onClick={() => onRegisterClick && onRegisterClick(day)}
                                                >
                                                      Register for Day {day}
                                                </Button>
                                          )}
                                    </div>
                              )}
                        </Card.Body>
                  </Card>
            )
      }

      return (
            <div className="day-wise-registration-status">
                  <Card className="mb-4">
                        <Card.Header className="bg-primary text-white">
                              <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Registration Status</h5>
                                    <Badge bg="light" text="dark" className="fs-6">
                                          {summary.totalRegistrations}/2 Days
                                    </Badge>
                              </div>
                        </Card.Header>
                        <Card.Body>
                              {summary.totalRegistrations === 0 && (
                                    <Alert variant="info" className="mb-3">
                                          <strong>Welcome!</strong> You can register for one game per day (maximum 2 games total).
                                    </Alert>
                              )}

                              {summary.totalRegistrations === 2 && (
                                    <Alert variant="success" className="mb-3">
                                          <CheckCircle size={16} className="me-2" />
                                          <strong>All Set!</strong> You have registered for both days.
                                    </Alert>
                              )}

                              <Row>
                                    <Col md={6} className="mb-3">
                                          {getDayCard(1)}
                                    </Col>
                                    <Col md={6} className="mb-3">
                                          {getDayCard(2)}
                                    </Col>
                              </Row>

                              {summary.canRegisterMore && (
                                    <div className="text-center mt-3">
                                          <p className="text-muted mb-2">
                                                You can still register for {summary.availableDays.length} more day{summary.availableDays.length > 1 ? 's' : ''}
                                          </p>
                                          {showRegisterButton && (
                                                <div className="d-flex gap-2 justify-content-center">
                                                      {summary.availableDays.map(day => (
                                                            <Button
                                                                  key={day}
                                                                  variant="outline-primary"
                                                                  onClick={() => onRegisterClick && onRegisterClick(day)}
                                                            >
                                                                  Register for Day {day}
                                                            </Button>
                                                      ))}
                                                </div>
                                          )}
                                    </div>
                              )}
                        </Card.Body>
                  </Card>
            </div>
      )
}

export default DayWiseRegistrationStatus