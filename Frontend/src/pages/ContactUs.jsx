import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  Send,
  Mail,
  MessageCircle,
  User,
  Phone,
  MapPin,
  CheckCircle
} from "lucide-react";

const ContactUs = ({ showToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please provide your name.";
    if (!formData.email.trim()) return "Please provide your email.";
    if (!formData.subject.trim()) return "Please provide a subject.";
    if (!formData.message.trim()) return "Please provide a message.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) return "Please provide a valid email address.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003'}/api/form/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `radial-gradient(circle at 25% 25%, #00d4ff 0%, transparent 50%), 
                         radial-gradient(circle at 75% 75%, #007bff 0%, transparent 50%)`,
        backgroundSize: '400px 400px'
      }}></div>

      <Container className="py-5 position-relative" style={{ zIndex: 2, marginTop: 50 }}>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={8} xl={6}>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                borderRadius: '50%',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
              }}>
                <MessageCircle size={40} color="white" />
              </div>
              <h1 style={{
                color: '#00d4ff',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Contact VEYG 2K25</h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                Get in touch with our team for any queries or support
              </p>
            </div>

            {/* Contact Form Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              padding: '2.5rem'
            }}>
              {success && (
                <Alert variant="success" className="mb-4" style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px solid rgba(40, 167, 69, 0.3)',
                  color: '#baf0c9'
                }}>
                  <CheckCircle size={20} className="me-2" />
                  Message sent successfully! We'll get back to you soon.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <User size={18} className="me-2" />
                        Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        disabled={loading}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <Mail size={18} className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        disabled={loading}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <MessageCircle size={18} className="me-2" />
                        Subject
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter message subject"
                        disabled={loading}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label style={{ color: '#00d4ff', fontWeight: '500' }}>
                        <MessageCircle size={18} className="me-2" />
                        Message
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message..."
                        disabled={loading}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '2px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px 20px',
                          fontSize: '16px',
                          resize: 'vertical'
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex gap-3 align-items-center">
                      <Button
                        type="submit"
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                          border: 'none',
                          padding: '12px 24px',
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          borderRadius: '12px'
                        }}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={20} className="me-2" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline-light"
                        onClick={() => {
                          setFormData({ name: "", email: "", subject: "", message: "" });
                          setSuccess(false);
                        }}
                        disabled={loading}
                        style={{
                          borderRadius: '12px',
                          padding: '12px 24px'
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* Contact Information */}
            <Row className="mt-5 g-4">
              <Col md={4}>
                <div className="text-center p-4 h-100 d-flex flex-column"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    margin: 0,
                    flex: 1,
                    wordWrap: 'break-word',         // ✅ Forces wrapping
                    overflowWrap: 'break-word',     // ✅ Ensures proper wrapping
                    wordBreak: 'break-all',         // ✅ Breaks long words if needed
                    textAlign: 'center'             // ✅ Keeps it centered
                  }}>
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <Mail size={24} color="white" />
                  </div>
                  <h5 style={{ color: 'white', marginBottom: '0.5rem' }}>Email</h5>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, flex: 1 }}>
                    veyg.notification@gmail.com
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="text-center p-4 h-100 d-flex flex-column" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minHeight: '160px'
                }}>
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <Phone size={24} color="white" />
                  </div>
                  <h5 style={{ color: 'white', marginBottom: '0.5rem' }}>Phone</h5>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, flex: 1 }}>
                    +91 98765 43210
                  </p>
                </div>
              </Col>

              <Col md={4}>
                <div className="text-center p-4 h-100 d-flex flex-column" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minHeight: '160px'
                }}>
                  <div className="mb-3" style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #00d4ff, #007bff)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <MapPin size={24} color="white" />
                  </div>
                  <h5 style={{ color: 'white', marginBottom: '0.5rem' }}>Location</h5>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, flex: 1 }}>
                    Saffrony Institute of Technology
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <style>{`
        .form-control:focus {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: #00d4ff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 212, 255, 0.25) !important;
          color: white !important;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
