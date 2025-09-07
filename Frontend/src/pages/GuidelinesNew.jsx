// Guidelines.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Container, Card, Badge, Button, Form, Modal as RBModal } from "react-bootstrap";
// Removed framer-motion for performance
import { Calendar, Clock, MapPin, Shield, Search, Download, X, FileText, ArrowLeft, ArrowRight } from "lucide-react";
import PageHeroSection from "../components/HeroSection/PageHeroSection";
import { games } from "../data/gamesData";

/**
 * Guidelines.jsx
 * - Large, feature-rich single-file component.
 * - Paste into your React project as-is (adjust imports if required).
 *
 * Features:
 *  - Animated intro + staggered guidelines
 *  - Draggable timeline (horizontal on desktop, vertical on mobile)
 *  - Progress rail + moving dot (motionValue)
 *  - IntersectionObserver to set activeIndex
 *  - Search & filter
 *  - Day tabs and keyboard navigation
 *  - Export (copy to clipboard / download JSON)
 *  - Accessibility: ARIA attributes, focus handling, skip links
 *  - Print-friendly styles
 */

/* -------------------------
   Simple CSS-in-JS block
   (You can move to CSS file if desired)
   ------------------------- */
const pageStyles = `
.guidelines-root { background: #0b1220; color: #dbe6ee; min-height: 100vh; }
.guidelines-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; }
.guideline-item:hover { background: rgba(0,212,255,0.04); border-color: rgba(0,212,255,0.2); }
.timeline-card { overflow: visible; }
.timeline-line { position:absolute; left:50%; transform:translateX(-50%); width:4px; border-radius:3px; background: linear-gradient(180deg, rgba(0,234,255,0.08), rgba(0,234,255,0.25)); }
.timeline-dot { width:24px; height:24px; border-radius:50%; background:#00d4ff; border:4px solid #0a0e1a; box-sizing:content-box; }
.scroll-container { -webkit-overflow-scrolling: touch; }
.sr-only { position:absolute; width:1px; height:1px; margin:-1px; padding:0; overflow:hidden; clip:rect(0,0,0,0); border:0; }
.timeline-horizontal { display:flex; gap:18px; align-items:center; padding:18px; }
.timeline-horizontal .timeline-card-inner { min-width:320px; max-width:420px; }
.progress-track { height:10px; background: rgba(255,255,255,0.04); border-radius:999px; position:relative; }
.progress-dot { width:18px; height:18px; border-radius:50%; background:#00d4ff; position:absolute; top:50%; transform:translateY(-50%); box-shadow:0 0 12px rgba(0,234,255,0.25); }
.timeline-item { position:relative; }
.kbd { background:#08121a; border:1px solid rgba(255,255,255,0.03); padding:4px 8px; border-radius:6px; font-size:13px; }
`;

/* -------------------------
   Motion variants
   ------------------------- */
const containerVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const dotPulse = {
  idle: { scale: 1, boxShadow: "0 0 0px rgba(0,234,255,0.0)" },
  active: { scale: 1.2, boxShadow: "0 0 24px rgba(0,234,255,0.4)" },
};

/* -------------------------
   Helper small components
   ------------------------- */
const IconButton = ({ label, onClick, children, className = "" }) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`btn btn-sm btn-outline-light ${className}`}
    style={{
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "rgba(0,234,255,0.15)",
    }}
  >
    {children}
  </button>
);

/* -------------------------
   Main component
   ------------------------- */
