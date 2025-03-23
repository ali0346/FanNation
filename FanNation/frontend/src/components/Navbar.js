import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import logo from '../images/logo.jpg'; // Adjust path as needed

const Navbar = ({ onLoginClick, user, onLogout }) => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleNavClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent navigation
      onLoginClick(); // Show login popup
    }
  };

  const handleLogout = () => {
    onLogout(); // Call logout function passed from App.js
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <header>
      <nav className="navbar">
        <span className="hamburger-btn material-symbols-rounded">menu</span>
        <Link to="/" className="logo">
          <img src={logo} alt="FanNation Logo" />
          <h2>FanNation</h2>
        </Link>
        <ul className="links">
          <span className="close-btn material-symbols-rounded">close</span>
          <li>
            <Link to="/" onClick={handleNavClick}>Home</Link>
          </li>
          <li>
            <Link to="/sports" onClick={handleNavClick}>Sports</Link>
          </li>
          <li>
            <Link to="/community" onClick={handleNavClick}>Community</Link>
          </li>
        </ul>
        {user ? (
          <button className="login-btn" onClick={handleLogout}>
            LOG OUT
          </button>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            LOG IN
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;