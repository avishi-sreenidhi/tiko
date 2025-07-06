import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      setMessage('Login successful!');
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }} className="mt-5">
      <Card>
        <Card.Header>
          <h2 className="mb-0">🔐 Login</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading} size="lg">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </Form>
          {message && (
            <Alert
              variant={message === 'Login successful!' ? 'success' : 'danger'}
              className="mt-3"
              onClose={() => setMessage('')}
              dismissible
            >
              {message}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;