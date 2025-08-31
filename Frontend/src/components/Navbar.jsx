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
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Guidelines", to: "/guidelines" },
  ];
  const userLinks = [
    { label: "Home", to: "/" },
    { label: "Guidelines", to: "/guidelines" },
    { label: "Registered Games", to: "/registered-games" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ];
  const adminLinks = [
    { label: "Admin Panel", to: "/admin", icon: <Settings size={16} /> },
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

  // Render Nav Links
  const renderLinks = (linksArray) =>
    linksArray.map((item, idx) => {
      const isActive = location.pathname === item.to;
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
        <Container fluid="lg" className="d-flex align-items-center justify-content-between">
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

          {/* Mobile Toggle */}
          <div className="d-lg-none ms-auto d-flex align-items-center">
            <button
              className="icon-btn mobile-toggle"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded((s) => !s);
              }}
              aria-label={expanded ? "Close menu" : "Open menu"}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.9)',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {expanded ? <X size={22} /> : <Menu size={22} />}
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
                        <Dropdown.Item as={Link} to="/admin-profile">
                          <User size={16} className="me-2" /> Admin Profile
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin">
                          <Settings size={16} className="me-2" /> Admin Dashboard
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item as={Link} to="/profile">
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
            top: 84px;
            left: 18px;
            right: 18px;
            max-height: calc(100vh - 120px);
            background: rgba(255,255,255,0.95);
            border-radius: 12px;
            padding: 20px;
            overflow-y: auto;
            box-shadow: 0 20px 50px rgba(2,8,23,0.7);
            transform: scale(0.95);
            opacity: 0;
            pointer-events: none;
            transition: transform .3s ease, opacity .3s ease;
            backdrop-filter: blur(10px);
            z-index: 1050;
          }
          .navbar-collapse.show-drawer {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
          }
          .main-nav {
            flex-direction: column;
            gap: 8px;
            margin-bottom: 1rem;
          }
          .main-nav .nav-link {
            padding: 12px 16px;
            font-size: 1r1) In the all pages give the container width like bootstrap or tailwind has a class that we give container class to the any tag so it gives margin from both side left and right so give it to the all pages.  



2) In the hero section of the home page add this below 4 cards:

past event details or previous year details - 

 create 2 cards:- 1) add that 850+ registrations 2) total of 5 games.



3) in the sponsors section instead of just logo add this:

   sponsors logo, name and short 5 10 words description and while click on any sponsors redirect to their original website.



4) remove the countdown and make it some different view and place it before technical games title and it looks like that it's a registration countdown. at now you just add a table with 4 cards but not looks good.



5) In the tech game cards, between of both card add "OR" keyword so it shows that to participate in one game only.



6) Create a day-wise registration functionality and if student register one game then update the technical game card of that day and above the view details button display that you already registered one game in {this} day! same for the Day .



7) In the footer there's a contact number, email, and address so while click on the mail that redirects to the gmail app or web but while click on the contact number and address then it not redirects to the dialer, and map respectively. em;
            color: rgba(0,0,0,0.8);
            border-radius: 8px;
            text-align: center;
            width: 100%;
          }
          .main-nav .nav-link:hover {
            color: var(--accent);
            background: rgba(0,234,255,0.1);
          }
          .navbar-collapse .d-flex {
            justify-content: center;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </>
  );
};

export default AppNavbar;