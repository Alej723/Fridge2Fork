import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <img src="/Fridge2ForkLogo.png" alt="Fridge2Fork Logo" className="nav-logo" />
        <span className="brand-name">Fridge2Fork</span>
      </div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
          Search
        </Link>
        <Link to="/planner" className={location.pathname === '/planner' ? 'nav-link active' : 'nav-link'}>
          Planner
        </Link>
        <Link to="/grocery" className={location.pathname === '/grocery' ? 'nav-link active' : 'nav-link'}>
          Grocery
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}>
          Account
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;