import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const HeroSection = () => {
  useEffect(() => {
    const canvas = document.getElementById("neural-bg");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const nodes = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#05010a";
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.dx;
        node.y += node.dy;

        if (node.x < 0 || node.x > width) node.dx *= -1;
        if (node.y < 0 || node.y > height) node.dy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#00eaff";
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0,234,255,${1 - dist / 150})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="hero-section text-white position-relative overflow-hidden"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        marginTop: "-80px",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      {/* Animated Neural Background */}
      <canvas
        id="neural-bg"
        className="position-absolute top-0 start-0"
        style={{ zIndex: 0 }}
      ></canvas>

      <Container className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ zIndex: 2 }}>
        <Row className="align-items-center text-center">
          <Col lg={10} className="mx-auto">
            {/* College Logo */}
            <div className="mb-4" style={{ display: "flex", justifyContent: "center" }}>
              <img 
                src="/images/College-logo.png" 
                alt="Saffrony Institute of Technology" 
                style={{ 
                  height: "80px", 
                  filter: "drop-shadow(0 0 10px rgba(0, 234, 255, 0.5))",
                  marginBottom: "10px"
                }} 
              />
            </div>
            
            {/* Main Heading */}
            <h1 
              className="display-3 fw-bold mb-4" 
              style={{ 
                color: "white", 
                textShadow: "0 0 30px rgba(0, 212, 255, 0.8)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                letterSpacing: "-0.02em"
              }}
            >
              <span style={{ 
                background: "linear-gradient(135deg, #00d4ff 0%, #007bff 50%, #6366f1 100%)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                animation: "glow 2s ease-in-out infinite alternate"
              }}>
                VEYG 2K25
              </span>
              <br />
              <span style={{ 
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: "400"
              }}>
                Technical Excellence Redefined
              </span>
            </h1>

            {/* Sub-title */}
            <h2
              className="h5 mb-4 fw-semibold"
              style={{
                color: "#9ddfff",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              🚀 Saffrony Institute of Technology • Tech Fest
            </h2>

            {/* Event Highlights */}
            <div className="event-details mb-5">
              <Row className="justify-content-center g-4">
                {[
                  { icon: "📅", title: "Event Date", text: "15-16 Sept" },
                  { icon: "🎮", title: "Total Games", text: "4 Technical" },
                  { icon: "🏆", title: "Competition", text: "2 Days" },
                  { icon: "💡", title: "Innovation", text: "Tech Challenge" },
                ].map((item, idx) => (
                  <Col key={idx} xs={6} sm={6} md={3}>
                    <div
                      className="detail-card p-4 rounded-4 h-100"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 0 20px rgba(0,234,255,0.1)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        // Removed duplicate height property
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 0 30px rgba(0,234,255,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 0 20px rgba(0,234,255,0.1)";
                      }}
                    >
                      <div className="fs-3 mb-2">{item.icon}</div>
                      <h5
                        className="fw-bold mb-1"
                        style={{
                          fontSize: "1.1rem",
                          color: "#00eaff",
                        }}
                      >
                        {item.title}
                      </h5>
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "0.95rem",
                          opacity: 0.85,
                          color: "#e3f9ff",
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            
            {/* Past Event Details */}
            <div className="past-event-details mb-5">
              <h4 className="text-center mb-4" style={{ color: "#9ddfff", letterSpacing: "1px" }}>
                PREVIOUS YEAR HIGHLIGHTS
              </h4>
              <Row className="justify-content-center g-4">
                {[
                  { icon: "👥", title: "Registrations", value: 850, suffix: "+", color: "#ff00e5" },
                  { icon: "🎲", title: "Total Games", value: 5, suffix: "", color: "#00ff95" },
                ].map((item, idx) => {
                  // Use useState and useRef for each counter
                  const [count, setCount] = useState(0);
                  const counterRef = useRef(null);
                  
                  useEffect(() => {
                    let timer;
                    const observer = new IntersectionObserver(
                      ([entry]) => {
                        // When counter comes into view
                        if (entry.isIntersecting) {
                          let startValue = 0;
                          const endValue = item.value;
                          const duration = 2000; // 2 seconds
                          const increment = Math.ceil(endValue / (duration / 30)); // Update every 30ms
                          
                          timer = setInterval(() => {
                            startValue += increment;
                            if (startValue > endValue) {
                              setCount(endValue);
                              clearInterval(timer);
                            } else {
                              setCount(startValue);
                            }
                          }, 30);
                          
                          // Clean up observer after animation starts
                          observer.disconnect();
                        }
                      },
                      { threshold: 0.1 }
                    );
                    
                    if (counterRef.current) {
                      observer.observe(counterRef.current);
                    }
                    
                    return () => {
                      observer.disconnect();
                      if (timer) clearInterval(timer);
                    };
                  }, [item.value]);
                  
                  // Format the count value (add commas for thousands)
                  const formattedCount = count.toLocaleString();
                  
                  return (
                    <Col key={idx} xs={12} sm={6} md={6} lg={3}>
                      <div
                        ref={counterRef}
                        className="past-event-card p-4 rounded-4 text-center h-100"
                        style={{
                          background: "transparent",
                          border: `1px solid rgba(${item.color === "#ff00e5" ? "255, 0, 229" : 
                                    item.color === "#00ff95" ? "0, 255, 149" : 
                                    item.color === "#00eaff" ? "0, 234, 255" : 
                                    "255, 153, 0"}, 0.3)`,
                          boxShadow: `0 0 25px rgba(${item.color === "#ff00e5" ? "255, 0, 229" : 
                                      item.color === "#00ff95" ? "0, 255, 149" : 
                                      item.color === "#00eaff" ? "0, 234, 255" : 
                                      "255, 153, 0"}, 0.15)`,
                          transition: "all 0.3s ease",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-10px)";
                          e.currentTarget.style.boxShadow = 
                            `0 15px 30px rgba(${item.color === "#ff00e5" ? "255, 0, 229" : 
                                          item.color === "#00ff95" ? "0, 255, 149" : 
                                          item.color === "#00eaff" ? "0, 234, 255" : 
                                          "255, 153, 0"}, 0.25)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = 
                            `0 0 25px rgba(${item.color === "#ff00e5" ? "255, 0, 229" : 
                                        item.color === "#00ff95" ? "0, 255, 149" : 
                                        item.color === "#00eaff" ? "0, 234, 255" : 
                                        "255, 153, 0"}, 0.15)`;
                        }}
                      >
                        <div className="fs-1 mb-3">{item.icon}</div>
                        <h3
                          className="fw-bold mb-2 counter-value"
                          style={{
                            fontSize: "2.5rem",
                            color: item.color,
                            textShadow: `0 0 15px rgba(${item.color === "#ff00e5" ? "255, 0, 229" : 
                                        item.color === "#00ff95" ? "0, 255, 149" : 
                                        item.color === "#00eaff" ? "0, 234, 255" : 
                                        "255, 153, 0"}, 0.5)`,
                          }}
                        >
                          {item.suffix === "₹" ? item.suffix : ""}{formattedCount}{item.suffix !== "₹" ? item.suffix : ""}
                        </h3>
                        <p
                          className="mb-0 text-uppercase"
                          style={{
                            fontSize: "1rem",
                            letterSpacing: "1px",
                            fontWeight: "600",
                            color: "#e3f9ff",
                          }}
                        >
                          {item.title}
                        </p>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Description */}
            <p 
              className="lead mb-5" 
              style={{ 
                color: "rgba(255, 255, 255, 0.85)", 
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                lineHeight: "1.7",
                maxWidth: "700px",
                margin: "0 auto 3rem",
                fontWeight: "300"
              }}
            >
              Experience the future of technical competitions at{" "}
              <span style={{ color: "#00d4ff", fontWeight: "500" }}>
                Saffrony Institute of Technology
              </span>
              . Challenge your limits, innovate solutions, and compete for glory in our cutting-edge programming arena.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="d-flex flex-column flex-md-row gap-4 justify-content-center align-items-center">
              <Button
                as={Link}
                to="/guidelines"
                size="lg"
                className="fw-bold futuristic-btn primary-cta"
                style={{
                  padding: "18px 40px",
                  fontSize: "1.2rem",
                  borderRadius: "50px",
                  border: "none",
                  background: "linear-gradient(135deg, #00d4ff 0%, #007bff 50%, #6366f1 100%)",
                  color: "white",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "700",
                  boxShadow: "0 10px 30px rgba(0, 212, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: "220px"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 212, 255, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #00eaff 0%, #0088ff 50%, #7c3aed 100%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 212, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.background = "linear-gradient(135deg, #00d4ff 0%, #007bff 50%, #6366f1 100%)";
                }}
              >
                <span style={{ position: "relative", zIndex: 2 }}>
                  🚀 Explore Guidelines
                </span>
              </Button>
              
              <Button
                as={Link}
                to="/student-signup"
                size="lg"
                className="fw-bold secondary-cta"
                style={{
                  padding: "18px 40px",
                  fontSize: "1.2rem",
                  borderRadius: "50px",
                  border: "2px solid rgba(0, 212, 255, 0.6)",
                  color: "#00d4ff",
                  background: "rgba(0, 212, 255, 0.08)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: "700",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 8px 25px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  minWidth: "220px",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.background = "rgba(0, 212, 255, 0.2)";
                  e.currentTarget.style.borderColor = "#00eaff";
                  e.currentTarget.style.color = "#00eaff";
                  e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 212, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background = "rgba(0, 212, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.6)";
                  e.currentTarget.style.color = "#00d4ff";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                }}
              >
                ⚡ Register Now
              </Button>
            </div>

            <style>{`
              @keyframes glow {
                0% { text-shadow: 0 0 30px rgba(0, 212, 255, 0.8); }
                100% { text-shadow: 0 0 50px rgba(0, 212, 255, 1), 0 0 70px rgba(0, 212, 255, 0.8); }
              }
              
              .primary-cta::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              }
              
              .primary-cta:hover::before {
                left: 100%;
              }
              
              .secondary-cta::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);
                transition: left 0.5s;
              }
              
              .secondary-cta:hover::before {
                left: 100%;
              }
            `}</style>

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;