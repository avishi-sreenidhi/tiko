import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Form, Alert, Spinner, Badge, Row, Col, Card } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function AdminDashboard({ token }) {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('active'); // New state for filter
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    totalUsers: 0,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all tickets and stats on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Fetch all tickets
        const ticketsRes = await axios.get(`${API_URL}/api/tickets/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ticketsData = ticketsRes.data.tickets || [];
        setTickets(ticketsData);

        // Fetch user count
        try {
          const usersRes = await axios.get(`${API_URL}/api/auth/users/count`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats({
            totalTickets: ticketsData.length,
            openTickets: ticketsData.filter(t => t.status === 'open').length,
            totalUsers: usersRes.data.count || 0,
          });
        } catch (userErr) {
          // If user count fails, still show ticket stats
          setStats({
            totalTickets: ticketsData.length,
            openTickets: ticketsData.filter(t => t.status === 'open').length,
            totalUsers: 0,
          });
          console.error('Error fetching user count:', userErr);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, message]);

  // Filter tickets based on selected status
  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ticket.status === 'open' || ticket.status === 'in progress';
    return ticket.status === statusFilter;
  });

  // Handle status update
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/tickets/${ticketId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setTickets(tickets =>
        tickets.map(t =>
          t._id === ticketId ? { ...t, status: newStatus } : t
        )
      );
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        openTickets: tickets.filter(t => 
          t._id === ticketId ? newStatus === 'open' : t.status === 'open'
        ).length
      }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusVariant = status => {
    if (status === 'open') return 'warning';
    if (status === 'in progress') return 'info';
    if (status === 'closed') return 'success';
    return 'secondary';
  };

  const boxStyle = {
    background: '#ffe066',
    borderRadius: 16,
    minHeight: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 28,
    color: '#7c5e00',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    border: 'none'
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">📊 Admin Dashboard</h2>
      
      {/* Bento Box Stats */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <>
          <Row className="g-4 justify-content-center mb-5">
            <Col md={4}>
              <Card style={boxStyle}>
                <div>{stats.totalTickets}</div>
                <div style={{ fontSize: 16, fontWeight: 400 }}>Total Requests</div>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={boxStyle}>
                <div>{stats.openTickets}</div>
                <div style={{ fontSize: 16, fontWeight: 400 }}>Open Requests</div>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={boxStyle}>
                <div>{stats.totalUsers}</div>
                <div style={{ fontSize: 16, fontWeight: 400 }}>Total Users</div>
              </Card>
            </Col>
          </Row>

          {/* Messages */}
          {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

          {/* Status Filter */}
          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <h4 className="mb-0">🎫 Support Tickets</h4>
            </Col>
            <Col md={6} className="text-end">
              <Form.Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ maxWidth: 200, display: 'inline-block' }}
              >
                <option value="active">Active Only (Open + In Progress)</option>
                <option value="all">All Tickets</option>
                <option value="open">Open Only</option>
                <option value="in progress">In Progress Only</option>
                <option value="closed">Closed Only</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Tickets Table */}
          {filteredTickets.length === 0 ? (
            <Alert variant="secondary">
              {statusFilter === 'active' ? 'No active tickets found.' : 
               statusFilter === 'all' ? 'No tickets found.' : 
               `No ${statusFilter} tickets found.`}
            </Alert>
          ) : (
            <>
              <div className="mb-2 text-muted">
                Showing {filteredTickets.length} of {tickets.length} tickets
              </div>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td>{ticket.title}</td>
                      <td>{ticket.description}</td>
                      <td>
                        <Badge bg={statusVariant(ticket.status)}>{ticket.status}</Badge>
                      </td>
                      <td>
                        {ticket.createdBy?.name} <br />
                        <span className="text-muted" style={{ fontSize: '0.9em' }}>
                          {ticket.createdBy?.email}
                        </span>
                      </td>
                      <td>
                        <Form.Select
                          value={ticket.status}
                          onChange={e => handleStatusChange(ticket._id, e.target.value)}
                          size="sm"
                        >
                          <option value="open">Open</option>
                          <option value="in progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;