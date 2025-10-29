import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onUpdatePreferences }) => {
  const [preferences, setPreferences] = useState({
    dietary: [],
    allergies: [],
    otherAllergies: ''
  });

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free'];
  const allergyOptions = ['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Fish'];

  const togglePreference = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSave = () => {
    onUpdatePreferences(preferences);
    alert('Preferences saved!');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Account Settings</h2>
        <div className="user-info">
          <p><strong>Email:</strong> {user?.email}</p>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </div>
      
      <div className="preference-section">
        <h3>Dietary Preferences</h3>
        <div className="preference-grid">
          {dietaryOptions.map(option => (
            <label key={option} className="preference-item">
              <input
                type="checkbox"
                checked={preferences.dietary.includes(option)}
                onChange={() => togglePreference('dietary', option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="preference-section">
        <h3>Allergies</h3>
        <div className="preference-grid">
          {allergyOptions.map(option => (
            <label key={option} className="preference-item">
              <input
                type="checkbox"
                checked={preferences.allergies.includes(option)}
                onChange={() => togglePreference('allergies', option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div className="other-allergies">
          <label>Other Allergies:</label>
          <input
            type="text"
            placeholder="List any other allergies..."
            value={preferences.otherAllergies}
            onChange={(e) => setPreferences({...preferences, otherAllergies: e.target.value})}
          />
        </div>
      </div>

      <button className="save-preferences" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
};

export default Profile;