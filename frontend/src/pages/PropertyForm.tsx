import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PropertyForm.css';

const PropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    amenities: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getById(id!);
      const property = response.data;
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        propertyType: property.propertyType,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        squareFeet: property.squareFeet.toString(),
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        zipCode: property.location.zipCode,
        amenities: property.amenities.join(', '),
      });
    } catch (err) {
      setError('Failed to load property');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (isEdit && id) {
      fetchProperty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateDescription = async () => {
    if (!formData.propertyType || !formData.bedrooms || !formData.bathrooms || !formData.squareFeet || !formData.city || !formData.state) {
      alert('Please fill in property type, bedrooms, bathrooms, square feet, city, and state first');
      return;
    }

    try {
      setGeneratingDesc(true);
      const response = await propertyAPI.generateDescription({
        propertyType: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFeet: parseInt(formData.squareFeet),
        location: {
          city: formData.city,
          state: formData.state,
        },
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      });
      setFormData({
        ...formData,
        description: response.data.description,
      });
    } catch (err) {
      alert('Failed to generate description');
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      propertyType: formData.propertyType,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      squareFeet: parseInt(formData.squareFeet),
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      images: [],
    };

    try {
      if (isEdit) {
        await propertyAPI.update(id!, propertyData);
      } else {
        await propertyAPI.create(propertyData);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <h2>{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label htmlFor="title">Property Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              step="0.5"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="squareFeet">Square Feet</label>
            <input
              type="number"
              id="squareFeet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amenities">Amenities (comma-separated)</label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g., Pool, Garage, Garden"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            required
          />
          <button
            type="button"
            onClick={handleGenerateDescription}
            className="btn-secondary"
            disabled={generatingDesc}
          >
            {generatingDesc ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
