import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";

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
      ctx.fillStyle = "#0b0f1a";
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        marginTop: "-80px",
        paddingTop: "80px"
      }}
    >
      {/* Animated Neural Network Background */}
      <canvas
        id="neural-bg"
        className="position-absolute top-0 start-0"
        style={{ zIndex: 0 }}
      ></canvas>

      <Container style={{ zIndex: 2 }}>
        <Row className="align-items-center text-center">
          <Col lg={10} className="mx-auto">
            {/* Title */}
            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: "3.5rem",
                background: "linear-gradient(90deg, #00eaff, #ff00e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 25px rgba(0, 234, 255, 0.7)",
              }}
            >
              VEYG 2K25
            </h1>

            {/* Sub-title */}
            <h2
              className="h5 mb-4 fw-semibold"
              style={{
                color: "#9ddfff",
                letterSpacing: "1px",
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
                  <Col key={idx} xs={6} md={3}>
                    <div
                      className="detail-card p-4 rounded-4 h-100"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 0 25px rgba(0,234,255,0.1)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 0 30px rgba(0,234,255,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 0 25px rgba(0,234,255,0.1)";
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
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Description */}
            <p
              className="lead mx-auto mb-4"
              style={{
                maxWidth: "700px",
                fontSize: "1.05rem",
                color: "#d6f5ff",
                opacity: 0.9,
              }}
            >
              Get ready for an electrifying <strong>tech gaming</strong> experience!  
              Code, compete, and challenge your limits with the best minds in technology.
            </p>

            {/* Futuristic Buttons */}
            <div className="cta-buttons d-flex justify-content-center flex-wrap gap-3">
              <Button
                onClick={() => {
                  const techGamesSection = document.getElementById('technical-games');
                  if (techGamesSection) {
                    techGamesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="fw-bold futuristic-btn"
                style={{
                  padding: "14px 45px",
                  fontSize: "1.05rem",
                  border: "2px solid transparent",
                  borderRadius: "50px",
                  backgroundImage:
                    "linear-gradient(135deg,rgba(0, 234, 255, 0.50),rgba(0, 255, 149, 0.50))",
                  color: "#000",
                  boxShadow:
                    "0 0 20px rgba(0, 234, 255, 0.7), 0 0 40px rgba(0, 255, 149, 0.4)",
                  transition: "0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(0, 234, 255, 0.64), 0 0 50px rgba(0, 255, 149, 0.43)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(0, 234, 255, 0.7), 0 0 40px rgba(0, 255, 149, 0.4)";
                }}
              >
                Register Now 🚀
              </Button>

              <Button
                as={Link}
                to="/guidelines"
                variant="outline-light"
                size="lg"
                className="fw-bold futuristic-btn"
                style={{
                  padding: "14px 45px",
                  fontSize: "1.05rem",
                  borderRadius: "50px",
                  border: "2px solid #00eaff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(8px)",
                  color: "#00eaff",
                  boxShadow: "0 0 20px rgba(0,234,255,0.5)",
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#00eaff";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(0,234,255,1), 0 0 50px rgba(0,255,149,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#00eaff";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(0,234,255,0.5)";
                }}
              >
                View Guidelines ⚡
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;