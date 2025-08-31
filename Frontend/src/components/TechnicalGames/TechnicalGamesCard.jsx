import { Link } from "react-router-dom";
import { CheckCircle, Users, Calendar, IndianRupee, Zap, Trophy, AlertTriangle } from "lucide-react";

const TechnicalGameCard = ({
  game,
  userId,
  isThisGameRegistered = false,
  hasRegisteredForDay = false,
  canRegisterForDay = true,
  registrationStatus = "available",
  isRegistrationExpired = false,
  registeredGameName,
  registeredGameId,
  onRegister,
  to,
}) => {
  if (!game) return null;

  // ---------- Helpers ----------
  const formatINR = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : n;

  const detailsHref = to || `/game/${game.id}`;

  /**
   * State Machine
   * Priority order matters. First matching branch wins.
   */
  const getRegState = () => {
    if (!userId) return { key: "login", label: "Login required" };
    if (isThisGameRegistered) return { key: "registered", label: "Already registered" };

    const closed = isRegistrationExpired || registrationStatus === "closed";
    if (closed) return { key: "closed", label: "Registration closed" };

    if (registrationStatus === "full") return { key: "full", label: "Full" };

    // Day-wise constraints (either explicit flag or already picked another game that day)
    if (hasRegisteredForDay || canRegisterForDay === false) {
      return { key: "dayBlocked", label: `You already registered 1 game in Day ${game.day}` };
    }

    return { key: "available", label: "Available" };
  };

  const reg = getRegState();

  const theme = reg.key === "registered" ? "registered" : "default";

  // Action handling
  const handleRegisterClick = (e) => {
    if (reg.key !== "available") {
      // prevent action when blocked; keep focus and show reason in title
      e.preventDefault();
      return;
    }
    if (onRegister) {
      e.preventDefault();
      onRegister(game);
    }
  };

  // Derived UI bits
  const showDayConflictBanner = userId && !isThisGameRegistered && (hasRegisteredForDay || canRegisterForDay === false);
  const seatsLabel = typeof game.seatsLeft === "number" ? `${game.seatsLeft} seat${game.seatsLeft === 1 ? "" : "s"} left` : null;

  return (
    <div className="tech-game-container h-100">
      <div className={`tech-game-card position-relative h-100 theme-${theme}`}
           style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}
           role="article"
           aria-label={`${game.name} card`}>
        {/* Left Section: header + meta */}
        <div style={{ flex: '1', marginRight: '20px' }}>
          <div className="game-header" style={{ marginBottom: '10px' }}>
            <div className="game-day-badge" aria-label={`Day ${game.day}`} style={{ display: 'inline-block', marginRight: '10px' }}>
              <Zap size={14} />
              Day {game.day}
            </div>
            {seatsLabel && (
              <div className={`pill ${reg.key === "available" ? "pill-ok" : "pill-dim"}`} aria-label={seatsLabel} style={{ display: 'inline-block', marginRight: '10px' }}>
                {seatsLabel}
              </div>
            )}
            {isThisGameRegistered && (
              <div className="registered-badge" aria-label="You are registered for this game" style={{ display: 'inline-block' }}>
                <CheckCircle size={14} />
                Registered
              </div>
            )}
          </div>

          <div className="game-info">
            <div className="game-title-section">
              <Trophy size={20} className="game-icon" aria-hidden />
              <h3 className="game-title">{game.name}</h3>
            </div>
            {game.tags?.length ? (
              <div className="tag-row">
                {game.tags.slice(0, 3).map((t) => (
                  <span key={t} className="tag-chip" aria-label={`tag ${t}`}>{t}</span>
                ))}
              </div>
            ) : null}
            <p className="game-description">
              {game.description?.length > 160
                ? `${game.description.substring(0, 160)}…`
                : game.description}
            </p>
          </div>
        </div>

        {/* Right Section: stats + actions */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="stats-grid" aria-label="game stats" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="stat-box" title="Team size" style={{ display: 'flex', alignItems: 'center' }}>
              <Users size={16} className="stat-icon" style={{ marginRight: '10px' }} />
              <div className="stat-content">
                <span className="stat-value">{game.maxTeamSize}</span>
                <span className="stat-label"> Team Size</span>
              </div>
            </div>
            <div className="stat-box" title="Entry fee" style={{ display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={16} className="stat-icon" style={{ marginRight: '10px' }} />
              <div className="stat-content">
                <span className="stat-value">₹{formatINR(game.baseFee)}</span>
                <span className="stat-label"> Entry Fee</span>
              </div>
            </div>
            <div className="stat-box" title="Category" style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={16} className="stat-icon" style={{ marginRight: '10px' }} />
              <div className="stat-content">
                <span className="stat-value">{game.classification}</span>
                <span className="stat-label"> Category</span>
              </div>
            </div>
          </div>

          {/* Status Banners */}
          {userId && isThisGameRegistered && (
            <div className="registration-status-banner" role="status" aria-live="polite">
              <CheckCircle size={18} />
              <span>You are registered for this game</span>
            </div>
          )}

          {userId && showDayConflictBanner && (
            <div className="registration-status-banner warning" role="status" aria-live="polite">
              <AlertTriangle size={18} />
              <div>
                <div className="banner-title">You already registered 1 game in Day {game.day}</div>
                {registeredGameName && (
                  <div className="registered-game-name">
                    {registeredGameName} {registeredGameId ? `(ID: ${registeredGameId})` : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="action-section">
            {!userId ? (
              <div className="action-buttons">
                <Link to={detailsHref} className="btn-action secondary" style={{ width: '100%' }}>View Details</Link>
              </div>
            ) : reg.key === "registered" ? (
              <div className="action-buttons">
                <button type="button" className="btn-status registered" disabled aria-disabled="true">
                  <CheckCircle size={16} /> Registered
                </button>
                <Link to={detailsHref} className="btn-action secondary">View Details</Link>
              </div>
            ) : (
              <div className="action-buttons">
                <Link to={detailsHref} className="btn-action secondary" style={{ width: '100%' }}>View Details</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .tech-game-container { height: 100%; }

        .tech-game-card { 
          --accent: #00d4ff; 
          --accent-2: #007bff; 
          --ok: #22c55e;
          --warn: #ffc107;
          --muted: rgba(255,255,255,0.6);
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 16px; padding: 24px; display: flex; gap: 20px;
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
          backdrop-filter: blur(10px);
        }
        .tech-game-card.theme-registered {
          background: linear-gradient(135deg, #0d4f2a 0%, #1a5c3a 50%, #0f3d26 100%);
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
        }
        .tech-game-card.horizontal-layout { flex-direction: row; }
        .tech-game-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0, 212, 255, 0.6);
          box-shadow: 0 20px 40px rgba(0,212,255,0.15);
        }
        .tech-game-card.theme-registered:hover { 
          border-color: rgba(34,197,94,0.6);
          box-shadow: 0 20px 40px rgba(34, 197, 94, 0.25);
        }

        .card-left-section { flex: 2; display: flex; flex-direction: column; gap: 16px; }
        .card-right-section { flex: 1; display: flex; flex-direction: column; gap: 12px; }

        .game-header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: space-between; }

        .game-day-badge { display: flex; align-items: center; gap: 6px; background: linear-gradient(45deg, var(--accent-2), var(--accent)); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: .8rem; font-weight: 600; }
        .registered-badge { display: flex; align-items: center; gap: 6px; background: linear-gradient(45deg, #28a745, #20c997); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: .8rem; font-weight: 600; }
        .pill { padding: 6px 10px; border-radius: 999px; font-size: .75rem; font-weight: 700; border: 1px solid rgba(255,255,255,.2); color: #fff; }
        .pill-ok { background: rgba(34,197,94,.15); border-color: rgba(34,197,94,.35); }
        .pill-dim { background: rgba(255,255,255,.08); }

        .game-title-section { display: flex; align-items: center; gap: 12px; }
        .game-icon { color: var(--accent); }
        .game-title { font-size: 1.3rem; font-weight: 800; margin: 0; background: linear-gradient(45deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 6px 0; }
        .tag-chip { border: 1px solid rgba(255,255,255,.18); color: #fff; background: rgba(255,255,255,.06); padding: 4px 8px; border-radius: 999px; font-size: .7rem; }
        .game-description { color: rgba(255,255,255,.85); font-size: .92rem; line-height: 1.5; margin: 0; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-box { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 8px; transition: all .2s ease; }
        .stat-box:hover { background: rgba(255,255,255,.08); border-color: rgba(0,212,255,.3); }
        .stat-icon { color: var(--accent); flex-shrink: 0; }
        .stat-content { display: flex; flex-direction: column; gap: 2px; }
        .stat-value { color: #fff; font-weight: 700; font-size: .95rem; }
        .stat-label { color: var(--muted); font-size: .72rem; }

        .registration-status-banner { display: flex; gap: 10px; align-items: flex-start; background: rgba(34, 197, 94, .15); border: 2px solid rgba(34, 197, 94, .45); color: var(--ok); padding: 12px; border-radius: 12px; font-weight: 700; animation: pulse-green 2s infinite; }
        .registration-status-banner.warning { background: rgba(255, 193, 7, .12); border-color: rgba(255, 193, 7, .45); color: var(--warn); animation: pulse-yellow 2s infinite; }
        .banner-title { font-size: .95rem; margin-bottom: 2px; }
        .registered-game-name { font-weight: 800; font-size: .9rem; }

        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.35); } 70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        @keyframes pulse-yellow { 0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.35); } 70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); } }

        .action-section { margin-top: auto; }
        .action-buttons { display: flex; flex-direction: column; gap: 8px; }
        .btn-action, .btn-status { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border-radius: 10px; font-weight: 700; font-size: .95rem; text-decoration: none; border: none; cursor: pointer; transition: transform .2s ease, background .2s ease, opacity .2s ease; }
        .btn-action.primary { background: linear-gradient(45deg, var(--accent-2), var(--accent)); color: #fff; }
        .btn-action.primary:hover { transform: translateY(-2px); }
        .btn-action.secondary { background: rgba(255,255,255,.1); color: #fff; border: 1px solid rgba(255,255,255,.2); }
        .btn-action.secondary:hover { background: rgba(255,255,255,.2); }
        .btn-status.registered { background: linear-gradient(45deg, #28a745, #20c997); color: #fff; }
        .btn-disabled { pointer-events: none; opacity: .55; }
        .full-width { width: 100%; }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr; }
          .tech-game-card.horizontal-layout { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default TechnicalGameCard;