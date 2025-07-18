import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap'; // 1. Importar Dropdown
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NavBar.css'; // Crearemos este archivo para los estilos del dropdown

const NavBar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const backendUrl = 'http://localhost:3000';
    const profileImageUrl = user?.foto_perfil_url
        ? `${backendUrl}${user.foto_perfil_url}`
        : `${backendUrl}/uploads/default-profile.png`;
    
    // Función para capitalizar la primera letra
    const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

    return (
        <Navbar expand="lg" className="glass-navbar fixed-top px-3">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-white fw-bold">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="me-2"
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

                        {isAuthenticated && user && (
                            // 2. Usar el componente Dropdown
                            <Dropdown align="end">
                                <Dropdown.Toggle as="div" id="dropdown-custom-components" className="nav-link-glass d-flex align-items-center user-dropdown-toggle">
                                    <img
                                        src={profileImageUrl}
                                        alt="Perfil"
                                        className="profile-pic-navbar"
                                    />
                                    {/* 3. Mostrar el nombre de usuario al lado */}
                                    <span className="ms-2 d-none d-lg-block">{user.nombre_usuario}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="user-dropdown-menu">
                                    {/* 4. Contenido del menú desplegable */}
                                    <div className="dropdown-profile-header">
                                        <img
                                            src={profileImageUrl}
                                            alt="Perfil"
                                            className="dropdown-profile-pic"
                                        />
                                        <div className="dropdown-user-info">
                                            <div className="dropdown-username">{user.nombre_usuario}</div>
                                            <div className="dropdown-user-role">{capitalize(user.rol)}</div>
                                        </div>
                                    </div>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/perfil" className="dropdown-item-custom">
                                        Ver Perfil
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout} className="dropdown-item-custom text-danger">
                                        Cerrar Sesión
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;