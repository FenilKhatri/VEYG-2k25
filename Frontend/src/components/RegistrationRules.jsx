import React, { useState } from "react";
import { Card, Accordion, Badge } from "react-bootstrap";
// Removed framer-motion for performance
import {
  CheckCircle,
  User,
  Calendar,
  CreditCard,
  Download,
  Shield,
  Trophy,
  Star,
  Users,
} from "lucide-react";

const RegistrationRules = () => {
  const [activeKey, setActiveKey] = useState("0");

  const steps = [
    {
      id: "0",
      title: "Create an account & log in",
      icon: <User size={24} />,
      description:
        "Register using your college email address and log in. (If the site requires email verification, complete that step.)",
      color: "#00d4ff",
    },
    {
      id: "1",
      title: "Explore events",
      icon: <Calendar size={24} />,
      description:
        "Browse the Day 1 and Day 2 game lists and read each game's description, rules, team size, and schedule carefully.",
      color: "#007bff",
    },
    {
      id: "2",
      title: "Choose wisely",
      icon: <CheckCircle size={24} />,
      description:
        "You may register for only one game per day. If you register for a Day 1 game, you cannot register for another Day 1 game (same rule for Day 2). Decide carefully before submitting.",
      color: "#ffc107",
      important: true,
    },
    {
      id: "3",
      title: "Register and pay",
      icon: <CreditCard size={24} />,
      description: [
        "Fill out the registration form for the game you choose.",
        "Go to the Registered Games page and download your registration receipt (it contains your registration ID).",
        "Visit the cashier, present the downloaded receipt/registration ID, and make the payment. The cashier will verify your registration and confirm payment.",
      ],
      color: "#28a745",
    },
    {
      id: "4",
      title: "Confirmation & receipt",
      icon: <Download size={24} />,
      description:
        "After payment is confirmed you can download the final payment-confirmed receipt. A confirmation email will be sent to all participating members.",
      color: "#17a2b8",
    },
    {
      id: "5",
      title: "Keep your receipt safe",
      icon: <Shield size={24} />,
      description:
        "Store the payment receipt securely. If the receipt is lost or missing, resolving issues will be your responsibility—keep the document as proof of payment.",
      color: "#dc3545",
      important: true,
    },
    {
      id: "6",
      title: "Enjoy the game!",
      icon: <Trophy size={24} />,
      description:
        "You're all set! Show up on time and have fun competing in your registered games.",
      color: "#6f42c1",
    },
  ];

  return (
    <div className="fade-in">
      {/* Expert Session Card */}
      <div className="fade-in-up">
        <Card
          className="expert-session-card mb-4"
          style={{
            background: "rgba(255, 193, 7, 0.1)",
            border: "1px solid rgba(255, 193, 7, 0.4)",
            borderRadius: "18px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 25px rgba(255, 193, 7, 0.3)",
            overflow: "hidden",
          }}
        >
          <Card.Header
            className="text-center py-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 152, 0, 0.2))",
              borderBottom: "1px solid rgba(255, 193, 7, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{
                  color: "#ffc107",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  textShadow: "0 0 10px rgba(255, 193, 7, 0.6)",
                }}
              >
                Expert Session
              </h3>
              <Star size={32} style={{ color: "#ffc107", marginLeft: "10px" }} />
            </div>
            <p
              className="mb-0"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "1.1rem",
              }}
            >
              Special Technical Workshop by Industry Expert
            </p>
          </Card.Header>

          <Card.Body className="p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ffc107, #ff8f00)",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    <Users size={28} />
                  </div>
                  <div>
                    <h4 className="mb-1 fw-bold" style={{ color: "#fff" }}>
                      Mr. Nikhil Methiya
                    </h4>
                    <p
                      className="mb-0"
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "1rem",
                      }}
                    >
                      CEO | Dronelab Technologies Ahmedabad
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p
                    style={{
                      color: "#dffaff",
                      fontSize: "1.05rem",
                      lineHeight: "1.6",
                      marginBottom: "10px",
                    }}
                  >
                    Join us for an exclusive expert session on{" "}
                    <strong>"TechShield - Role of Drone Technologies"</strong>
                  </p>
                </div>
              </div>

              <div className="col-md-4 text-center">
                <div
                  style={{
                    background: "rgba(255, 193, 7, 0.15)",
                    borderRadius: "15px",
                    padding: "20px",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease",
                  }}
                  className="sponsor-card-hover"
                >
                  <div style={{ marginBottom: "15px" }}>
                    <Trophy
                      size={48}
                      style={{ color: "#ffc107", marginBottom: "10px" }}
                    />
                    <h5 style={{ color: "#ffc107", fontWeight: "bold" }}>
                      Free Workshop
                    </h5>
                    <p style={{ color: "rgba(255, 255, 255, 0.8)", margin: 0 }}>
                      <strong>Price:</strong> Free of cost
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Registration Rules Section */}
      <div className="fade-in-up">
        <Card
          className="registration-rules-card"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
            borderRadius: "18px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 25px rgba(0, 234, 255, 0.2)",
            overflow: "hidden",
          }}
        >
          <Card.Header
            className="text-center py-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 140, 255, 0.15))",
              borderBottom: "1px solid rgba(0, 212, 255, 0.25)",
            }}
          >
            <h3
              className="mb-0 fw-bold"
              style={{
                color: "#00eaff",
                textShadow: "0 0 10px rgba(0, 234, 255, 0.7)",
                fontSize: "1.9rem",
              }}
            >
              Registration Rules & Steps
            </h3>
            <p
              className="mb-0 mt-2"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "1.1rem",
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
                <div key={step.id} className="fade-in-up">
                  <Accordion.Item
                    eventKey={step.id}
                    className="mb-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${step.important ? "#ffc107" : "rgba(0, 212, 255, 0.25)"
                        }`,
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <Accordion.Header
                      style={{
                        background: step.important
                          ? "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.2))"
                          : "linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(138, 43, 226, 0.1))",
                        border: "none",
                      }}
                    >
                      <div className="d-flex align-items-center w-100">
                        <div
                          className="me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5
                              className="mb-0 fw-bold"
                              style={{
                                color: "#00eaff",
                                fontSize: "1.2rem",
                              }}
                            >
                              Step {index + 1}: {step.title}
                            </h5>
                            {step.important && (
                              <Badge
                                bg="warning"
                                className="ms-2"
                                style={{
                                  color: "#000",
                                  fontWeight: "600",
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
                        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.7))",
                        borderTop: "1px solid rgba(0, 212, 255, 0.2)",
                        color: "#e2e8f0",
                      }}
                    >
                      {Array.isArray(step.description) ? (
                        <ul
                          className="mb-0"
                          style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
                        >
                          {step.description.map((item, idx) => (
                            <li key={idx} className="mb-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          className="mb-0"
                          style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
                        >
                          {step.description}
                        </p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationRules;