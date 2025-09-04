import React, { useState } from 'react'
import { Card, Accordion, Badge } from 'react-bootstrap'
import { CheckCircle, User, Calendar, CreditCard, Download, Shield, Trophy } from 'lucide-react'

const RegistrationRules = () => {
  const [activeKey, setActiveKey] = useState('0')

  const steps = [
    {
      id: '0',
      title: 'Create an account & log in',
      icon: <User size={24} />,
      description: 'Register using your college email address and log in. (If the site requires email verification, complete that step.)',
      color: '#00d4ff'
    },
    {
      id: '1',
      title: 'Explore events',
      icon: <Calendar size={24} />,
      description: 'Browse the Day 1 and Day 2 game lists and read each game\'s description, rules, team size, and schedule carefully.',
      color: '#007bff'
    },
    {
      id: '2',
      title: 'Choose wisely',
      icon: <CheckCircle size={24} />,
      description: 'You may register for only one game per day. If you register for a Day 1 game, you cannot register for another Day 1 game (same rule for Day 2). Decide carefully before submitting.',
      color: '#ffc107',
      important: true
    },
    {
      id: '3',
      title: 'Register and pay',
      icon: <CreditCard size={24} />,
      description: [
        'Fill out the registration form for the game you choose.',
        'Go to the Registered Games page and download your registration receipt (it contains your registration ID).',
        'Visit the cashier, present the downloaded receipt/registration ID, and make the payment. The cashier will verify your registration and confirm payment.'
      ],
      color: '#28a745'
    },
    {
      id: '4',
      title: 'Confirmation & receipt',
      icon: <Download size={24} />,
      description: 'After payment is confirmed you can download the final payment-confirmed receipt. A confirmation email will be sent to all participating members.',
      color: '#17a2b8'
    },
    {
      id: '5',
      title: 'Keep your receipt safe',
      icon: <Shield size={24} />,
      description: 'Store the payment receipt securely. If the receipt is lost or missing, resolving issues will be your responsibility—keep the document as proof of payment.',
      color: '#dc3545',
      important: true
    },
    {
      id: '6',
      title: 'Enjoy the game!',
      icon: <Trophy size={24} />,
      description: 'You\'re all set! Show up on time and have fun competing in your registered games.',
      color: '#6f42c1'
    }
  ]

  return (
    <Card
      className="registration-rules-card"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        borderRadius: '18px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 25px rgba(0, 234, 255, 0.15)',
        overflow: 'hidden'
      }}
    >
      <Card.Header
        className="text-center py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 140, 255, 0.15))',
          borderBottom: '1px solid rgba(0, 212, 255, 0.25)'
        }}
      >
        <h3
          className="mb-0 fw-bold"
          style={{
            color: '#00eaff',
            textShadow: '0 0 10px rgba(0, 234, 255, 0.6)',
            fontSize: '1.8rem'
          }}
        >
          Registration Rules & Steps
        </h3>
        <p
          className="mb-0 mt-2"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem'
          }}
        >
          Follow these steps to successfully register for VEYG 2025
        </p>
      </Card.Header>

      <Card.Body className="p-4">
        <Accordion 
          activeKey={activeKey} 
          onSelect={(key) => setActiveKey(key)}
          className="registration-accordion"
        >
          {steps.map((step, index) => (
            <Accordion.Item
              key={step.id}
              eventKey={step.id}
              className="mb-3"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${step.important ? '#ffc107' : 'rgba(0, 212, 255, 0.2)'}`,
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <Accordion.Header
                style={{
                  background: step.important 
                    ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))'
                    : 'rgba(0, 212, 255, 0.05)',
                  border: 'none'
                }}
              >
                <div className="d-flex align-items-center w-100">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5
                        className="mb-0 fw-bold"
                        style={{
                          color: '#fff',
                          fontSize: '1.2rem'
                        }}
                      >
                        Step {index + 1}: {step.title}
                      </h5>
                      {step.important && (
                        <Badge
                          bg="warning"
                          className="ms-2"
                          style={{
                            color: '#000',
                            fontWeight: '600'
                          }}
                        >
                          Important
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body
                style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderTop: '1px solid rgba(0, 212, 255, 0.1)',
                  color: '#dffaff'
                }}
              >
                {Array.isArray(step.description) ? (
                  <ul className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {step.description.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {step.description}
                  </p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Body>

      <style>{`
        .registration-rules-card .accordion-button {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: white !important;
          padding: 1.5rem !important;
        }
        
        .registration-rules-card .accordion-button:not(.collapsed) {
          background: transparent !important;
          color: white !important;
        }
        
        .registration-rules-card .accordion-button::after {
          filter: brightness(0) invert(1);
        }
        
        .registration-rules-card .accordion-button:focus {
          box-shadow: none !important;
        }
        
        .registration-rules-card .accordion-body {
          padding: 1.5rem !important;
        }
        
        .registration-accordion .accordion-item {
          transition: all 0.3s ease;
        }
        
        .registration-accordion .accordion-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 212, 255, 0.2);
        }
      `}</style>
    </Card>
  )
}

export default RegistrationRules
