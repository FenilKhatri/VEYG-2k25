import { Mail, Phone, MapPin, Code, Database, Server, Cpu, Terminal, Github, ExternalLink } from "lucide-react"
import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "../App.css"

export default function Footer() {
  return (
    <footer className="modern-footer position-relative overflow-hidden">
      {/* Animated Background */}
      <div className="footer-bg position-absolute top-0 start-0 w-100 h-100">
        <div className="tech-particles">
          <Code size={30} className="particle particle-1" />
          <Database size={25} className="particle particle-2" />
          <Server size={35} className="particle particle-3" />
          <Cpu size={40} className="particle particle-4" />
          <Terminal size={30} className="particle particle-5" />
          <Github size={35} className="particle particle-6" />
        </div>
      </div>

      <Container className="position-relative">
        <Row className="footer-content">
          {/* Company Info */}
          <Col lg={8} md={12} className="mb-4">
            <div className="footer-section">
              <div className="brand-section mb-4">
                <div className="brand-icon">
                  <Code size={28} />
                </div>
                <h3 className="brand-title">VEYG 2K25</h3>
              </div>
              <div className="college-logo-section mb-3">
                <img
                  src="https://drive.google.com/uc?export=download&id=14yJp4RCwuTyS7oF81wDYz3P7astSb9CT"
                  alt="College Logo"
                  onError={(e) => {
                    e.target.src = "/images/College-logo.png"; // Fallback to local image
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                  style={{
                    height: "60px",
                    width: "auto",
                    filter: "drop-shadow(0 2px 8px rgba(0, 234, 255, 0.3))",
                    borderRadius: "8px"
                  }}
                />
              </div>
              <p className="brand-description">
                Ultimate Technical Gaming Competition Platform bringing together developers, coders, and tech enthusiasts for innovative challenges.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <a href="mailto:veyg.notification@gmail.com" className="contact-link">veyg.notification@gmail.com,</a>
                  <a href="mailto:220390116009@saffrony.ac.in" className="contact-link">220390116009@saffrony.ac.in</a>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <div className="phone-numbers">
                    <a href="tel:+916353622735" className="contact-link">+91 63536 22735,</a>
                    <a href="tel:+919265926990" className="contact-link">+91 92659 26990</a>
                  </div>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <a 
                    href="https://maps.google.com/?q=Near+Shanku%27s+Water+Park,+Ahmedabad+Mehsana+Highway,+Linch,+Gujarat+384435" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link address-link"
                  >
                    Near Shanku's Water Park, Ahmedabad – Mehsana Highway, Linch, Gujarat 384435
                  </a>
                </div>
              </div>
            </div>
          </Col>

          {/* Quick Links & Sponsors */}
          <Col lg={4} md={12} className="mb-4">
            <Row>
              <Col md={6} lg={12} className="mb-4">
                <div className="footer-section">
                  <h4 className="section-title">
                    <Terminal size={18} />
                    Quick Access
                  </h4>
                  <div className="footer-links">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/registered-games" className="footer-link">My Registrations</Link>
                    <Link to="/guidelines" className="footer-link">Guidelines</Link>
                    <Link to="/about" className="footer-link">About Us</Link>
                    <a href="mailto:veyg.notification@gmail.com" className="footer-link">
                      Contact Support <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </Col>
              
              <Col md={6} lg={12}>
                <div className="footer-section">
                  <h4 className="section-title">
                    <Code size={18} />
                    Our Sponsors
                  </h4>
                  <div className="footer-links">
                    <a href="https://www.saffrony.ac.in" target="_blank" rel="noopener noreferrer" className="footer-link">
                      Saffrony Institute of Technology <ExternalLink size={12} />
                    </a>
                    <a href="https://www.techcorp.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                      TechCorp Solutions <ExternalLink size={12} />
                    </a>
                    <a href="https://www.innovatetech.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                      InnovateTech Labs <ExternalLink size={12} />
                    </a>
                    <a href="https://www.digitalfuture.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                      Digital Future Inc <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>

        </Row>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="copyright-section">
            <p className="copyright-text">
              © 2025 VEYG Technical Festival. All rights reserved.
            </p>
          </div>
        </div>
      </Container>

      <style>{`
        .modern-footer {
          background: linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%);
          color: #e2e8f0;
          padding: 60px 0 30px;
          position: relative;
        }
        
        .footer-bg {
          background: radial-gradient(circle at 20% 50%, rgba(0, 123, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 0, 229, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(0, 255, 149, 0.1) 0%, transparent 50%);
        }
        
        .tech-particles {
          position: relative;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        
        .particle-1 { top: 10%; left: 10%; animation-delay: 0s; color: #007bff; }
        .particle-2 { top: 20%; right: 15%; animation-delay: 1s; color: #28a745; }
        .particle-3 { bottom: 30%; left: 20%; animation-delay: 2s; color: #ffc107; }
        .particle-4 { top: 60%; right: 25%; animation-delay: 3s; color: #17a2b8; }
        .particle-5 { bottom: 20%; right: 10%; animation-delay: 4s; color: #dc3545; }
        .particle-6 { top: 40%; left: 50%; animation-delay: 5s; color: #6c757d; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .footer-content {
          margin-bottom: 40px;
        }
        
        .footer-section {
          height: 100%;
        }
        
        .brand-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .brand-icon {
          background: linear-gradient(45deg, #007bff, #00d4ff);
          border-radius: 12px;
          padding: 12px;
          color: white;
        }
        
        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #00d4ff, #007bff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }
        
        .brand-description {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cbd5e1;
          font-size: 0.9rem;
        }
        
        .contact-item svg {
          color: #64748b;
        }
        
        .contact-item a {
          color: #cbd5e1;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .contact-item a:hover {
          color: #00d4ff;
        }
        
        .contact-link {
          display: inline-block;
          position: relative;
        }
        
        .contact-link:after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #00d4ff;
          transition: width 0.3s ease;
        }
        
        .contact-link:hover:after {
          width: 100%;
        }
        
        .phone-numbers {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .address-link {
          line-height: 1.4;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 20px;
        }
        
        .section-title svg {
          color: #64748b;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .footer-link:hover {
          color: #00d4ff;
          transform: translateX(5px);
        }
        
        .tech-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .tech-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cbd5e1;
          font-size: 0.9rem;
        }
        
        .tech-item svg {
          color: #64748b;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background: rgba(0, 212, 255, 0.2);
          color: #00d4ff;
          transform: translateY(-2px);
        }
        
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 30px;
          text-align: center;
        }
        
        .copyright-section {
          margin-bottom: 25px;
        }
        
        .copyright-text {
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 5px;
        }
        
        .made-with {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
        }
        
        .team-section {
          margin-top: 20px;
        }
        
        .team-title {
          color: #00d4ff;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .team-member {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .team-member:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .member-name {
          color: #f1f5f9;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .member-role {
          color: #64748b;
          font-size: 0.75rem;
          margin-top: 2px;
        }
        
        @media (max-width: 768px) {
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .brand-section {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }
        
        @media (max-width: 480px) {
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}