import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import { Hotel, Room } from '../models/types';
import { hotelAPI, roomAPI } from '../services/api';

const Hotels: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search filters
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  // Common amenities for filter checkboxes
  const commonAmenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service'];

  // Load hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have check-in/check-out dates, fetch available rooms first
        if (checkIn && checkOut) {
          const roomsResponse = await roomAPI.getAvailableRooms(checkIn, checkOut);
          setAvailableRooms(roomsResponse.data);
          
          // Fetch all hotels
          const hotelsResponse = await hotelAPI.getHotels();
          
          // Filter hotels that have available rooms
          const hotelIdsWithRooms = new Set(roomsResponse.data.map((room: Room) => room.hotelID));
          const availableHotels = hotelsResponse.data.filter((hotel: Hotel) => 
            hotelIdsWithRooms.has(hotel.hotelID)
          );
          
          setHotels(availableHotels);
          setFilteredHotels(availableHotels);
        } else {
          // Just fetch all hotels if no dates specified
          const response = await hotelAPI.getHotels();
          setHotels(response.data);
          setFilteredHotels(response.data);
        }
      } catch (err: any) {
        setError('Failed to load hotels. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [checkIn, checkOut]);

  // Update filtered hotels when filters change
  useEffect(() => {
    let result = [...hotels];
    
    // Filter by location
    if (location) {
      result = result.filter(hotel => 
        hotel.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Filter by price range using available rooms
    if ((minPrice !== undefined || maxPrice !== undefined) && availableRooms.length > 0) {
      const hotelIdsInPriceRange = new Set(
        availableRooms
          .filter((room: Room) => {
            const price = room.price;
            if (minPrice !== undefined && maxPrice !== undefined) {
              return price >= minPrice && price <= maxPrice;
            } else if (minPrice !== undefined) {
              return price >= minPrice;
            } else if (maxPrice !== undefined) {
              return price <= maxPrice;
            }
            return true;
          })
          .map((room: Room) => room.hotelID)
      );
      
      result = result.filter(hotel => hotelIdsInPriceRange.has(hotel.hotelID));
    }
    
    // Filter by amenities
    if (amenities.length > 0) {
      result = result.filter(hotel => {
        const hotelAmenitiesList = hotel.amenities.split(',').map((a: string) => a.trim().toLowerCase());
        return amenities.every((amenity: string) => 
          hotelAmenitiesList.includes(amenity.toLowerCase())
        );
      });
    }
    
    setFilteredHotels(result);
    
    // Update URL search params
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    setSearchParams(params, { replace: true });
    
  }, [hotels, location, minPrice, maxPrice, amenities, availableRooms, setSearchParams]);

  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  return (
    <Container>
      <h1 className="my-4">Hotels</h1>
      
      <Row>
        {/* Filter sidebar */}
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>Filters</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City or destination"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Price Range</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        min={0}
                        value={minPrice || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        min={0}
                        value={maxPrice || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Amenities</Form.Label>
                  {commonAmenities.map((amenity) => (
                    <Form.Check
                      key={amenity}
                      type="checkbox"
                      label={amenity}
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="mb-2"
                    />
                  ))}
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Hotel list */}
        <Col md={9}>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : filteredHotels.length === 0 ? (
            <Alert variant="info">
              No hotels found matching your criteria. Try adjusting your filters.
            </Alert>
          ) : (
            <Row>
              {filteredHotels.map((hotel) => (
                <Col key={hotel.hotelID} md={6} lg={4} className="mb-4">
                  <HotelCard hotel={hotel} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Hotels; 