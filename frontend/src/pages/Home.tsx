import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import './Home.css';

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (searchParams?: any) => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAll(searchParams);
      setProperties(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params: any) => {
    await fetchProperties(params);
  };

  const handleAISearch = async (query: string) => {
    try {
      setLoading(true);
      const response = await propertyAPI.aiSearch(query);
      setProperties(response.data.properties);
      setError('');
    } catch (err: any) {
      setError('AI search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Property Pulse</h1>
        <p>AI-Powered Real Estate Platform</p>
        <SearchBar onSearch={handleSearch} onAISearch={handleAISearch} />
      </div>

      <div className="properties-section">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <Link to="/properties/new" className="btn-primary">Add Property</Link>
        </div>

        {loading && <div className="loading">Loading properties...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="properties-grid">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {!loading && properties.length === 0 && (
          <div className="no-properties">No properties found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
