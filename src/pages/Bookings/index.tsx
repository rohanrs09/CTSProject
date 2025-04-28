import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Booking } from '../../types';

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  React.useEffect(() => {
    // TODO: Fetch bookings from API
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>My Bookings</h2>
          <Card>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.hotelId}</td>
                      <td>{booking.roomId}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>{booking.status}</td>
                      <td>${booking.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Bookings; 