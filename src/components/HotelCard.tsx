import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Hotel } from '../models/types';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }
    
    return <div className="mb-2">{stars} <span className="text-muted">({rating.toFixed(1)})</span></div>;
  };

  // Function to render amenities as badges
  const renderAmenities = (amenitiesStr: string) => {
    if (!amenitiesStr) return null;
    
    const amenities = amenitiesStr.split(',').map(item => item.trim());
    const displayedAmenities = amenities.slice(0, 3); // Show only first 3 amenities
    
    return (
      <div className="mb-2">
        {displayedAmenities.map((amenity, index) => (
          <Badge key={index} bg="secondary" className="me-1 mb-1">{amenity}</Badge>
        ))}
        {amenities.length > 3 && (
          <Badge bg="light" text="dark">+{amenities.length - 3} more</Badge>
        )}
      </div>
    );
  };

  return (
    <Card className="h-100 shadow-sm hotel-card">
      <Card.Body>
        <Card.Title>{hotel.name}</Card.Title>
        {renderStarRating(hotel.rating)}
        <Card.Subtitle className="mb-2 text-muted">
          <i className="bi bi-geo-alt-fill"></i> {hotel.location}
        </Card.Subtitle>
        {renderAmenities(hotel.amenities)}
        <Card.Text>
          {/* Placeholder image would go here in a real implementation */}
        </Card.Text>
        <Link to={`/hotels/${hotel.hotelID}`}>
          <Button variant="outline-primary" className="w-100">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default HotelCard; 