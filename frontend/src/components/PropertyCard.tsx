import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div className="property-card" onClick={() => navigate(`/properties/${property._id}`)}>
      <div className="property-card-image">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} />
        ) : (
          <div className="property-card-placeholder">No Image</div>
        )}
        {property.aiGenerated && <span className="ai-badge">AI</span>}
      </div>
      
      <div className="property-card-content">
        <h3>{property.title}</h3>
        <div className="property-card-price">${property.price.toLocaleString()}</div>
        <div className="property-card-details">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.squareFeet} sqft</span>
        </div>
        <div className="property-card-location">
          {property.location.city}, {property.location.state}
        </div>
        <div className="property-card-type">{property.propertyType}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
