import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="glass-navbar fixed-top px-3">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-white fw-bold">
          <img
            src="/logo.png"
            alt="Logo"
            className="navbar-logo me-2"
            style={{ width: 30, height: 30 }}
          />
          WellNuts
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to="/" className="nav-link-glass">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/ventas" className="nav-link-glass">Ventas</Nav.Link>
            <Nav.Link as={Link} to="/clientes" className="nav-link-glass">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/productos" className="nav-link-glass">Productos</Nav.Link>
            {isAuthenticated && (
              <div className="d-flex align-items-center ms-3">
                <Link to="/perfil">
                  <img
                    src={user?.foto_perfil_url || '/profile.png'}
                    alt="Perfil"
                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-action btn-delete ms-2"
                  style={{ fontSize: '0.9rem', padding: '6px 14px' }}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
