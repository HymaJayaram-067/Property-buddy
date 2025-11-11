import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property as PropertyType } from '../types';
import { propertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PropertyDetails.css';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [recommendations, setRecommendations] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getById(id!);
      setProperty(response.data);
    } catch (err: any) {
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await propertyAPI.getRecommendations(id!);
      setRecommendations(response.data);
    } catch (err) {
      console.error('Failed to load recommendations');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.delete(id!);
        navigate('/');
      } catch (err: any) {
        alert('Failed to delete property');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!property) return <div>Property not found</div>;

  const isOwner = user && (typeof property.owner === 'object' 
    ? property.owner._id === user._id 
    : property.owner === user._id);

  return (
    <div className="property-details-container">
      <div className="property-details">
        <h1>{property.title}</h1>
        <div className="property-price">${property.price.toLocaleString()}</div>
        
        <div className="property-info">
          <div className="info-item">
            <strong>Type:</strong> {property.propertyType}
          </div>
          <div className="info-item">
            <strong>Bedrooms:</strong> {property.bedrooms}
          </div>
          <div className="info-item">
            <strong>Bathrooms:</strong> {property.bathrooms}
          </div>
          <div className="info-item">
            <strong>Square Feet:</strong> {property.squareFeet}
          </div>
        </div>

        <div className="property-location">
          <h3>Location</h3>
          <p>{property.location.address}</p>
          <p>{property.location.city}, {property.location.state} {property.location.zipCode}</p>
        </div>

        <div className="property-description">
          <h3>Description</h3>
          <p>{property.description}</p>
          {property.aiGenerated && <span className="ai-badge">AI Generated</span>}
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div className="property-amenities">
            <h3>Amenities</h3>
            <ul>
              {property.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}

        {isOwner && (
          <div className="property-actions">
            <button onClick={() => navigate(`/properties/edit/${id}`)} className="btn-primary">
              Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>Similar Properties</h2>
          <div className="recommendations-grid">
            {recommendations.map((rec) => (
              <div key={rec._id} className="recommendation-card" onClick={() => navigate(`/properties/${rec._id}`)}>
                <h4>{rec.title}</h4>
                <p>${rec.price.toLocaleString()}</p>
                <p>{rec.bedrooms} bed • {rec.bathrooms} bath</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
