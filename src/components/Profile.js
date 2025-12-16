import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onUpdatePreferences, preferences }) => {
  const [localPreferences, setLocalPreferences] = useState({
    dietary: [],
    allergies: [],
    otherAllergies: ''
  });

  // Sync with props when preferences change
  useEffect(() => {
    if (preferences && user?.email) {
      setLocalPreferences({
        dietary: preferences.dietary || [],
        allergies: preferences.allergies || [],
        otherAllergies: preferences.otherAllergies || ''
      });
    }
  }, [preferences, user]);

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free'];
  const allergyOptions = ['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Fish'];

  const togglePreference = (type, value) => {
    const updated = {
      ...localPreferences,
      [type]: localPreferences[type].includes(value) 
        ? localPreferences[type].filter(item => item !== value)
        : [...localPreferences[type], value]
    };
    setLocalPreferences(updated);
  };

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
    alert('Preferences saved! They will now filter your recipe search.');
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Account Settings</h2>
        <div className="user-info">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Name:</strong> {user?.name}</p>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </div>
      
      <div className="preference-section">
        <h3>Dietary Preferences</h3>
        <p className="preference-help">Select your dietary preferences to filter recipe search results.</p>
        <div className="preference-grid">
          {dietaryOptions.map(option => (
            <label key={option} className="preference-item">
              <input
                type="checkbox"
                checked={localPreferences.dietary.includes(option)}
                onChange={() => togglePreference('dietary', option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="preference-section">
        <h3>Allergies</h3>
        <p className="preference-help">Select allergies to exclude recipes containing these ingredients.</p>
        <div className="preference-grid">
          {allergyOptions.map(option => (
            <label key={option} className="preference-item">
              <input
                type="checkbox"
                checked={localPreferences.allergies.includes(option)}
                onChange={() => togglePreference('allergies', option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div className="other-allergies">
          <label>Other Allergies (comma separated):</label>
          <input
            type="text"
            placeholder="e.g., sesame, mushrooms, shellfish"
            value={localPreferences.otherAllergies}
            onChange={(e) => setLocalPreferences({...localPreferences, otherAllergies: e.target.value})}
          />
        </div>
      </div>

      <div className="preference-section">
        <h3>Current Preferences</h3>
        <div className="current-preferences">
          <p><strong>Dietary:</strong> {localPreferences.dietary.length > 0 ? localPreferences.dietary.join(', ') : 'None'}</p>
          <p><strong>Allergies:</strong> {localPreferences.allergies.length > 0 ? localPreferences.allergies.join(', ') : 'None'}</p>
          {localPreferences.otherAllergies && (
            <p><strong>Other Allergies:</strong> {localPreferences.otherAllergies}</p>
          )}
        </div>
      </div>

      <button className="save-preferences" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
};

export default Profile;