import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChevronRight, Zap, Trophy, Users, Calendar } from "lucide-react";

/**
 * HeroSection.jsx
 * - Responsive upgraded hero with neural canvas background
 * - Typewriter title effect
 * - Event highlight cards
 * - Previous year stats with animated counters (intersection-observer)
 * - CTA buttons
 *
 * Notes:
 * - No external animation libraries required
 * - Require react, react-bootstrap, react-router-dom
 */

/* ---------------------------
   Helper: clamp utility
   --------------------------- */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* ---------------------------
   NeuralCanvas component
   --------------------------- */
const NeuralCanvas = ({ zIndex = 0 }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Optimized particle count for smooth performance
    const NODE_COUNT = Math.max(30, Math.floor((width * height) / 80000));
    const nodes = Array.from({ length: NODE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * (0.8 + Math.random() * 1.2),
      dy: (Math.random() - 0.5) * (0.8 + Math.random() * 1.2),
      r: 1.5 + Math.random() * 2.5,
    }));

    // mouse interaction removed for better performance

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Enhanced gradient background with modern colors
      const g = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
      g.addColorStop(0, "#0a0a23");
      g.addColorStop(0.3, "#1a1a2e");
      g.addColorStop(0.7, "#16213e");
      g.addColorStop(1, "#0f172a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Add subtle overlay pattern
      const overlay = ctx.createLinearGradient(0, 0, width, height);
      overlay.addColorStop(0, "rgba(0, 234, 255, 0.03)");
      overlay.addColorStop(0.5, "rgba(124, 58, 237, 0.02)");
      overlay.addColorStop(1, "rgba(0, 123, 255, 0.03)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, width, height);

      // update nodes
      nodes.forEach((node) => {
        node.x += node.dx;
        node.y += node.dy;

        // bounce
        if (node.x < 0 || node.x > width) node.dx *= -1;
        if (node.y < 0 || node.y > height) node.dy *= -1;

        // mouse repulsion removed

        // draw enhanced particle with glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 3);
        gradient.addColorStop(0, "rgba(0, 234, 255, 0.9)");
        gradient.addColorStop(0.5, "rgba(124, 58, 237, 0.6)");
        gradient.addColorStop(1, "rgba(0, 234, 255, 0)");

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();
      });

      // connections - optimized for performance
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          const maxDistance = 120;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, `rgba(0, 234, 255, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(124, 58, 237, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(0, 234, 255, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    // resize handling
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Note: for simplicity we don't fully recreate nodes here, but it's ok
    };

    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neural-bg"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

/* ---------------------------
   Typewriter Hook (no deps)
   --------------------------- */
const useTypewriter = ({ texts = [], speed = 80, pause = 1500 }) => {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0); // which string
  const [subIndex, setSubIndex] = useState(0); // which char
  const [forward, setForward] = useState(true);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const current = texts[index];
    let timer;

    if (forward) {
      if (subIndex <= current.length) {
        timer = setTimeout(() => {
          setDisplay(current.slice(0, subIndex));
          setSubIndex((s) => s + 1);
        }, speed);
      } else {
        // wait then delete
        timer = setTimeout(() => setForward(false), pause);
      }
    } else {
      if (subIndex >= 0) {
        timer = setTimeout(() => {
          setDisplay(current.slice(0, subIndex));
          setSubIndex((s) => s - 1);
        }, Math.max(30, speed / 2));
      } else {
        // move to next
        setForward(true);
        setIndex((i) => (i + 1) % texts.length);
        setSubIndex(0);
      }
    }

    return () => clearTimeout(timer);
  }, [texts, index, subIndex, forward, speed, pause]);

  return display;
};

/* ---------------------------
   CounterCard component
   - animated count + suffix
   - uses Intersection Observer to start counting when visible
   --------------------------- */
const CounterCard = ({ icon, title, value, suffix = "", color = "#00eaff" }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      observer = null;
    };
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const end = Number(value) || 0;
    const duration = 1800 + Math.min(1500, end * 2); // responsive duration
    const stepTime = 30;
    const steps = Math.max(10, Math.floor(duration / stepTime));
    const stepAmount = Math.ceil(end / steps);
    const timer = setInterval(() => {
      start += stepAmount;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, value]);

  const formatted = (count || 0).toLocaleString();

  return (
    <div
      ref={ref}
      className="past-event-card"
      role="group"
      aria-label={`${title} ${formatted}${suffix}`}
      style={{
        padding: "18px",
        borderRadius: 14,
        textAlign: "center",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        border: `1px solid rgba(255,255,255,0.06)`,
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = `0 18px 40px ${hexToRgba(color, 0.14)}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <h3
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          color: color,
          textShadow: `0 0 10px ${hexToRgba(color, 0.25)}`,
        }}
      >
        {formatted}
        {suffix}
      </h3>
      <p style={{ margin: 0, marginTop: 6, fontSize: 14, color: "rgba(255,255,255,0.85)", letterSpacing: 1 }}>
        {title}
      </p>
    </div>
  );
};

