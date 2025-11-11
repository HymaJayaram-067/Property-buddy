import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Property Pulse
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          
          {user ? (
            <>
              <Link to="/properties/new" className="navbar-link">Add Property</Link>
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={logout} className="navbar-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
