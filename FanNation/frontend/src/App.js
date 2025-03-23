import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './style.css';
import Navbar from './components/Navbar';
import Popup from './components/Popup';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import SportsCategories from './components/SportsCategories';
import CategoryPage from './components/CategoryPage';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.token) {
        try {
          const response = await fetch('http://localhost:8080/api/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${storedUser.token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user:', err);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Login response data:', data);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setShowPopup(false);
        alert('Login successful! Redirecting to homepage...');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      if (response.ok) {
        setShowPopup(false);
        setIsSignup(false);
        alert('Signup successful! Please log in.');
      } else {
        setError('Signup failed. Email or username may already exist.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user from localStorage
    setUser(null); // Clear user state
    setLoginData({ email: '', password: '' }); // Reset login form
  };

  return (
    <Router>
      <div>
        <Navbar 
          onLoginClick={() => setShowPopup(true)} 
          user={user} 
          onLogout={handleLogout} // Pass logout function
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sports" element={<PrivateRoute element={<SportsCategories />} user={user} />} />
          <Route path="/sports/:categoryId" element={<PrivateRoute element={<CategoryPage />} user={user} />} />
          <Route path="/community" element={<PrivateRoute element={<div>Community Page Coming Soon</div>} user={user} />} />
        </Routes>

        {showPopup && (
          <Popup showPopup={showPopup} isSignup={isSignup} onClose={() => setShowPopup(false)}>
            {!isSignup ? (
              <LoginForm
                loginData={loginData}
                setLoginData={setLoginData}
                handleLoginSubmit={handleLoginSubmit}
                error={error}
                onSignupClick={() => setIsSignup(true)}
              />
            ) : (
              <SignupForm
                signupData={signupData}
                setSignupData={setSignupData}
                handleSignupSubmit={handleSignupSubmit}
                error={error}
                onLoginClick={() => setIsSignup(false)}
              />
            )}
          </Popup>
        )}
      </div>
    </Router>
  );
}

export default App;