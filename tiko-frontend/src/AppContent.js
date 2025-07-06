import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';
import AdminDashboard from './pages/AdminDashboard';

function AppContent({ token, setToken, user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/my-tickets');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            🎫 Tiko Support
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {!token ? (
                <>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              ) : (
                <>
                  {user && user.role === 'admin' ? (
                    <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/create-ticket">Create Ticket</Nav.Link>
                      <Nav.Link as={Link} to="/my-tickets">My Tickets</Nav.Link>
                    </>
                  )}
                </>
              )}
            </Nav>
            {user && (
              <Nav>
                <Navbar.Text className="me-3">
                  Welcome, {user.name} ({user.role})
                </Navbar.Text>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={
            <Row className="align-items-center min-vh-75">
              <Col md={6} className="text-center text-md-start">
                <h1 className="display-4 mb-4">🎫 Tiko Support Ticket System</h1>
                <p className="lead">
                  {!user ? 
                    "Welcome! Please register or login to get started." : 
                    `Welcome back, ${user.name}! Ready to manage your support tickets?`
                  }
                </p>
              </Col>
              <Col md={6} className="text-center">
                <img
                  src="/hero.png"
                  alt="Tiko Support Hero"
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: 16 
                  }}
                />
              </Col>
            </Row>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/create-ticket" element={<CreateTicket token={token} />} />
          <Route path="/my-tickets" element={<MyTickets token={token} />} />
          <Route path="/admin" element={<AdminDashboard token={token} />} />
        </Routes>
      </Container>
    </>
  );
}

export default AppContent;