import React, { useEffect, useState } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
// Removed framer-motion for performance
import {
  Lightbulb,
  Users,
  Award,
  Zap,
  Code,
  Target,
  Rocket,
  Trophy,
} from "lucide-react";


const valuesData = [
  {
    id: "innovation",
    title: "Innovation",
    desc:
      "We encourage participants to push boundaries and develop groundbreaking solutions across AI, mobile, web and hardware.",
    Icon: Lightbulb,
  },
  {
    id: "community",
    title: "Community",
    desc:
      "A hub for networking and collaboration — build lasting connections in the tech and gaming ecosystem.",
    Icon: Users,
  },
  {
    id: "excellence",
    title: "Excellence",
    desc:
      "Providing a fair, challenging arena where technical talent is recognized, celebrated and rewarded.",
    Icon: Award,
  },
  {
    id: "mastery",
    title: "Technical Mastery",
    desc:
      "Promoting deep technical understanding and practical application across languages and frameworks.",
    Icon: Code,
  },
];

const coordinators = [
  {
    name: "Prof. Yogesh Kakadiya",
    dept: "Electrical Department",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFa8i8irJYNO0OCUsUiydH3Tcq0q0yMVH3wg&s",
  },
  {
    name: "Prof. Kunalsinh Kathia",
    dept: "Mechanical Department",
    img: "https://www.saffrony.ac.in/media/4258/kunal-sir.jpg",
  },
  {
    name: "Prof. Twinkle Verma",
    dept: "Computer Engineering Department",
    img: "https://media.licdn.com/dms/image/v2/C4D03AQEPhAA4SQYmeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1663781191017?e=1759363200&v=beta&t=buB1_gxyXaMjg8rr7M72TFIXsmGfhcP_VEMH2vuj02o",
  },
  {
    name: "Prof. Nainsi Soni",
    dept: "Computer Engineering Department",
    img: "https://media.licdn.com/dms/image/v2/D4D03AQFEMM-wkBAz9g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1694598648255?e=2147483647&v=beta&t=8SaIe57cXIeCjfFlB9LgP65Lv_E2ZypsjFn4lJXzZ7U",
  },
];

const devTeam = [
  { name: "Fenil Khatri", initials: "FK" },
  { name: "Divyesh Kubavat", initials: "DK" },
  { name: "Vraj Fadiya", initials: "VF" },
  { name: "Riddhi Sadhu", initials: "RS" },
];

// Motion variants
const containerVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 300 } },
};

function AnimatedNumber({ value = 0, duration = 1200 }) {
  // duration in ms
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

  return <span className="text-3xl md:text-4xl font-extrabold">{display.toLocaleString()}</span>;
}

