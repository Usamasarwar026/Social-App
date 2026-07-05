import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserFriends,
  FaVideo,
  FaStore,
  FaUsers,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBell,
  FaCommentDots,
} from "react-icons/fa";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Avatar from "../avatar/Avatar";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.authSlice?.user);

  // controls offcanvas open/close manually
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      closeMenu();
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={(val) => setExpanded(val)}
        className="bg-body-tertiary navbar-shadow"
      >
        <Container fluid>
          <Navbar.Brand className="title" href="/">
            US S<span>ocial</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand"
            aria-labelledby="offcanvasNavbarLabel-expand"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                className="title"
                id="offcanvasNavbarLabel-expand"
              >
                US S<span>ocial</span>
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search..."
                  className="ms-3"
                  aria-label="Search"
                />
              </Form>

              {/* Center nav icons */}
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <Link to="/" className="nav-icon-link mx-2" onClick={closeMenu}>
                  <FaHome size={22} />
                  <span className="d-lg-none ms-2">Home</span>
                </Link>
                <Link
                  to="/people"
                  className="nav-icon-link mx-2"
                  onClick={closeMenu}
                >
                  <FaUserFriends size={22} />
                  <span className="d-lg-none ms-2">Friends</span>
                </Link>
                <Link to="#" className="nav-icon-link mx-2" onClick={closeMenu}>
                  <FaVideo size={22} />
                  <span className="d-lg-none ms-2">Videos</span>
                </Link>
                <Link to="#" className="nav-icon-link mx-2" onClick={closeMenu}>
                  <FaStore size={22} />
                  <span className="d-lg-none ms-2">Store</span>
                </Link>
                <Link to="#" className="nav-icon-link mx-2" onClick={closeMenu}>
                  <FaUsers size={22} />
                  <span className="d-lg-none ms-2">Groups</span>
                </Link>
              </Nav>

              {/* Right side – auth-aware */}
              <Nav className="header-right-nav">
                {user ? (
                  <>
                    <Nav.Link
                      href="#"
                      className="nav-icon-link header-icon-only"
                      onClick={closeMenu}
                    >
                      <FaBell size={20} />
                    </Nav.Link>
                    <Nav.Link
                      href="#"
                      className="nav-icon-link header-icon-only"
                      onClick={closeMenu}
                    >
                      <FaCommentDots size={20} />
                    </Nav.Link>
                    <Link
                      to={`/profile/${user.uid}`}
                      className="header-user-info"
                      onClick={closeMenu}
                    >
                      <Avatar name={user.username} size={34} />
                      <span className="header-username d-none d-lg-inline">
                        {user.username}
                      </span>
                    </Link>
                    <button
                      className="header-logout-btn"
                      onClick={handleLogout}
                      aria-label="Logout"
                    >
                      <FaSignOutAlt size={16} />
                      <span className="header-logout-text">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      href="/login"
                      className="login-signup-link mx-1"
                      onClick={closeMenu}
                    >
                      <FaSignInAlt size={15} className="me-1" />
                      Login
                    </Nav.Link>
                    <Nav.Link
                      href="/signup"
                      className="login-signup-link signup-btn mx-1"
                      onClick={closeMenu}
                    >
                      <FaUserPlus size={15} className="me-1" />
                      Sign Up
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