/* Helper to convert hex color to rgba */
function hexToRgba(hex = "#00eaff", alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------------------------
   HighlightCard component
   - small details with icon/title/text
   --------------------------- */
const HighlightCard = ({ icon, title, text }) => {
  return (
    <div
      className="detail-card"
      role="button"
      tabIndex={0}
      style={{
        padding: 18,
        borderRadius: 12,
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        cursor: "default",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.035)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 234, 255, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 234, 255, 0.12)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <h5 style={{ margin: 0, color: "#00eaff", fontWeight: 700 }}>{title}</h5>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>{text}</p>
    </div>
  );
};

/* ---------------------------
   Main HeroSection
   --------------------------- */
const HeroSection = () => {
  // Typewriter texts
  const typed = useTypewriter({
    texts: ["VEYG 2K25", "Technical Excellence"],
    speed: 70,
    pause: 1600,
  });

  // Event highlight cards
  const highlights = [
    { icon: "📅", title: "Event Date", text: "15 - 16 Sept" },
    { icon: "🎮", title: "Total Games", text: "4 Technical" },
    { icon: "🏆", title: "Competition", text: "2 Days" },
    { icon: "💡", title: "Innovation", text: "Tech Challenge" },
  ];

  // Previous year stats (restored and expanded)
  const thisYear = [
    { icon: "👥", title: "Registrations", value: 371, color: "#ff00e5" },
    { icon: "🎲", title: "Total Games", value: 4, color: "#00ff95" },
  ];

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        color: "#fff",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* Neural background */}
      <NeuralCanvas zIndex={0} />

      {/* Floating elements */}
      <div className="floating-elements" style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-orb"
            style={{
              position: "absolute",
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              borderRadius: "50%",
              background: `linear-gradient(45deg, rgba(0, 234, 255, 0.1), rgba(124, 58, 237, 0.1))`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Foreground content */}
      <Container style={{ zIndex: 3, position: "relative" }}>
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10} className="text-center">
            {/* Logo with enhanced styling */}
            <div className="logo-container" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2rem",
              textAlign: "center",
              width: "100%",
              background: "none",
              position: "relative",
              top: "20px",
            }}>
              <div className="logo-glow" style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                animation: "pulse 3s ease-in-out infinite"
              }} />
              <img
                src="/images/College-logo.png"
                alt="Saffrony Institute of Technology Logo"
                className="hero-logo"
                style={{
                  maxWidth: "400px",
                  width: "100%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  position: "relative",
                  zIndex: 2,
                  transition: "transform 0.3s ease",
                  background: "transparent",
                  backgroundColor: "transparent",
                  backdropFilter: "none",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                  textAlign: "center"
                }}
              />
            </div>

            {/* Enhanced Title area */}
            <div className="title-container" style={{ marginBottom: "1.5rem", position: "relative" }}>
              <div className="title-bg-effect" style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                height: "120%",
                background: "radial-gradient(ellipse, rgba(0, 234, 255, 0.1) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "titleGlow 4s ease-in-out infinite alternate"
              }} />
              <h1
                className="hero-title"
                style={{
                  margin: 0,
                  fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                  display: "inline-block",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 2
                }}
              >
                <span
                  className="gradient-text"
                  style={{
                    background: "linear-gradient(135deg, #00d4ff 0%, #007bff 25%, #7c3aed 50%, #ff006e 75%, #00d4ff 100%)",
                    backgroundSize: "300% 300%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                    paddingRight: 8,
                    animation: "gradientShift 6s ease-in-out infinite",
                    filter: "drop-shadow(0 0 20px rgba(0, 234, 255, 0.5))"
                  }}
                >
                  {typed}
                </span>
                <span
                  className="cursor"
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 4,
                    marginLeft: 4,
                    background: "linear-gradient(45deg, #00d4ff, #7c3aed)",
                    animation: "blink 1.2s steps(2, start) infinite",
                    height: "1.1em",
                    verticalAlign: "text-bottom",
                    borderRadius: 2,
                    boxShadow: "0 0 10px rgba(0, 234, 255, 0.8)"
                  }}
                />
              </h1>
            </div>

            {/* Enhanced Subtitle */}
            <div className="subtitle-container" style={{ marginBottom: "2rem" }}>
              <h2
                className="hero-subtitle"
                style={{
                  margin: 0,
                  fontSize: "clamp(1rem, 2vw, 1.4rem)",
                  fontWeight: 700,
                  color: "transparent",
                  background: "linear-gradient(90deg, #9ddfff, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  textAlign: "center",
                  position: "relative"
                }}
              >
                🚀 Saffrony Institute of Technology • Tech Fest
              </h2>
              <div className="subtitle-underline" style={{
                width: "100px",
                height: "3px",
                background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
                margin: "0 auto",
                borderRadius: "2px",
                animation: "expandContract 3s ease-in-out infinite"
              }} />
            </div>

            {/* Highlights cards (responsive grid) */}
            <div style={{ marginBottom: 26 }}>
              <Row className="g-3 justify-content-center">
                {highlights.map((h, idx) => (
                  <Col key={idx} xs={6} sm={6} md={3}>
                    <HighlightCard icon={h.icon} title={h.title} text={h.text} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Description */}
            <p
              style={{
                maxWidth: 820,
                margin: "0 auto",
                color: "rgba(255,255,255,0.88)",
                fontSize: "clamp(1rem, 1.6vw, 1.18rem)",
                lineHeight: 1.65,
                fontWeight: 300,
                marginBottom: 26,
              }}
            >
              Experience the future of technical competitions at{" "}
              <span style={{ color: "#00d4ff", fontWeight: 600 }}>Saffrony Institute of Technology</span>. Challenge
              your limits, innovate solutions, and compete for glory in our cutting-edge programming arena and hands-on
              hardware challenges.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 36,
              }}
            >
              <Button
                as={Link}
                to="/guidelines"
                size="lg"
                variant="primary"
                style={{
                  padding: "12px 34px",
                  borderRadius: 999,
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  background: "linear-gradient(135deg,#00d4ff,#007bff,#7c3aed)",
                  border: "none",
                  boxShadow: "0 14px 40px rgba(0,212,255,0.22)",
                }}
                aria-label="Explore Guidelines"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
              >
                🚀 Explore Guidelines
              </Button>

              <Button
                as={Link}
                to="/student-signup"
                size="lg"
                variant="outline-light"
                style={{
                  padding: "12px 34px",
                  borderRadius: 999,
                  fontWeight: 800,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  border: `2px solid ${hexToRgba("#00eaff", 0.9)}`,
                  color: "#00eaff",
                  background: "rgba(0,0,0,0.18)",
                  backdropFilter: "blur(6px)",
                }}
                aria-label="Register Now"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
              >
                ⚡ Register Now
              </Button>
            </div>

            {/* Past Events / counters */}
            <div style={{ marginBottom: 24 }}>
              <h4
                style={{
                  color: "#9ddfff",
                  letterSpacing: "1px",
                  marginBottom: "12px",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 3vw, 4rem)",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                This Year Highlights
              </h4>


              <Row className="g-3 justify-content-center">
                {thisYear.map((p, i) => (
                  <Col key={i} xs={12} sm={6} md={6} lg={3}>
                    <CounterCard icon={p.icon} title={p.title} value={p.value} suffix={p.suffix} color={p.color} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Small footer text / accessibility */}
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>
              All timings and details are subject to change. Check the guidelines page for the latest schedule.
            </p>
          </Col>
        </Row>
      </Container>

      {/* -------------------------
          Inline styles + media queries
          ------------------------- */}
      <style>{`
        /* Cursor blink */
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.08; }
          100% { opacity: 1; }
        }

        /* small devices adjustments */
        @media (max-width: 575.98px) {
          .hero-title { font-size: 1.9rem !important; }
          .detail-card { align-items: flex-start; }
        }

        /* hover improvements for buttons on non-touch */
        @media (hover: hover) {
          button[aria-label="Explore Guidelines"]:hover {
            box-shadow: 0 26px 60px rgba(0, 212, 255, 0.28) !important;
          }
        }

        /* provide smooth transform behaviours */
        .past-event-card, .detail-card {
          will-change: transform, box-shadow;
        }
          .logo {
  max-width: 220px;
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 6px 18px rgba(0,234,255,0.35));
}

/* Tablet Screens */
@media (max-width: 1024px) {
  .logo {
    max-width: 180px;
  }
}

/* Mobile Screens */
@media (max-width: 600px) {
  .logo {
    max-width: 140px;
  }
}

        
        /* Enhanced animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes titleGlow {
          0% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes expandContract {
          0%, 100% { width: 100px; }
          50% { width: 150px; }
        }
        
        /* Responsive enhancements */
        @media (max-width: 768px) {
          .hero-logo { max-width: 280px !important; }
          .floating-orb { display: none; }
        }
        
        @media (max-width: 576px) {
          .hero-logo { max-width: 220px !important; }
          .title-container { margin-bottom: 1rem !important; }
          .subtitle-container { margin-bottom: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;