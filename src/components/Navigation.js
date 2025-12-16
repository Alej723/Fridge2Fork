import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Search' },
    { to: '/planner', label: 'Planner' },
    { to: '/grocery', label: 'Grocery' },
    { to: '/saved-weeks', label: 'Saved Weeks' },
    { to: '/profile', label: 'Account' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img src="/Fridge2ForkLogo.png" alt="Fridge2Fork Logo" className="nav-logo" />
        <span className="brand-name">Fridge2Fork</span>
      </div>
      
      {/* Hamburger menu button for mobile */}
      <button 
        className="hamburger-menu"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">☰</span>
      </button>

      {/* Desktop Navigation */}
      <div className="nav-links-desktop">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation (only shows when menu is open) */}
      <div className={`nav-links-mobile ${isMenuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;