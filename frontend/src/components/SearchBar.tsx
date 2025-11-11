import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (params: any) => void;
  onAISearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAISearch }) => {
  const [searchType, setSearchType] = useState<'normal' | 'ai'>('normal');
  const [aiQuery, setAiQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const handleNormalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    
    onSearch(params);
  };

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      onAISearch(aiQuery);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-type-toggle">
        <button
          className={searchType === 'normal' ? 'active' : ''}
          onClick={() => setSearchType('normal')}
        >
          Normal Search
        </button>
        <button
          className={searchType === 'ai' ? 'active' : ''}
          onClick={() => setSearchType('ai')}
        >
          AI Search
        </button>
      </div>

      {searchType === 'normal' ? (
        <form onSubmit={handleNormalSearch} className="normal-search-form">
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />

          <input
            type="number"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          />

          <button type="submit" className="btn-primary">Search</button>
        </form>
      ) : (
        <form onSubmit={handleAISearch} className="ai-search-form">
          <input
            type="text"
            placeholder="e.g., 3 bedroom house in Seattle under 500k"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="ai-search-input"
          />
          <button type="submit" className="btn-primary">AI Search</button>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
