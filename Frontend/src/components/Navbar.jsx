import React, { useEffect, useRef, useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Settings, Menu, X, User } from "lucide-react";

const AppNavbar = ({ isLoggedIn, isAdminLoggedIn, userId, onLogout }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Nav Links
  const guestLinks = [
    { label: "Home", to: "/" },
    { label: "Games", to: "/#games" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Guidelines", to: "/guidelines" },
  ];
  const userLinks = [
    { label: "Home", to: "/" },
    { label: "Games", to: "/#games" },
    { label: "Guidelines", to: "/guidelines" },
    { label: "Registered Games", to: "/registered-games" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ];
  const adminLinks = [
    { label: "Admin Panel", to: "/admin", icon: <Settings size={16} /> },
    { label: "Games", to: "/#games" },
    { label: "Guidelines", to: "/guidelines" },
    { label: "Contact Us", to: "/contact" },
    { label: "About Us", to: "/about" },
  ];

  // Scroll effect for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!expanded) return;
      if (!navRef.current) return;
      // Don't close if clicking on the toggle button or its children
      const toggleButton = navRef.current.querySelector('.mobile-toggle');
      if (toggleButton && (toggleButton.contains(e.target) || toggleButton === e.target)) return;
      // Close if clicking outside the navbar
      if (!navRef.current.contains(e.target)) setExpanded(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [expanded]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus first link when menu opens
  useEffect(() => {
    if (expanded) requestAnimationFrame(() => firstLinkRef.current?.focus());
  }, [expanded]);

  // Handle Games link click
  const handleGamesClick = (e) => {
    e.preventDefault();
    setExpanded(false);

    // If we're not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = '/#games';
      return;
    }

    // If we're on home page, scroll to game cards section with offset for fixed navbar
    const gameCardsSection = document.getElementById('game-cards');
    if (gameCardsSection) {
      const navbarHeight = 80; // Account for fixed navbar height
      const elementPosition = gameCardsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Render Nav Links
  const renderLinks = (linksArray) =>
    linksArray.map((item, idx) => {
      const isActive = location.pathname === item.to;

      // Special handling for Games link
      if (item.label === "Games") {
        return (
          <Nav.Link
            href="#games"
            onClick={handleGamesClick}
            key={item.to}
            ref={idx === 0 ? firstLinkRef : null}
            className={`nav-link${isActive ? " active" : ""}`}
          >
            {item.icon && <span className="me-1">{item.icon}</span>}
            {item.label}
          </Nav.Link>
        );
      }

      return (
        <Nav.Link
          as={Link}
          to={item.to}
          onClick={() => setExpanded(false)}
          key={item.to}
          ref={idx === 0 ? firstLinkRef : null}
          className={`nav-link${isActive ? " active" : ""}`}
        >
          {item.icon && <span className="me-1">{item.icon}</span>}
          {item.label}
        </Nav.Link>
      );
    });

  return (
    <>
      <Navbar
        ref={navRef}
        expand="lg"
        expanded={expanded}
        className={`app-navbar ${scrolled ? "scrolled" : ""}`}
      >
        <Container fluid className="d-flex align-items-center justify-content-between px-3">
          {/* Logo Only */}
          <Navbar.Brand as={Link} to="/" className="brand d-flex align-items-center">
            <img
              src="https://drive.google.com/uc?export=download&id=1wkvCexRdse26PEwdy_RnlCmbL4t2q4Sq"
              alt="VEYG Logo"
              className="brand-logo"
              onError={(e) => {
                e.target.src = "/images/Web-logo.png";
                e.target.onerror = null;
              }}
            />
          </Navbar.Brand>

          {/* Mobile Toggle - Redesigned */}
          <div className="d-lg-none ms-auto d-flex align-items-center">
            <button
              className={`hamburger-menu ${expanded ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded((s) => !s);
              }}
              aria-label={expanded ? "Close menu" : "Open menu"}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Nav Links */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={`justify-content-center ${expanded ? "show-drawer" : ""}`}
          >
            <Nav className="mx-auto main-nav">
              {!isLoggedIn && !isAdminLoggedIn && renderLinks(guestLinks)}
              {isLoggedIn && !isAdminLoggedIn && renderLinks(userLinks)}
              {isAdminLoggedIn && renderLinks(adminLinks)}
            </Nav>

            {/* User / Login */}
            <div className="d-flex align-items-center ms-3">
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle id="dropdown-user" className="user-toggle">
                    <User size={16} className="me-2" />
                    <span className="user-text">{userId || "User"}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-menu">
                    {isAdminLoggedIn ? (
                      <>
                        <Dropdown.Item as={Link} to="/admin">
                          <User size={16} className="me-2" /> Admin Profile
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin">
                          <Settings size={16} className="me-2" /> Admin Dashboard
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item to="/profile" as={Link}>
                        <User size={16} className="me-2" /> Profile
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onLogout} className="text-danger">
                      <LogOut size={16} className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle id="dropdown-login" className="login-toggle">
                    Login
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/student-login">Student Login</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/student-signup">Student Sign Up</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/admin-login" className="text-pink">Admin Login</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Styles */}
      <style>{`
        :root {
          --accent: #00eaff;
          --accent-2: #8b5cf6;
          --muted: #9aa8bf;
          --glass: rgba(255,255,255,0.06);
        }
        
        /* Hamburger Menu Styles */
        .hamburger-menu {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 24px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          position: relative;
          z-index: 2001;
          transition: all 0.3s ease;
        }
        
        .hamburger-line {
          display: block;
          width: 100%;
          height: 2px;
          background-color: rgba(255,255,255,0.9);
          border-radius: 4px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        .hamburger-menu.active .hamburger-line:nth-child(1) {
          transform: translateY(11px) rotate(45deg);
          background-color: var(--accent);
        }
        
        .hamburger-menu.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        
        .hamburger-menu.active .hamburger-line:nth-child(3) {
          transform: translateY(-11px) rotate(-45deg);
          background-color: var(--accent);
        }
        
        .hamburger-menu:hover .hamburger-line {
          background-color: var(--accent);
        }
        .app-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          min-height: 72px;
          background: rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          padding: 0.5rem 0;
          z-index: 2000;
          transition: background 240ms ease, box-shadow 240ms ease;
        }
        .app-navbar.scrolled {
          background: rgba(255,255,255,0.12);
          box-shadow: 0 8px 30px rgba(2,8,23,0.55);
        }
        .brand-logo {
          height: 52px;
          width: auto;
          border-radius: 10px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.45), 0 0 12px rgba(0,234,255,0.06);
          object-fit: contain;
        }
        .main-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
        }
        .main-nav .nav-link {
          color: rgba(255,255,255,0.92);
          padding: 8px 12px;
          margin: 0 6px;
          border-radius: 8px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          transition: color .18s ease, background .18s ease;
        }
        .main-nav .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: width 0.3s ease;
        }
        .main-nav .nav-link:hover::before {
          width: 100%;
        }
        .main-nav .nav-link:hover {
          color: var(--accent);
          background: rgba(0,0,0,0.06);
        }
        .main-nav .nav-link.active {
          color: var(--accent);
        }
        .main-nav .nav-link.active::before {
          width: 100%;
        }
        @media (max-width: 991.98px) {
          .navbar-collapse {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            height: calc(100vh - 72px);
            max-height: none;
            background: rgba(17, 25, 40, 0.95);
            padding: 32px 24px;
            overflow-y: auto;
            box-shadow: 0 20px 50px rgba(2,8,23,0.7);
            transform: translateY(-10px);
            opacity: 0;
            pointer-events: none;
            transition: transform .4s cubic-bezier(0.16, 1, 0.3, 1), opacity .4s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(20px);
            z-index: 1050;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .navbar-collapse.show-drawer {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
          .main-nav {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 2rem;
            width: 100%;
          }
          .main-nav .nav-link {
            padding: 16px;
            font-size: 1.25rem;
            color: rgba(255,255,255,0.85);
            border-radius: 12px;
            text-align: left;
            width: 100%;
            border-left: 3px solid transparent;
            transition: all 0.3s ease;
          }
          .main-nav .nav-link:hover {
            color: var(--accent);
            background: rgba(0,234,255,0.1);
            border-left: 3px solid var(--accent);
          }
          .main-nav .nav-link.active {
            color: var(--accent);
            background: rgba(0,234,255,0.15);
            border-left: 3px solid var(--accent);
          }
          .main-nav .nav-link::before {
            display: none;
          }
          .navbar-collapse .d-flex {
            justify-content: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default AppNavbar;