const Guidelines = () => {
  // --- Data / configuration ------------------------------------------------
  // eventSchedule derived from `games` if available, else fallback sample data
  const eventSchedule = useMemo(() => {
    // try to map user's games by day if games data contains day/date fields,
    // otherwise fallback to a small 2-day structure for demo
    try {
      if (Array.isArray(games) && games.length > 0) {
        // crude grouping by day property if present, else split by index
        if (games[0].day) {
          const grouped = games.reduce((acc, g) => {
            acc[g.day] = acc[g.day] || { day: g.day, date: g.date || "", games: [] };
            acc[g.day].games.push({ name: g.name || g.title || `Game ${g.id}`, venue: g.venue || "TBA", gameId: g.id || g.gameId || -1 });
            return acc;
          }, {});
          return Object.values(grouped);
        } else {
          // chunk into two-day example
          const day1 = { day: "Day 1", date: "15 September 2025", games: [] };
          const day2 = { day: "Day 2", date: "16 September 2025", games: [] };
          games.forEach((g, i) => {
            const target = i % 2 === 0 ? day1 : day2;
            target.games.push({ name: g.name || g.title || `Game ${g.id}`, venue: g.venue || "TBA", gameId: g.id || g.gameId || i + 1 });
          });
          return [day1, day2];
        }
      }
    } catch (e) {}
    // fallback
    return [
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
  }, []);

  // flatGames for indexing
  const flatGames = useMemo(
    () =>
      eventSchedule.flatMap((day, di) =>
        day.games.map((g, gi) => ({
          ...g,
          day: day.day,
          date: day.date,
          _index: di * (day.games.length) + gi,
        }))
      ),
    [eventSchedule]
  );

  // --- Refs & state -------------------------------------------------------
  const listRef = useRef(null); // container for timeline
  const itemRefs = useRef([]); // individual card refs
  const trackRef = useRef(null); // progress track ref (mobile)
  const dotRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  // Slight simulated loading (skeleton) for nicer first paint
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  /* -------------------------
     IntersectionObserver
     - sets activeIndex based on what card is most visible
     ------------------------- */
  useEffect(() => {
    if (!itemRefs.current || !itemRefs.current.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pick entry with largest intersection
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

    const els = itemRefs.current;
    els.forEach((el) => el && obs.observe(el));
    return () => {
      els.forEach((el) => el && obs.unobserve(el));
      obs.disconnect();
    };
  }, [flatGames, loading]);

  /* -------------------------
     Update progress dot position for mobile (vertical scroll)
     - calculates progress based on viewport relative to first/last card
     ------------------------- */
  useEffect(() => {
    const updateDot = () => {
      if (!itemRefs.current.length || !trackRef.current || !dotRef.current) return;

      // Mobile: vertical scroll mode (avoid horizontal for desktop)
      if (window.innerWidth > 768) {
        // hide/move dot off track on larger screens (we'll use desktop highlight)
        progressX.set(0);
        progressWidth.set(0);
        return;
      }

      const first = itemRefs.current[0];
      const last = itemRefs.current[itemRefs.current.length - 1];
      if (!first || !last) return;

      const firstMid = first.getBoundingClientRect().top + window.scrollY + first.getBoundingClientRect().height / 2;
      const lastMid = last.getBoundingClientRect().top + window.scrollY + last.getBoundingClientRect().height / 2;
      const viewportMid = window.scrollY + window.innerHeight * 0.5;

      const raw = (viewportMid - firstMid) / Math.max(1, lastMid - firstMid);
      const clamped = Math.min(1, Math.max(0, raw));

      const trackW = trackRef.current.clientWidth || 0;
      const dotW = dotRef.current.clientWidth || 0;
      const travel = Math.max(0, trackW - dotW);

      const x = travel * clamped;
      progressX.set(x);
      progressWidth.set(travel * clamped); // unused but available
      dotScale.set(1 + clamped * 0.2);
    };

    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateDot();
        ticking = false;
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    // initial
    handler();
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [flatGames.length, progressX, progressWidth, dotScale]);

  /* -------------------------
     Drag handling for desktop horizontal timeline
     - uses Framer Motion's drag
     - sets activeIndex when dragging stops by computing nearest card center
     ------------------------- */
  const onDragEnd = (event, info) => {
    setIsDragging(false);
    // snap to nearest item center
    const container = listRef.current;
    if (!container) return;
    const children = Array.from(container.querySelectorAll(".timeline-card-inner"));
    if (!children.length) return;

    // container bounding
    const cRect = container.getBoundingClientRect();
    const containerCenterX = cRect.left + cRect.width / 2;

    // find min distance from center
    let bestIndex = activeIndex;
    let bestDist = Infinity;
    children.forEach((child, idx) => {
      const r = child.getBoundingClientRect();
      const childCenter = r.left + r.width / 2;
      const dist = Math.abs(childCenter - containerCenterX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = Number(child.dataset.index);
      }
    });

    // smooth scroll to make that child centered
    const chosen = children.find((c) => Number(c.dataset.index) === bestIndex);
    if (chosen) {
      const offset = chosen.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - chosen.clientWidth) / 2;
      container.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  /* -------------------------
     Utilities: getEstimatedTime
     - preserved behaviour from original code (fallback 2 hours)
     ------------------------- */
  const getEstimatedTime = (gameId) => {
    const g = games.find((x) => x.id === gameId || x.gameId === gameId);
    return g ? g.estimatedTime || g.duration || "2 hours" : "2 hours";
  };

  /* -------------------------
     Filtering & derived list
     ------------------------- */
  const filteredFlatGames = flatGames.filter((g) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (g.name || "").toLowerCase().includes(q) || (g.venue || "").toLowerCase().includes(q) || (g.day || "").toLowerCase().includes(q);
  });

  /* -------------------------
     Keyboard nav for days
     ------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") setSelectedDay((s) => Math.max(0, s - 1));
      if (e.key === "ArrowRight") setSelectedDay((s) => Math.min(eventSchedule.length - 1, s + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [eventSchedule.length]);

  /* -------------------------
     Export: copy JSON + download
     ------------------------- */
  const exportJSON = () => {
    const payload = { generatedAt: new Date().toISOString(), schedule: eventSchedule };
    const json = JSON.stringify(payload, null, 2);
    // copy to clipboard
    navigator.clipboard?.writeText(json).then(
      () => {
        // show modal success
        setShowExportModal(true);
      },
      (err) => {
        setShowExportModal(true);
      }
    );
    // also trigger download
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VEYG_schedule_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* -------------------------
     Small animated guideline card component
     ------------------------- */
  const GuidelineCard = ({ idx, title, content }) => (
    <div
      key={idx}
      className="guideline-item"
      style={{
        padding: 16,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00d4ff",
            flexShrink: 0,
          }}
        />
        <h5 style={{ margin: 0, color: "#00d4ff" }}>{title}</h5>
      </div>
      <p style={{ margin: 0, color: "#c7d7e6", lineHeight: 1.6 }}>{content}</p>
    </div>
  );

  /* -------------------------
                <Card.Title style={{ margin: 0, color: "#00d4ff", fontSize: 16 }}>{item.name}</Card.Title>
              </Card.Header>
              <Card.Body style={{ paddingTop: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9fb0c6" }}>
                    <Clock size={16} />
                    <span>Estimated: {getEstimatedTime(item.gameId)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9fb0c6" }}>
                    <MapPin size={16} />
                    <span>{item.venue}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => { window.location.href = `/game/${item.gameId}`; }}
                      style={{ borderColor: "#00eaff", color: "#00eaff", width: "100%" }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="guidelines-root" role="main">
      {/* Inject local styles */}
      <style>{pageStyles}</style>

      {/* Skip link */}
      <a className="sr-only" href="#guidelines-content">Skip to content</a>

      <PageHeroSection
        title="Event Guidelines"
        description="Important information and rules for all participants"
        bgImage="https://images.unsplash.com/photo-1519834089826-3e6d8f5e2c3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      />

      <Container id="guidelines-content" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <h2 style={{ color: "#00d4ff", margin: 0, fontSize: 22, display: "flex", gap: 8, alignItems: "center" }}>
              <Shield size={20} /> Basic Guidelines
            </h2>
            <span style={{ color: "#9fb0c6", fontSize: 14 }}>Rules & schedule for VEYG 2K25</span>
          </div>
        </div>

        {/* Guidelines Card */}
        <motion.div initial="hidden" animate="show" variants={containerVariant}>
          <Card className="guidelines-card mb-5" style={{ borderRadius: 14, overflow: "hidden" }}>
            <Card.Body style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                {loading ? (
                  // skeletons
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={{ height: 70, background: "linear-gradient(90deg,#0b1520,#0e2130)", borderRadius: 10 }} />
                  ))
                ) : (
                  <motion.div style={{ display: "grid", gap: 12 }} variants={containerVariant}>
                    {[
                      {
                        title: "Registration Requirements",
                        content: "All participants must register online before the event deadline. Valid student ID and contact information are mandatory.",
                      },
                      {
                        title: "Day-Wise Registration Rule",
                        content: "Participants can register for only one game per day. If you register for a game on Day 1, you cannot register for any other game on the same day. However, you can register for another game on Day 2 and vice versa.",
                      },
                      {
                        title: "Code of Conduct",
                        content: "Maintain professional behaviour throughout the event. Respect fellow participants, organizers, and venue property.",
                      },
                      {
                        title: "Time Management",
                        content: "Arrive 30 minutes before your scheduled event time. Late arrivals may result in disqualification.",
                      },
                      {
                        title: "Fair Play Policy",
                        content: "Any form of cheating, plagiarism, or unfair practices will lead to immediate disqualification from the event.",
                      },
                      {
                        title: "Emergency Protocols",
                        content: "In case of technical issues or emergencies, immediately contact the event coordinators for assistance.",
                      },
                    ].map((g, i) => (
                      <GuidelineCard key={i} idx={i} title={g.title} content={g.content} />
                    ))}
                  </motion.div>
                )}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      {/* Export modal */}
      <RBModal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
        <RBModal.Header closeButton>
          <RBModal.Title>Export Schedule JSON</RBModal.Title>
        </RBModal.Header>
        <RBModal.Body>
          <p style={{ color: "#33414a", fontSize: 14 }}>
            The schedule JSON has been copied to your clipboard and a download started automatically.
          </p>
          <pre style={{ maxHeight: 220, overflow: "auto", background: "#06121a", color: "#cfe9f6", padding: 12, borderRadius: 8 }}>
            {JSON.stringify({ generatedAt: new Date().toISOString(), schedule: eventSchedule }, null, 2)}
          </pre>
        </RBModal.Body>
        <RBModal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Close
          </Button>
        </RBModal.Footer>
      </RBModal>
    </div>
  );
};

export default Guidelines;