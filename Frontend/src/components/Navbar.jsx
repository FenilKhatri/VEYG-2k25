import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { User, LogOut, Settings } from "lucide-react"

const AppNavbar = ({ isLoggedIn, isAdminLoggedIn, userId, onLogout }) => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="shadow-lg"
      style={{
        background: "rgba(11, 15, 26, 0.2)", // Transparent dark overlay
        backdropFilter: "blur(10px)", // Glass-like blur
        WebkitBackdropFilter: "blur(10px)", // For Safari
        borderBottom: "1px solid rgba(0, 234, 255, 0.3)",
        boxShadow: "0 4px 20px rgba(0, 234, 255, 0.1)",
        transition: "background 0.3s ease-in-out"
      }}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="p-3"
          style={{
            textDecoration: "none"
          }}
        >
          <img
            src="/src/public/Web-logo.png"
            alt="VEYG 2K25"
            style={{
              height: "60px",
              width: "auto",
              filter: "drop-shadow(0 0 10px rgba(0, 234, 255, 0.5))"
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="mx-auto">
            {/* Show different nav items based on user role */}
            {!isLoggedIn && (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  active={location.pathname === "/"}
                  style={{
                    color: "#00eaff",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                  onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  active={location.pathname === "/about"}
                  style={{
                    color: "#00eaff",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                  onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                >
                  About Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  active={location.pathname === "/contact"}
                  style={{
                    color: "#00eaff",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                  onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                >
                  Contact Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/guidelines"
                  active={location.pathname === "/guidelines"}
                  style={{
                    color: "#00eaff",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                  onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                >
                  Guidelines
                </Nav.Link>
              </>
            )}

            {isLoggedIn && !isAdminLoggedIn && (
              <>
                {["Home", "Guidelines", "Registered Games", "About Us", "Contact Us"].map((item, idx) => {
                  const paths = ["/", "/guidelines", "/registered-games", "/about", "/contact"];
                  return (
                    <Nav.Link
                      key={idx}
                      as={Link}
                      to={paths[idx]}
                      active={location.pathname === paths[idx]}
                      style={{
                        color: "#00eaff",
                        textDecoration: "none",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                      onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                    >
                      {item}
                    </Nav.Link>
                  );
                })}
              </>
            )}

            {isAdminLoggedIn && (
              <>
                {["Admin Panel", "Guidelines", "Contact Us", "About Us"].map((item, idx) => {
                  const paths = ["/admin", "/guidelines", "/contact", "/about"];
                  return (
                    <Nav.Link
                      key={idx}
                      as={Link}
                      to={paths[idx]}
                      active={location.pathname === paths[idx]}
                      style={{
                        color: "#00eaff",
                        textDecoration: "none",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.color = "#ff00e5"}
                      onMouseLeave={(e) => e.target.style.color = "#00eaff"}
                    >
                      {idx === 0 && <Settings size={18} className="me-1" />}
                      {item}
                    </Nav.Link>
                  );
                })}
              </>
            )}
          </Nav>

          {isLoggedIn ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                id="dropdown-user"
                style={{
                  background: "rgba(30, 40, 60, 0.8)",
                  border: "1px solid rgba(100, 120, 150, 0.4)",
                  color: "#e0e6ed",
                  fontWeight: "500",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease"
                }}
              >
                {userId || 'User'}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  background: "rgba(11, 15, 26, 0.95)",
                  border: "1px solid rgba(0, 234, 255, 0.3)",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Dropdown.Item
                  as={Link}
                  to={isAdminLoggedIn ? "/admin-profile" : "/profile"}
                  style={{ color: "#00eaff" }}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: "rgba(0, 234, 255, 0.3)" }} />
                <Dropdown.Item
                  onClick={onLogout}
                  style={{ color: "#00eaff" }}
                >
                  <LogOut size={18} className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown align="end" className="m-3">
              <Dropdown.Toggle
                id="dropdown-login"
                style={{
                  background: "rgba(30, 40, 60, 0.8)",
                  border: "1px solid rgba(100, 120, 150, 0.4)",
                  color: "#e0e6ed",
                  fontWeight: "500",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease"
                }}
              >
                Login
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  background: "rgba(11, 15, 26, 0.95)",
                  border: "1px solid rgba(0, 234, 255, 0.3)",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Dropdown.Item
                  as={Link}
                  to="/student-login"
                  style={{ color: "#00eaff" }}
                >
                  Student Login
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/student-signup"
                  style={{ color: "#00eaff" }}
                >
                  Student Sign Up
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: "rgba(0, 234, 255, 0.3)" }} />
                <Dropdown.Item
                  as={Link}
                  to="/admin-login"
                  style={{ color: "#e83e8c" }}
                >
                  Admin Login
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar;