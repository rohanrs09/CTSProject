import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, Form, Alert } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Hotel, Room, Review, BookingRequest } from '../models/types';
import axios from 'axios';

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch hotel details
        const hotelResponse = await axios.get<Hotel>(`/api/hotels/${id}`);
        setHotel(hotelResponse.data);
        
        // Fetch hotel rooms
        const roomsResponse = await axios.get<Room[]>(`/api/hotels/${id}/rooms`);
        setRooms(roomsResponse.data);
        
        // Fetch hotel reviews
        const reviewsResponse = await axios.get<Review[]>(`/api/hotels/${id}/reviews`);
        setReviews(reviewsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load hotel details. Please try again later.');
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-warning" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-warning" />);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="text-warning" />);
    }
    
    return stars;
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    // Set default dates if not already set
    if (!checkInDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckInDate(tomorrow.toISOString().split('T')[0]);
    }
    
    if (!checkOutDate) {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      setCheckOutDate(dayAfterTomorrow.toISOString().split('T')[0]);
    }
  };

  const handleBookRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) return;
    
    try {
      setBookingError(null);
      
      const bookingData: BookingRequest = {
        roomID: selectedRoom.roomID,
        checkInDate,
        checkOutDate,
        paymentMethod
      };
      
      await axios.post('/api/bookings', bookingData);
      setBookingSuccess(true);
      
      // Reset form
      setSelectedRoom(null);
      setCheckInDate('');
      setCheckOutDate('');
      
      // Redirect to bookings page after short delay
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
      
    } catch (err) {
      setBookingError('Failed to book the room. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hotel details...</p>
        </div>
      </Container>
    );
  }

  if (error || !hotel) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Hotel not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Img 
              variant="top" 
              src={`/images/hotels/${hotel.hotelID}.jpg`} 
              alt={hotel.name}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/images/hotel-placeholder.jpg';
              }}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h3 mb-0">{hotel.name}</Card.Title>
                <div className="d-flex align-items-center">
                  {renderStarRating(hotel.rating)}
                  <span className="ms-1">({hotel.rating})</span>
                </div>
              </div>
              <Card.Text>
                <strong>Location:</strong> {hotel.location}
              </Card.Text>
              <Card.Text>
                <strong>Price Range:</strong> {hotel.priceRange}
              </Card.Text>
              <Card.Text>
                <strong>Amenities:</strong> {hotel.amenities.split(',').map((amenity, index) => (
                  <Badge key={index} bg="info" className="me-1 mb-1">{amenity.trim()}</Badge>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>

          <Tabs
            defaultActiveKey="info"
            className="mb-4"
          >
            <Tab eventKey="info" title="Hotel Information">
              <Card className="shadow-sm">
                <Card.Body>
                  <h4>About {hotel.name}</h4>
                  <p>
                    {hotel.name} is a luxurious hotel located in {hotel.location}. 
                    The hotel offers a range of amenities to ensure a comfortable stay for all guests.
                  </p>
                  <h5>Policies</h5>
                  <ul>
                    <li>Check-in time: 2:00 PM</li>
                    <li>Check-out time: 12:00 PM</li>
                    <li>No smoking inside the rooms</li>
                    <li>Pets are not allowed</li>
                  </ul>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="rooms" title="Available Rooms">
              <Row>
                {rooms.length > 0 ? rooms.map(room => (
                  <Col md={6} key={room.roomID} className="mb-3">
                    <Card className={`shadow-sm h-100 ${selectedRoom?.roomID === room.roomID ? 'border-primary' : ''}`}>
                      <Card.Body>
                        <Card.Title>{room.type}</Card.Title>
                        <Card.Text>
                          <strong>Price:</strong> ${room.price} per night
                        </Card.Text>
                        <Card.Text>
                          <strong>Features:</strong> {room.features.split(',').map((feature, index) => (
                            <Badge key={index} bg="secondary" className="me-1 mb-1">{feature.trim()}</Badge>
                          ))}
                        </Card.Text>
                        <Card.Text>
                          <Badge bg={room.availability ? 'success' : 'danger'}>
                            {room.availability ? 'Available' : 'Unavailable'}
                          </Badge>
                        </Card.Text>
                        {room.availability && (
                          <Button 
                            variant={selectedRoom?.roomID === room.roomID ? 'primary' : 'outline-primary'} 
                            onClick={() => handleRoomSelect(room)}
                          >
                            {selectedRoom?.roomID === room.roomID ? 'Selected' : 'Select Room'}
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                )) : (
                  <Col>
                    <Alert variant="info">No rooms available at the moment.</Alert>
                  </Col>
                )}
              </Row>
            </Tab>
            
            <Tab eventKey="reviews" title="Guest Reviews">
              <Card className="shadow-sm">
                <Card.Body>
                  <h4>Guest Reviews</h4>
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <Card key={review.reviewID} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5>{review.user?.name || 'Anonymous'}</h5>
                              <div className="mb-2">
                                {renderStarRating(review.rating)}
                              </div>
                            </div>
                            <small className="text-muted">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <Card.Text>{review.comment}</Card.Text>
                        </Card.Body>
                      </Card>
                    ))
                  ) : (
                    <Alert variant="info">No reviews yet for this hotel.</Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Book Your Stay</h4>
            </Card.Header>
            <Card.Body>
              {bookingSuccess ? (
                <Alert variant="success">
                  Booking successful! Redirecting to your bookings...
                </Alert>
              ) : (
                <Form onSubmit={handleBookRoom}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Room</Form.Label>
                    <Form.Select 
                      value={selectedRoom?.roomID || ''} 
                      onChange={(e) => {
                        const roomId = parseInt(e.target.value);
                        const room = rooms.find(r => r.roomID === roomId) || null;
                        setSelectedRoom(room);
                      }}
                      required
                    >
                      <option value="">Select a room...</option>
                      {rooms.filter(r => r.availability).map(room => (
                        <option key={room.roomID} value={room.roomID}>
                          {room.type} - ${room.price}/night
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Check-in Date</Form.Label>
                        <Form.Control 
                          type="date" 
                          value={checkInDate} 
                          onChange={(e) => setCheckInDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Check-out Date</Form.Label>
                        <Form.Control 
                          type="date" 
                          value={checkOutDate} 
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          min={checkInDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="PayPal">PayPal</option>
                    </Form.Select>
                  </Form.Group>
                  
                  {bookingError && (
                    <Alert variant="danger" className="mb-3">
                      {bookingError}
                    </Alert>
                  )}
                  
                  {selectedRoom && (
                    <div className="mb-3">
                      <h5>Booking Summary</h5>
                      <p>
                        <strong>{selectedRoom.type}</strong><br />
                        ${selectedRoom.price} x {checkInDate && checkOutDate ? 
                          Math.max(1, Math.floor((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))) :
                          0} nights = 
                        ${checkInDate && checkOutDate ? 
                          (selectedRoom.price * Math.max(1, Math.floor((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2) :
                          0}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={!selectedRoom || !checkInDate || !checkOutDate}
                  >
                    Book Now
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HotelDetail; 