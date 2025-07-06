import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Badge, Alert, Spinner, Card } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MyTickets({ token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get(`${API_URL}/api/tickets/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTickets(res.data.tickets))
    .catch(() => setTickets([]))
    .finally(() => setLoading(false));
  }, [token]);

  const statusVariant = status => {
    if (status === 'open') return 'warning';
    if (status === 'in progress') return 'info';
    if (status === 'closed') return 'success';
    return 'secondary';
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h2 className="mb-0">🎟️ My Tickets</h2>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : tickets.length === 0 ? (
            <Alert variant="secondary">You have not created any tickets yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Reply</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>
                      <Badge bg={statusVariant(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td>
                      {ticket.aiReply ? (
                        <span style={{ whiteSpace: 'pre-line' }}>{ticket.aiReply}</span>
                      ) : (
                        <span className="text-muted">No reply yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MyTickets;