import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react'

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
                  <div className="registration-timer-expired mb-5">
                        <div className="expired-content">
                              <div className="expired-icon">
                                    <AlertTriangle size={32} />
                              </div>
                              <div className="expired-text">
                                    <h3>Registration Closed</h3>
                                    <p>The registration deadline has passed. No new registrations are accepted.</p>
                              </div>
                        </div>
                  </div>
            )
      }

      const isUrgent = timeLeft.days < 2
      const isLastDay = timeLeft.days === 0

      return (
            <div className="registration-timer-container mb-5">
                  <div className="registration-timer-header">
                        <div className="timer-title">
                              <Clock size={24} />
                              <h3>Registration Countdown</h3>
                        </div>
                        <div className="timer-date">
                              <Calendar size={18} />
                              <span>Ends September 13, 2025</span>
                        </div>
                  </div>
                  
                  <div className="registration-timer-body">
                        <div className="timer-units">
                              <div className="timer-unit">
                                    <div className="unit-value">{formatNumber(timeLeft.days)}</div>
                                    <div className="unit-label">Days</div>
                              </div>
                              <div className="timer-separator">:</div>
                              <div className="timer-unit">
                                    <div className="unit-value">{formatNumber(timeLeft.hours)}</div>
                                    <div className="unit-label">Hours</div>
                              </div>
                              <div className="timer-separator">:</div>
                              <div className="timer-unit">
                                    <div className="unit-value">{formatNumber(timeLeft.minutes)}</div>
                                    <div className="unit-label">Minutes</div>
                              </div>
                              <div className="timer-separator">:</div>
                              <div className="timer-unit">
                                    <div className="unit-value">{formatNumber(timeLeft.seconds)}</div>
                                    <div className="unit-label">Seconds</div>
                              </div>
                        </div>
                        
                        {isLastDay && (
                              <div className="timer-alert urgent">
                                    <AlertTriangle size={18} />
                                    <span>Last day to register! Don't miss out!</span>
                              </div>
                        )}
                        
                        {isUrgent && !isLastDay && (
                              <div className="timer-alert warning">
                                    <Clock size={18} />
                                    <span>Hurry up! Registration closes soon</span>
                              </div>
                        )}
                  </div>
                  
                  <style jsx>{`
                        .registration-timer-container {
                              background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
                              border: 1px solid rgba(0, 212, 255, 0.3);
                              border-radius: 16px;
                              overflow: hidden;
                              backdrop-filter: blur(10px);
                              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                        }
                        
                        .registration-timer-header {
                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                              padding: 20px 30px;
                              background: rgba(0, 212, 255, 0.15);
                              border-bottom: 1px solid rgba(0, 212, 255, 0.2);
                        }
                        
                        .timer-title {
                              display: flex;
                              align-items: center;
                              gap: 12px;
                              color: #00eaff;
                        }
                        
                        .timer-title h3 {
                              margin: 0;
                              font-size: 1.5rem;
                              font-weight: 700;
                        }
                        
                        .timer-date {
                              display: flex;
                              align-items: center;
                              gap: 8px;
                              color: rgba(255, 255, 255, 0.7);
                              font-size: 0.9rem;
                        }
                        
                        .registration-timer-body {
                              padding: 30px;
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                        }
                        
                        .timer-units {
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              gap: 10px;
                              margin-bottom: 20px;
                        }
                        
                        .timer-unit {
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              min-width: 80px;
                        }
                        
                        .unit-value {
                              font-size: 2.5rem;
                              font-weight: 700;
                              color: white;
                              text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
                              background: ${isLastDay ? 'linear-gradient(45deg, #ff6b6b, #ff0076)' : isUrgent ? 'linear-gradient(45deg, #ffa600, #ff6b00)' : 'linear-gradient(45deg, #00eaff, #2979ff)'};
                              -webkit-background-clip: text;
                              -webkit-text-fill-color: transparent;
                              line-height: 1;
                        }
                        
                        .unit-label {
                              font-size: 0.8rem;
                              color: rgba(255, 255, 255, 0.6);
                              text-transform: uppercase;
                              letter-spacing: 1px;
                              margin-top: 5px;
                        }
                        
                        .timer-separator {
                              font-size: 2.5rem;
                              font-weight: 700;
                              color: rgba(255, 255, 255, 0.3);
                              margin-top: -10px;
                        }
                        
                        .timer-alert {
                              display: flex;
                              align-items: center;
                              gap: 10px;
                              padding: 12px 20px;
                              border-radius: 30px;
                              font-weight: 600;
                              margin-top: 10px;
                        }
                        
                        .timer-alert.urgent {
                              background: rgba(255, 107, 107, 0.15);
                              border: 1px solid rgba(255, 107, 107, 0.3);
                              color: #ff6b6b;
                        }
                        
                        .timer-alert.warning {
                              background: rgba(255, 166, 0, 0.15);
                              border: 1px solid rgba(255, 166, 0, 0.3);
                              color: #ffa600;
                        }
                        
                        .registration-timer-expired {
                              background: rgba(255, 107, 107, 0.1);
                              border: 1px solid rgba(255, 107, 107, 0.3);
                              border-radius: 16px;
                              padding: 30px;
                        }
                        
                        .expired-content {
                              display: flex;
                              align-items: center;
                              gap: 20px;
                        }
                        
                        .expired-icon {
                              background: rgba(255, 107, 107, 0.2);
                              border-radius: 50%;
                              width: 70px;
                              height: 70px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              color: #ff6b6b;
                              flex-shrink: 0;
                        }
                        
                        .expired-text h3 {
                              color: #ff6b6b;
                              margin: 0 0 10px 0;
                              font-size: 1.5rem;
                              font-weight: 700;
                        }
                        
                        .expired-text p {
                              color: rgba(255, 255, 255, 0.7);
                              margin: 0;
                              font-size: 1rem;
                        }
                        
                        @media (max-width: 768px) {
                              .registration-timer-header {
                                    flex-direction: column;
                                    align-items: flex-start;
                                    gap: 10px;
                              }
                              
                              .timer-units {
                                    flex-wrap: wrap;
                              }
                              
                              .timer-unit {
                                    min-width: 60px;
                              }
                              
                              .unit-value {
                                    font-size: 2rem;
                              }
                              
                              .timer-separator {
                                    font-size: 2rem;
                              }
                              
                              .expired-content {
                                    flex-direction: column;
                                    text-align: center;
                              }
                        }
                  `}</style>
            </div>
      )
}

export default RegistrationTimer