export default function AboutUs() {
  // small typewriter for hero title
  const title = "VEYG 2K25";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped((s) => title.slice(0, i + 1));
      i++;
      if (i >= title.length) clearInterval(t);
    }, 70);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0a0a0a 100%)',
      color: 'white'
    }}>
      {/* HERO */}
      <section
        className="fade-in"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '120px',
          paddingBottom: '80px'
        }}
      >
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          left: '-64px',
          top: '-64px',
          width: '288px',
          height: '288px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 50%)',
          filter: 'blur(60px)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          right: '0',
          top: '96px',
          width: '384px',
          height: '384px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
          filter: 'blur(60px)',
          zIndex: 1
        }} />

        <Container style={{ position: 'relative', zIndex: 10 }}>
          <Row className="align-items-center justify-content-center">
            <Col md={12}>
              <div
                className="slide-in-left"
              >
                <Badge
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#00d4ff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '20px'
                  }}
                >
                  <Zap size={18} />
                  Official • Technical Fest
                </Badge>

                <h1 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: '800',
                  lineHeight: '1.2',
                  marginBottom: '15px',
                  background: 'linear-gradient(45deg, #00d4ff, #007bff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {typed}
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginLeft: '8px'
                  }}>
                    — About the Event
                  </span>
                </h1>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  maxWidth: '500px',
                  marginBottom: '30px'
                }}>
                  Empowering students through innovative technical competitions and fostering excellence in technology,
                  programming skills and hands-on problem solving.
                </p>

                <div className="d-flex gap-3 flex-wrap">
                  <a
                    className="hover-scale"
                    href="#"
                    style={{
                      display: 'inline-block',
                      background: 'rgba(0, 212, 255, 0.9)',
                      color: '#0a0a0a',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                    }}
                  >
                    View Events
                  </a>

                  <a
                    className="hover-scale"
                    href="#team"
                    style={{
                      display: 'inline-block',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none'
                    }}
                  >
                    Meet the Team
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CONTENT */}
      <Container style={{ marginTop: '-32px', position: 'relative', zIndex: 20 }}>
        <div className="container-animation">
          {/* Mission & Vision */}
          <Row className="mb-5">
            <Col lg={6} className="mb-4">
              <div
                className="card-hover"
                style={{
                  borderRadius: '16px',
                  padding: '30px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  height: '100%'
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3" style={{ color: '#00d4ff' }}>
                  <Target size={22} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Our Mission</h2>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', margin: 0 }}>
                  VEYG-2K25 is dedicated to fostering innovation, competition, and community among tech enthusiasts and
                  gamers. We bring together brilliant minds to challenge skills, showcase talent, and connect with like-minded
                  peers in the ever-evolving world of technology.
                </p>
              </div>
            </Col>

            <Col lg={6} className="mb-4">
              <div
                className="card-hover"
                style={{
                  borderRadius: '16px',
                  padding: '30px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  height: '100%'
                }}
              >
                <div className="d-flex align-items-center gap-3 mb-3" style={{ color: '#ff6b9d' }}>
                  <Rocket size={22} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Our Vision</h2>
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', margin: 0 }}>
                  To be the leading platform for technical competitions worldwide, inspiring the next generation of
                  innovators and fostering a vibrant global community that shapes the future of technology.
                </p>
              </div>
            </Col>
          </Row>

          {/* Core Values */}
          <section className="mb-5">
            <div className="text-center mb-4">
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(45deg, #00d4ff, #007bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '10px'
              }}>
                Core Values
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                Principles that drive our technical community
              </p>
            </div>

            <Row>
              {valuesData.map((v) => (
                <Col key={v.id} sm={6} lg={3} className="mb-4">
                  <div
                    className="card-hover"
                    style={{
                      borderRadius: '16px',
                      padding: '30px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      textAlign: 'center',
                      height: '100%'
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #6366f1, #00d4ff)',
                      color: 'white'
                    }}>
                      <v.Icon size={28} />
                    </div>
                    <h4 style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '12px', color: 'white' }}>
                      {v.title}
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {v.desc}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          {/* Team */}
          <section id="team">
            <div className="text-center mb-4">
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(45deg, #00d4ff, #007bff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '10px'
              }}>
                Our Team
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                Meet the people behind VEYG 2K25
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'white', marginBottom: '20px' }}>
                Event Coordinators
              </h4>
              <Row className="mb-5">
                {coordinators.map((c) => (
                  <Col key={c.name} sm={6} lg={3} className="mb-4">
                    <div
                      className="card-hover"
                      style={{
                        borderRadius: '16px',
                        padding: '25px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center',
                        height: '100%'
                      }}
                    >
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        overflow: 'hidden',
                        border: '2px solid rgba(255, 255, 255, 0.08)',
                        padding: '4px',
                        background: 'linear-gradient(135deg, #6366f1, #00d4ff)'
                      }}>
                        <img
                          src={c.img}
                          alt={c.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'white', marginBottom: '4px' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                          {c.dept}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              <h4 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'white', marginBottom: '20px' }}>
                Development Team
              </h4>
              <Row>
                {devTeam.map((d) => (
                  <Col key={d.name} xs={6} sm={3} className="mb-4">
                    <div
                      className="card-hover"
                      style={{
                        borderRadius: '16px',
                        padding: '25px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        color: 'white'
                      }}>
                        {d.initials}
                      </div>
                      <div style={{ fontWeight: '600', color: 'white' }}>
                        {d.name}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

        </div>
      </Container>

      {/* small helpers for blob animation (Tailwind plugin or global CSS may be needed in project) */}
      <style>{`@keyframes blob { 0% { transform: translateY(0px) scale(1); } 33% { transform: translateY(-12px) scale(1.05); } 66% { transform: translateY(6px) scale(0.98); } 100% { transform: translateY(0px) scale(1); } }
      .animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }`}</style>
    </div>
  );
}
