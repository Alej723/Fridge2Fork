import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(!isLogin && { name: formData.name })
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem('fridge2fork_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call parent functions
        if (isLogin) {
          onLogin(data.user);
        } else {
          onSignup(data.user);
        }
      } else {
        setError(data.error || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
        
        {error && (
          <div className="error-message" style={{
            color: 'red', 
            marginBottom: '1rem', 
            textAlign: 'center',
            padding: '0.5rem',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              disabled={loading}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            minLength="6"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            className="toggle-auth"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ email: '', password: '', name: '' });
            }}
            disabled={loading}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;