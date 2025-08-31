import React, { useEffect, useRef, useState } from "react";
import { Container, Card, Badge, Button } from "react-bootstrap";
import { Calendar, Clock, MapPin, Shield } from "lucide-react";
import PageHeroSection from "../components/HeroSection/PageHeroSection";
import { games } from "../data/gamesData";

const Guidelines = () => {
  const eventSchedule = [
    {
      day: "Day 1",
      date: "15 September 2025",
      games: [
        { name: "Algo Cricket", venue: "Lab 1", gameId: 1 },
        { name: "BrainGo", venue: "Seminar Hall", gameId: 2 },
      ],
    },
    {
      day: "Day 2",
      date: "16 September 2025",
      games: [
        { name: "Logo2Logic", venue: "Lab 2", gameId: 3 },
        { name: "Blind Code to Key", venue: "Lab 3 & Seminar Hall", gameId: 4 },
      ],
    },
  ];

  const getEstimatedTime = (gameId) => {
    const game = games.find((g) => g.id === gameId);
    return game ? game.estimatedTime : "2 hours";
  };

  // --- Build a flat array of games for indexing/scroll indicator ---
  const flatGames = eventSchedule.flatMap((day, di) =>
    day.games.map((g, gi) => ({
      ...g,
      day: day.day,
      date: day.date,
      _index: di * 2 + gi, // (2 games/day as per your data)
    }))
  );

  // --- Refs/state for scroll tracking ---
  const listRef = useRef(null);
  const trackRef = useRef(null);
  const dotRef = useRef(null);
  const cardRefs = useRef([]); // refs per game card (flat order)
  const [activeIndex, setActiveIndex] = useState(0);
  const [dotX, setDotX] = useState(0); // pixel translate for dot (mobile)

  // IntersectionObserver → which card is most visible (for active label)
  useEffect(() => {
    if (!cardRefs.current.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Choose the entry with largest intersection ratio
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const idx = Number(best.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Smooth progress-based dot movement on mobile (continuous glide)
  useEffect(() => {
    const onScroll = () => {
      if (!cardRefs.current.length || !trackRef.current || !dotRef.current) return;

      const first = cardRefs.current[0];
      const last = cardRefs.current[cardRefs.current.length - 1];
      if (!first || !last) return;

      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();

      // Absolute Y (document-space)
      const firstMidY = firstRect.top + window.scrollY + firstRect.height / 2;
      const lastMidY = lastRect.top + window.scrollY + lastRect.height / 2;

      const viewportMidY = window.scrollY + window.innerHeight * 0.5;
      const progressRaw = (viewportMidY - firstMidY) / Math.max(1, lastMidY - firstMidY);
      const progress = Math.min(1, Math.max(0, progressRaw)); // clamp 0..1

      const trackWidth = trackRef.current.clientWidth || 0;
      const dotWidth = dotRef.current.clientWidth || 0;
      const travel = Math.max(0, trackWidth - dotWidth);

      setDotX(travel * progress);
    };

    // rAF-throttled scroll handler
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    // Initial position
    handle();
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  // Helper: attach ref per flat index
  const setCardRef = (el, idx) => {
    cardRefs.current[idx] = el;
  };

  return (
    <>
      <PageHeroSection
        title="Event Guidelines"
        subtitle="Essential Rules & Regulations"
        icon={Shield}
        description="Essential guidelines for participants to ensure fair play and smooth event execution. Read carefully before registering."
      />

      <div
        style={{
          background:
            "linear-gradient(145deg, #0a0e1a 0%, #1a1f2e 50%, #0f1419 100%)",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <Container style={{ paddingTop: "40px", paddingBottom: "60px" }}>
          {/* Basic Guidelines */}
          <Card
            className="mb-5"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "15px",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
          >
            <Card.Header
              style={{
                background: "rgba(0, 234, 255, 0.1)",
                border: "none",
                borderRadius: "15px 15px 0 0",
                textAlign: "center",
              }}
            >
              <Card.Title
                style={{
                  color: "#00d4ff",
                  fontSize: "1.5rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Shield size={24} />
                Basic Guidelines
              </Card.Title>
              <Card.Text style={{ color: "#94a3b8", margin: "10px 0 0 0" }}>
                Essential rules and regulations for all participants
              </Card.Text>
            </Card.Header>
            <Card.Body style={{ padding: "28px" }}>
              <div style={{ display: "grid", gap: "18px" }}>
                {[
                  {
                    title: "Registration Requirements",
                    content:
                    "All participants must register online before the event deadline. Valid student ID and contact information are mandatory.",
                  },
                  {
                    title: "Day-Wise Registration Rule",
                    content:
                      "Participants can register for only one game per day. If you register for a game on Day 1, you cannot register for any other game on the same day. However, you can register for another game on Day 2 and vice versa.",
                  },
                  {
                    title: "Code of Conduct",
                    content:
                      "Maintain professional behavior throughout the event. Respect fellow participants, organizers, and venue property.",
                  },
                  {
                    title: "Time Management",
                    content:
                      "Arrive 30 minutes before your scheduled event time. Late arrivals may result in disqualification.",
                  },
                  {
                    title: "Fair Play Policy",
                    content:
                      "Any form of cheating, plagiarism, or unfair practices will lead to immediate disqualification from the event.",
                  },
                  {
                    title: "Emergency Protocols",
                    content:
                      "In case of technical issues or emergencies, immediately contact the event coordinators for assistance.",
                  },
                  {
                    title: "Feedback & Queries",
                    content:
                      "For any questions or feedback, contact the organizing team through official channels provided during registration.",
                  },
                ].map((guideline, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      padding: "18px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 234, 255, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          background: "#00d4ff",
                          color: "#000",
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>
                      <h5
                        style={{ color: "#00d4ff", margin: 0, fontSize: "1.05rem" }}
                      >
                        {guideline.title}
                      </h5>
                    </div>
                    <p style={{ color: "#94a3b8", margin: 0, lineHeight: "1.65" }}>
                      {guideline.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Event Schedule Timeline */}
          <Card
            className="mb-5 timeline-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "15px",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
          >
            <Card.Header
              style={{
                background: "rgba(0, 234, 255, 0.1)",
                border: "none",
                borderRadius: "15px 15px 0 0",
                textAlign: "center",
              }}
            >
              <Card.Title
                style={{
                  color: "#00d4ff",
                  fontSize: "1.5rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Calendar size={24} />
                Event Schedule Timeline
              </Card.Title>
              <Card.Text style={{ color: "#94a3b8", margin: "10px 0 0 0" }}>
                Complete schedule for VEYG 2K25 gaming events
              </Card.Text>
            </Card.Header>

            <Card.Body style={{ padding: "40px" }}>
              <div style={{ position: "relative" }}>
                {/* Desktop vertical center line */}
                <div
                  className="timeline-line"
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "100%",
                    background: "rgba(0, 234, 255, 0.3)",
                    borderRadius: "2px",
                  }}
                ></div>

                {/* Timeline items */}
                <div
                  ref={listRef}
                  style={{ display: "flex", flexDirection: "column", gap: "40px" }}
                >
                  {eventSchedule.flatMap((day, di) =>
                    day.games.map((game, gi) => {
                      const globalIndex = di * 2 + gi;
                      const isLeft = globalIndex % 2 === 0;
                      const flat = flatGames[globalIndex];

                      return (
                        <div
                          key={`${di}-${gi}`}
                          className="timeline-item"
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                          data-index={globalIndex}
                          ref={(el) => setCardRef(el, globalIndex)}
                        >
                          {/* Desktop node dot */}
                          <div
                            className="timeline-dot"
                            style={{
                              position: "absolute",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "24px",
                              height: "24px",
                              background: "#00d4ff",
                              borderRadius: "50%",
                              border: "4px solid #0a0e1a",
                              zIndex: 10,
                            }}
                          ></div>

                          {/* Card content */}
                          <div
                            className="timeline-content"
                            style={{
                              width: "45%",
                              ...(isLeft
                                ? { paddingRight: "30px" }
                                : { marginLeft: "auto", paddingLeft: "30px" }),
                            }}
                          >
                            <Card
                              style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "12px",
                                backdropFilter: "blur(10px)",
                              }}
                            >
                              <Card.Header
                                style={{
                                  paddingBottom: "10px",
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <Badge
                                    bg="primary"
                                    style={{ background: "#00d4ff", color: "#000" }}
                                  >
                                    {day.day}
                                  </Badge>
                                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>
                                    {day.date}
                                  </span>
                                </div>
                                <Card.Title
                                  style={{
                                    color: "#00d4ff",
                                    fontSize: "1.1rem",
                                    margin: 0,
                                  }}
                                >
                                  {game.name}
                                </Card.Title>
                              </Card.Header>
                              <Card.Body style={{ paddingTop: 0 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      fontSize: "14px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    <Clock size={16} />
                                    Estimated Time: {getEstimatedTime(game.gameId)}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      fontSize: "14px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    <MapPin size={16} />
                                    {game.venue}
                                  </div>
                                  <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() =>
                                      (window.location.href = `/game/${game.gameId}`)
                                    }
                                    style={{
                                      marginTop: "10px",
                                      width: "100%",
                                      background: "transparent",
                                      borderColor: "#00eaff",
                                      color: "#00eaff",
                                      boxShadow: "0 0 10px rgba(0,234,255,0.3)",
                                      transition: "all 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = "#00eaff";
                                      e.currentTarget.style.color = "#000";
                                      e.currentTarget.style.boxShadow =
                                        "0 0 18px rgba(0,234,255,0.6)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "transparent";
                                      e.currentTarget.style.color = "#00eaff";
                                      e.currentTarget.style.boxShadow =
                                        "0 0 10px rgba(0,234,255,0.3)";
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Styles */}
      <style>{`
        /* ===== Desktop timeline ===== */
        .timeline-line,
        .timeline-dot {
          display: block;
        }
        .timeline-content { }

        /* ===== Mobile layout tweaks ===== */
        @media (max-width: 768px) {
          /* Hide desktop timeline chrome */
          .timeline-line,
          .timeline-dot {
            display: none !important;
          }

          .timeline-card { padding: 0 !important; }
          .timeline-content {
            width: 100% !important;
            margin-left: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .timeline-item {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .timeline-card .card-body {
            padding: 24px 18px !important;
          }

          .timeline-content .card { margin: 0; }
          .timeline-content .card-header { padding: 14px 18px !important; }
          .timeline-content .card-body { padding: 12px 18px !important; }
          .timeline-content .card-title { font-size: 1rem !important; }

        /* Extra small */
        @media (max-width: 576px) {
          .mobile-indicator-wrap { bottom: 10px; }
          .indicator-dot { width: 20px; }
        }
      `}</style>
    </>
  );
};

export default Guidelines;