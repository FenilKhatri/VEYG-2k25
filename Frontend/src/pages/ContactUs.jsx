/*  */import { useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { Send, Mail, MessageCircle, User, Zap, Phone, MapPin } from "lucide-react"
import PageHeroSection from "../components/HeroSection/PageHeroSection"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/form/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage("Message sent successfully!")
        setFormData({ username: "", email: "", message: "" })
      } else {
        setSubmitMessage("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitMessage("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeroSection
        title="Contact Us"
        subtitle="Get In Touch With Our Team"
        icon={MessageCircle}
        description="Have questions about VEYG 2K25? Need technical support? We're here to help you with all your queries and concerns."
      />

      {/* Main Content */}
      <div className="contact-content-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="contact-grid">
                {/* Contact Form */}
                <div className="contact-form-card">
                  <div className="card-header">
                    <Send size={24} />
                    <h2>Send Us a Message</h2>
                  </div>
                  <div className="card-content">
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="username">
                            <User size={18} />
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">
                            <Mail size={18} />
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            required
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">
                          <MessageCircle size={18} />
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          required
                          placeholder="Tell us how we can help you..."
                        />
                      </div>
                      <button
                        type="submit"
                        className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                      {submitMessage && (
                        <div className={`submit-message ${submitMessage.includes("successfully") ? "success" : "error"}`}>
                          {submitMessage}
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="contact-info-card">
                  <div className="card-header">
                    <Zap size={24} />
                    <h2>Contact Information</h2>
                  </div>
                  <div className="card-content">
                    <div className="contact-info-list">
                      <div className="contact-info-item">
                        <div className="info-icon">
                          <Mail size={20} />
                        </div>
                        <div className="info-content">
                          <h4>Email</h4>
                          <p>veyg.notification@gmail.com</p>
                          <a href="mailto:veyg.notification@gmail.com" className="contact-link">
                            Send Email
                          </a>
                        </div>
                      </div>

                      <div className="contact-info-item">
                        <div className="info-icon">
                          <Phone size={20} />
                        </div>
                        <div className="info-content">
                          <h4>Support</h4>
                          <p>24/7 Technical Support</p>
                          <a href="tel:+919876543210" className="contact-link">
                            Available
                          </a>
                        </div>
                      </div>

                      <div className="contact-info-item">
                        <div className="info-icon">
                          <MapPin size={20} />
                        </div>
                        <div className="info-content">
                          <h4>Event Location</h4>
                          <p>Technical Competition Venue</p>
                          <button
                            onClick={() => {
                              const mapWindow = window.open('', '_blank', 'width=800,height=600');
                              mapWindow.document.write(`
                                <html>
                                  <head><title>Event Location - VEYG 2K25</title></head>
                                  <body style="margin:0;padding:0;">
                                    <iframe 
                                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" 
                                      width="100%" 
                                      height="100%" 
                                      style="border:0;" 
                                      allowfullscreen="" 
                                      loading="lazy" 
                                      referrerpolicy="no-referrer-when-downgrade">
                                    </iframe>
                                  </body>
                                </html>
                              `);
                            }}
                            className="contact-link"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer'
                            }}
                          >
                            Event Location
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="response-time">
                      <div className="response-badge">
                        <Zap size={16} />
                        Quick Response
                      </div>
                      <p>We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{`
        .contact-hero-section {
          position: relative;
          height: 100vh;
          background: linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 70%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 30%, rgba(0, 123, 255, 0.1) 0%, transparent 50%);
        }
        
        .hero-content {
          position: relative;
          text-align: center;
          z-index: 2;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 212, 255, 0.2);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 15px;
          background: linear-gradient(45deg, #00d4ff, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        
        .contact-content-section {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          min-height: 100vh;
          padding: 80px 0;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
        }
        
        .contact-form-card, .contact-info-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .contact-form-card:hover, .contact-info-card:hover {
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 30px 30px 0;
          color: #00d4ff;
        }
        
        .card-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        
        .card-content {
          padding: 20px 30px 30px;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .form-group input, .form-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px 16px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #00d4ff;
          box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }
        
        .form-group input::placeholder, .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(45deg, #007bff, #00d4ff);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(45deg, #0056b3, #00a8cc);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .submit-message {
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
          margin-top: 15px;
        }
        
        .submit-message.success {
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid rgba(40, 167, 69, 0.5);
          color: #28a745;
        }
        
        .submit-message.error {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: #dc3545;
        }
        
        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 30px;
        }
        
        .contact-info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        
        .info-icon {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .info-content h4 {
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 5px 0;
        }
        
        .info-content p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 8px 0;
          font-size: 0.9rem;
        }
        
        .contact-link {
          color: #00d4ff;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .contact-link:hover {
          color: #007bff;
          text-decoration: underline;
        }
        
        .response-time {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          text-align: center;
        }
        
        .response-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 212, 255, 0.2);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .response-time p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .card-header, .card-content {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </>
  )
}

export default ContactUs