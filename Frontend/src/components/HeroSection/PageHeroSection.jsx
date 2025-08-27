import { Container, Row, Col } from "react-bootstrap";
import { useEffect } from "react";

const PageHeroSection = ({ title, subtitle, icon: Icon, description }) => {
  useEffect(() => {
    const canvas = document.getElementById(`page-hero-bg-${title.replace(/\s+/g, '-').toLowerCase()}`);
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 400);
    
    const nodes = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
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
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00eaff";
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0,234,255,${0.3 * (1 - dist / 120)})`;
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
      height = canvas.height = 400;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [title]);

  return (
    <section
      className="page-hero-section text-white position-relative overflow-hidden"
      style={{
        height: "400px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Animated Neural Network Background */}
      <canvas
        id={`page-hero-bg-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="position-absolute top-0 start-0"
        style={{ zIndex: 0 }}
      ></canvas>

      {/* Gradient Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 234, 255, 0.1) 0%, transparent 70%)",
          zIndex: 1
        }}
      ></div>

      <Container style={{ zIndex: 2 }}>
        <Row className="align-items-center text-center">
          <Col lg={10} className="mx-auto">
            {/* Icon and Title */}
            <div className="d-flex justify-content-center align-items-center mb-3">
              {Icon && <Icon size={48} style={{ color: '#00eaff', marginRight: '20px' }} />}
              <h1
                className="fw-bold mb-0"
                style={{
                  fontSize: "3rem",
                  background: "linear-gradient(90deg, #00eaff, #ff00e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 25px rgba(0, 234, 255, 0.7)",
                }}
              >
                {title}
              </h1>
            </div>

            {/* Subtitle */}
            {subtitle && (
              <h2
                className="h5 mb-4 fw-semibold"
                style={{
                  color: "#9ddfff",
                  letterSpacing: "1px",
                }}
              >
                {subtitle}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p
                className="lead mx-auto mb-0"
                style={{
                  maxWidth: "600px",
                  fontSize: "1.1rem",
                  color: "#d6f5ff",
                  opacity: 0.9,
                }}
              >
                {description}
              </p>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PageHeroSection;
