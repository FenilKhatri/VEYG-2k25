import React, { useState, useEffect } from 'react'
import { Card, Alert } from 'react-bootstrap'
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react'

const RegistrationTimer = ({ deadline = '2025-09-13T23:59:59', onExpired }) => {
      const [timeLeft, setTimeLeft] = useState({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: false
      })

      useEffect(() => {
            const calculateTimeLeft = () => {
                  const now = new Date().getTime()
                  const deadlineTime = new Date(deadline).getTime()
                  const difference = deadlineTime - now

                  if (difference > 0) {
                        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

                        setTimeLeft({
                              days,
                              hours,
                              minutes,
                              seconds,
                              isExpired: false
                        })
                  } else {
                        setTimeLeft({
                              days: 0,
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                              isExpired: true
                        })

                        if (onExpired) {
                              onExpired()
                        }
                  }
            }

            // Calculate immediately
            calculateTimeLeft()

            // Update every second
            const timer = setInterval(calculateTimeLeft, 1000)

            return () => clearInterval(timer)
      }, [deadline, onExpired])

      const formatNumber = (num) => num.toString().padStart(2, '0')

      if (timeLeft.isExpired) {
            return (
                  <Alert variant="danger" className="mb-4">
                        <div className="d-flex align-items-center">
                              <AlertTriangle size={20} className="me-2" />
                              <strong>Registration Closed</strong>
                        </div>
                        <p className="mb-0 mt-2">
                              The registration deadline has passed. No new registrations are accepted.
                        </p>
                  </Alert>
            )
      }

      const isUrgent = timeLeft.days < 2
      const isLastDay = timeLeft.days === 0

      return (
            <Card className={`mb-4 ${isLastDay ? 'border-danger' : isUrgent ? 'border-warning' : 'border-primary'}`}>
                  <Card.Header className={`${isLastDay ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'} text-white`}>
                        <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                    <Clock size={18} className="me-2" />
                                    <h6 className="mb-0">Registration Deadline</h6>
                              </div>
                              {isLastDay && <AlertTriangle size={18} />}
                        </div>
                  </Card.Header>
                  <Card.Body>
                        <div className="text-center">
                              <div className="row g-2 mb-3">
                                    <div className="col-3">
                                          <div className={`p-3 rounded ${isLastDay ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'} text-white`}>
                                                <div className="h3 mb-0 fw-bold">{formatNumber(timeLeft.days)}</div>
                                                <small>Days</small>
                                          </div>
                                    </div>
                                    <div className="col-3">
                                          <div className={`p-3 rounded ${isLastDay ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'} text-white`}>
                                                <div className="h3 mb-0 fw-bold">{formatNumber(timeLeft.hours)}</div>
                                                <small>Hours</small>
                                          </div>
                                    </div>
                                    <div className="col-3">
                                          <div className={`p-3 rounded ${isLastDay ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'} text-white`}>
                                                <div className="h3 mb-0 fw-bold">{formatNumber(timeLeft.minutes)}</div>
                                                <small>Minutes</small>
                                          </div>
                                    </div>
                                    <div className="col-3">
                                          <div className={`p-3 rounded ${isLastDay ? 'bg-danger' : isUrgent ? 'bg-warning' : 'bg-primary'} text-white`}>
                                                <div className="h3 mb-0 fw-bold">{formatNumber(timeLeft.seconds)}</div>
                                                <small>Seconds</small>
                                          </div>
                                    </div>
                              </div>

                              <p className={`mb-0 ${isLastDay ? 'text-danger' : isUrgent ? 'text-warning' : 'text-muted'}`}>
                                    {isLastDay ? (
                                          <><AlertTriangle size={16} className="me-1" />Last day to register!</>
                                    ) : isUrgent ? (
                                          <><Clock size={16} className="me-1" />Hurry up! Registration closes soon</>
                                    ) : (
                                          <>Registration closes on September 13, 2025 at 11:59 PM</>
                                    )}
                              </p>
                        </div>
                  </Card.Body>
            </Card>
      )
}

export default RegistrationTimer