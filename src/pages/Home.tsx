import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create query params for search
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    
    navigate(`/hotels?${params.toString()}`);
  };

  // Get tomorrow's date for min check-in date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Get day after tomorrow for min check-out date
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

  return (
    <>
      <div className="bg-primary text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold">Find Your Perfect Stay</h1>
              <p className="lead">Discover amazing hotels and book your next vacation with ease.</p>
            </Col>
            <Col md={6}>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSearch}>
                    <Form.Group className="mb-3">
                      <Form.Label>Where are you going?</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-geo-alt"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="City, destination, or property"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                    
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Check-in</Form.Label>
                          <Form.Control
                            type="date"
                            value={checkIn}
                            min={tomorrowStr}
                            onChange={(e) => {
                              setCheckIn(e.target.value);
                              // If check-out date is before check-in, reset it
                              if (checkOut && e.target.value > checkOut) {
                                setCheckOut('');
                              }
                            }}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Check-out</Form.Label>
                          <Form.Control
                            type="date"
                            value={checkOut}
                            min={checkIn || dayAfterTomorrowStr}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                            disabled={!checkIn}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-grid gap-2">
                      <Button variant="primary" type="submit" size="lg">
                        Search Hotels
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mb-5">
        <h2 className="text-center mb-4">Why Choose Smart Hotel Booking</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning fs-1"></i>
                </div>
                <Card.Title>Best Rates Guaranteed</Card.Title>
                <Card.Text>
                  Find the best deals and exclusive rates with our price match guarantee.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-gift-fill text-primary fs-1"></i>
                </div>
                <Card.Title>Loyalty Rewards</Card.Title>
                <Card.Text>
                  Earn points with every booking and redeem them for discounts on future stays.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="mb-3">
                  <i className="bi bi-shield-check text-success fs-1"></i>
                </div>
                <Card.Title>Secure Booking</Card.Title>
                <Card.Text>
                  Your security is our priority. Our booking platform ensures your data is always protected.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home; 