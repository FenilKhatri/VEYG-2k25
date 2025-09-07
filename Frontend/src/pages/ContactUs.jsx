// ContactUs.jsx
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Form, Button, Badge, Modal } from "react-bootstrap";
// Removed framer-motion for performance
import {
  Send,
  Mail,
  MessageCircle,
  User,
  Zap,
  Phone,
  MapPin,
  X,
  Loader2,
  Globe,
} from "lucide-react";
import PageHeroSection from "../components/HeroSection/PageHeroSection";

/* ---------------------------- Motion Variants ---------------------------- */
const containerVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 14, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18 } },
  hover: { scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" },
};

const glowHover = {
  whileHover: { scale: 1.02, transition: { type: "spring", stiffness: 280 } },
};

/* ---------------------------- Small helpers ---------------------------- */
function AnimatedNumber({ value = 0, duration = 1000, className = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    let rafId;
    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * value);
      setDisplay(current);
      if (progress < 1) rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration]);
  return <span className={className}>{display.toLocaleString()}</span>;
}

/* ---------------------------- Main Component ---------------------------- */
export default function ContactUs() {
  /* Typewriter / small typed title */
  const title = "Contact VEYG 2K25";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      setTyped(title.slice(0, idx + 1));
      idx++;
      if (idx >= title.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, []);

  /* Form State */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState(""); // "success" | "error" | ""
  const [showMapModal, setShowMapModal] = useState(false);

  const messageRef = useRef(null);

  /* basic client-side validation helper */
  const validateForm = () => {
    if (!formData.username.trim()) return "Please provide your name.";
    if (!formData.email.trim()) return "Please provide your email.";
    // basic email pattern
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(formData.email)) return "Please provide a valid email address.";
    if (!formData.message.trim()) return "Message cannot be empty.";
    return null;
  };

  /* handle inputs */
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    setSubmitMessage("");
    setSubmitType("");
  };

  /* submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    setSubmitType("");
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage(validationError);
      setSubmitType("error");
      // focus message area for quick correction
      const el = messageRef.current;
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/form/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage("Message sent successfully! We'll get back to you soon.");
        setSubmitType("success");
        setFormData({ username: "", email: "", message: "" });
      } else {
        // try to get message from API
        let text = await response.text().catch(() => "");
        setSubmitMessage(text || "Failed to send message. Please try again.");
        setSubmitType("error");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitMessage("An error occurred. Please try again later.");
      setSubmitType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* open small popup with embedded Google maps (new window) */
  const openMapWindow = () => {
    const mapWindow = window.open("", "_blank", "width=900,height=700,noopener,noreferrer");
    if (!mapWindow) {
      // blocked by popup blocker fallback: open modal
      setShowMapModal(true);
      return;
    }
    mapWindow.document.write(`
      <html>
        <head>
          <title>Event Location - VEYG 2K25</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>body,html{margin:0;height:100%}iframe{border:0;width:100%;height:100%}</style>
        </head>
        <body>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </body>
      </html>
    `);
    mapWindow.document.close();
  };

  /* contact items - could be moved to props or external file */
  const contactItems = [
    {
      id: "email",
      Icon: Mail,
      title: "Email",
      subtitle: "General inquiries",
      value: "veyg.notification@gmail.com",
      action: () => (window.location.href = "mailto:veyg.notification@gmail.com"),
    },
    {
      id: "phone",
      Icon: Phone,
      title: "Support",
      subtitle: "24 / 7 Technical Support",
      value: "+91 98765 43210",
      action: () => (window.location.href = "tel:+919876543210"),
    },
    {
      id: "location",
      Icon: MapPin,
      title: "Event Location",
      subtitle: "Technical Competition Venue",
      value: "Click to view map",
      action: openMapWindow,
    },
  ];

  return (
    <>
      {/* HERO WITH BG */}
      <div
        className="contact-page-root"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, rgba(9,10,14,1) 0%, rgba(20,23,32,1) 45%, rgba(6,8,12,1) 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div
          className="fade-in"
          style={{
            position: "absolute",
            left: "-120px",
            top: "-80px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 40%)",
            filter: "blur(80px)",
            zIndex: 1,
          }}
        />
        <div
          className="fade-in-delayed"
          style={{
            position: "absolute",
            right: "-160px",
            top: "120px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 45%)",
            filter: "blur(90px)",
            zIndex: 1,
          }}
        />

        {/* floating subtle particles */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.02) 0px, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.01) 0px, transparent 30%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <Container style={{ position: "relative", zIndex: 10, paddingTop: 56, paddingBottom: 80 }}>
          {/* PageHeroSection (keeps your existing hero) */}
          <PageHeroSection
            title={typed || title}
            subtitle="Get In Touch With Our Team"
            icon={MessageCircle}
            description="Have questions about VEYG 2K25? Need technical support? We're here to help you with all your queries and concerns."
          />

          {/* Main grid */}
          <div className="container-animation">
            <Row className="justify-content-center mt-4 gx-4 gy-4">
              {/* LEFT: CONTACT FORM */}
              <Col xl={7} lg={8} md={10} sm={12}>
                <div className="card-hover">
                  <div
                    className="glass-card"
                    style={{
                      borderRadius: 16,
                      padding: 28,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
                    }}
                  >
                    <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                      <div>
                        <Badge
                          bg="transparent"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 12px",
                            borderRadius: 18,
                            color: "#00d4ff",
                            border: "1px solid rgba(0,212,255,0.12)",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                          }}
                        >
                          <Zap size={16} />
                          Official • Get Support
                        </Badge>

                        <h2 style={{ marginTop: 12, marginBottom: 6, fontWeight: 800, fontSize: "1.6rem" }}>
                          Send Us a Message
                        </h2>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.75)" }}>
                          Fill out the form and our team will reply within 24 hours.
                        </p>
                      </div>
                    </div>

                    <Form onSubmit={handleSubmit} className="contact-form">
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group controlId="username">
                            <Form.Label className="form-label">
                              <User size={16} style={{ marginRight: 8 }} />
                              Your Name
                            </Form.Label>
                            <Form.Control
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              disabled={isSubmitting}
                              className="form-control-custom"
                              aria-required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group controlId="email">
                            <Form.Label className="form-label">
                              <Mail size={16} style={{ marginRight: 8 }} />
                              Your Email
                            </Form.Label>
                            <Form.Control
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email address"
                              disabled={isSubmitting}
                              className="form-control-custom"
                              aria-required
                            />
                          </Form.Group>
                        </Col>

                        <Col xs={12}>
                          <Form.Group controlId="message">
                            <Form.Label className="form-label">
                              <MessageCircle size={16} style={{ marginRight: 8 }} />
                              Message
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              name="message"
                              rows={6}
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Tell us how we can help you..."
                              disabled={isSubmitting}
                              className="form-control-custom"
                              ref={messageRef}
                              aria-required
                            />
                          </Form.Group>
                        </Col>

                        <Col xs={12}>
                          <Row className="align-items-center">
                            <Col>
                              <div className="d-flex gap-3 flex-wrap align-items-center">
                                <Button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="btn-primary-glow"
                                  aria-label="Send message"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 size={16} className="spin" />
                                      <span style={{ marginLeft: 8 }}>Sending...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send size={16} />
                                      <span style={{ marginLeft: 8 }}>Send Message</span>
                                    </>
                                  )}
                                </Button>

                                <Button
                                  variant="outline-light"
                                  onClick={() => {
                                    setFormData({ username: "", email: "", message: "" });
                                    setSubmitMessage("");
                                    setSubmitType("");
                                  }}
                                  disabled={isSubmitting}
                                >
                                  Reset
                                </Button>

                                {/* quick helper */}
                                <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                                  <strong>Response:</strong> Usually within 24 hours
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </Col>

              {/* RIGHT: CONTACT INFO + QUICK HELP */}
              <Col xl={4} lg={4} md={10} sm={12}>
                <div className="card-hover">
                  <div
                    className="glass-card"
                    style={{
                      borderRadius: 14,
                      padding: 18,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 800 }}>Contact Information</h4>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                          Reach out through any of the channels below
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 12 }}>
                      {contactItems.map((ci) => {
                        const Icon = ci.Icon;
                        return (
                          <button
                            className="glow-hover contact-item-btn"
                            onClick={ci.action}
                            key={ci.id}
                            aria-label={ci.title}
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                              padding: "12px 14px",
                              borderRadius: 12,
                              border: "1px solid rgba(255,255,255,0.04)",
                              background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
                              cursor: "pointer",
                              color: "white",
                              textAlign: "left",
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                display: "grid",
                                placeItems: "center",
                                background: "linear-gradient(45deg,#007bff,#00d4ff)",
                                boxShadow: "0 8px 20px rgba(0,123,255,0.14)",
                                flexShrink: 0,
                              }}
                            >
                              <Icon size={18} color="white" />
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{ci.title}</div>
                              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{ci.subtitle}</div>
                            </div>

                            <div style={{ marginLeft: "8px", color: "#9be7ff", fontSize: 13, fontWeight: 700 }}>
                              {ci.value}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* response time box */}
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          padding: 12,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div style={{ width: 40, height: 40, display: "grid", placeItems: "center", background: "rgba(0,212,255,0.07)", borderRadius: 10 }}>
                          <Zap size={18} color="#00d4ff" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>Quick Response</div>
                          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Typically within 24 hours</div>
                        </div>
                      </div>
                    </div>

                    {/* small footprint footer */}
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <Globe size={14} />
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Official • VEYG 2K25</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Map modal fallback */}
        <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Event Location - VEYG 2K25</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: 420, padding: 0 }}>
            <iframe
              title="Event location"
              style={{ border: 0, width: "100%", height: "100%" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.3387698696715!2d72.39419057517894!3d23.484304378852727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c3f6bbaaa1343%3A0x38102d9febaec3b8!2sSAFFRONY%20INSTITUTE%20OF%20TECHNOLOGY!5e0!3m2!1sen!2sin!4v1756744679668!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Modal.Body>
        </Modal>

        {/* Inline styles */}
        <style>{`
          /* Form controls & layout */
          .form-label {
            display:flex; align-items:center; gap:8px; font-weight:700; color: rgba(255,255,255,0.92);
          }

          .form-control-custom {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: white;
            padding: 12px 14px;
            border-radius: 10px;
            transition: all .18s ease;
            font-size: 0.95rem;
          }

          .form-control-custom:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 8px 24px rgba(0,123,255,0.12);
            background: rgba(255,255,255,0.06);
          }

          .btn-primary-glow {
            background: linear-gradient(45deg, #00c6ff, #0072ff) !important;
            border: none !important;
            color: #fff !important;
            padding: 10px 18px;
            border-radius: 12px;
            font-weight: 700;
            display: inline-flex;
            align-items:center;
            gap:8px;
            box-shadow: 0 10px 30px rgba(0,123,255,0.18);
            transition: transform .14s ease, box-shadow .14s ease;
          }

          .btn-primary-glow:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 18px 50px rgba(0,123,255,0.22);
          }

          .spin { animation: spin 1s linear infinite; display:inline-block; }
          @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }

          .submit-message {
            padding: 12px 14px;
            border-radius: 10px;
            font-weight:600;
            font-size: 0.95rem;
          }
          .submit-message.success {
            background: rgba(40,167,69,0.08);
            border: 1px solid rgba(40,167,69,0.18);
            color: #baf0c9;
          }
          .submit-message.error {
            background: rgba(220,53,69,0.06);
            border: 1px solid rgba(220,53,69,0.14);
            color: #ffd8d8;
          }

          .contact-item-btn { width: 100%; text-decoration:none; border: none; }

          .quick-link {
            display:block; padding:10px 12px; border-radius:8px; color: rgba(255,255,255,0.9); font-weight:600;
            background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
            border: 1px solid rgba(255,255,255,0.03);
          }
          .quick-link:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); color: #00d4ff; }

          /* responsive adjustments */
          @media (max-width: 991px) {
            .glass-card { padding: 18px !important; }
            .form-control-custom { font-size: 0.92rem; }
          }

          /* subtle highlight */
          .text-highlight { color: #8ef0ff; }
        `}</style>
      </div>
    </>
  );
}