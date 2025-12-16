import React, { useEffect, useState } from 'react';
import './SavedWeeks.css';

const SavedWeeks = () => {
  const [savedWeeks, setSavedWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSavedWeeks();
  }, []);

  const fetchSavedWeeks = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('fridge2fork_token');

      const res = await fetch(`${apiUrl}/mealplans/saved-weeks`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await res.json();
      console.log('Saved weeks data:', data);
      
      if (data.success) {
        setSavedWeeks(data.savedWeeks || []);
      } else {
        console.error('Failed to fetch saved weeks:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch saved weeks:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewWeekDetails = (week) => {
    setSelectedWeek(week);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWeek(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDayName = (key) => {
    const days = {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday'
    };
    return days[key] || key;
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading saved weeks...</div>;

  return (
    <div className="saved-weeks-page">
      <h2>Saved Weeks</h2>
      <br></br>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Your favorite meal plans from the past</p>
      
      {savedWeeks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#f8f9fa',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No saved weeks yet!</p>
          <p>Go to the Planner and click "Save This Week to Favorites" to save your current meal plan.</p>
        </div>
      ) : (
        <div className="weeks-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          padding: '1rem 0'
        }}>
          {savedWeeks.map((week) => {
            const totalRecipes = Object.values(week.days || {}).flat().length;
            const recipeImages = Object.values(week.days || {})
              .flat()
              .filter(recipe => recipe?.image)
              .slice(0, 8);
            
            return (
              <div
                key={week._id}
                className="week-card"
                onClick={() => viewWeekDetails(week)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #eaeaea'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    ❤️ {week.name || 'My Week'}
                  </h3>
                  <span style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    backgroundColor: '#f0f0f0',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px'
                  }}>
                    {totalRecipes} meals
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#888', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📅</span>
                  <span>Saved {formatDate(week.createdAt)}</span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {recipeImages.map((recipe, idx) => (
                    <img
                      key={idx}
                      src={recipe.image}
                      alt={recipe.title || 'Recipe'}
                      style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #eee'
                      }}
                      title={recipe.title}
                    />
                  ))}
                  {recipeImages.length === 0 && (
                    <div style={{
                      gridColumn: 'span 4',
                      textAlign: 'center',
                      padding: '1rem',
                      color: '#999',
                      fontSize: '0.9rem'
                    }}>
                      No recipe images
                    </div>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  <span>Click to view details →</span>
                  <span style={{
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    FAVORITE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for viewing week details */}
      {showModal && selectedWeek && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
              onMouseOut={(e) => e.target.style.background = 'none'}
            >
              ✕
            </button>

            <h2 style={{ 
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              ❤️ {selectedWeek.name || 'My Saved Week'}
            </h2>
            <p style={{ 
              color: '#666', 
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              Saved on {formatDate(selectedWeek.createdAt)}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(selectedWeek.days || {}).map(([dayKey, recipes]) => (
                <div key={dayKey} style={{
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #eaeaea'
                }}>
                  <h3 style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1rem',
                    color: '#333',
                    fontWeight: '600',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #ff6b6b'
                  }}>
                    {getDayName(dayKey)}
                    <span style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginLeft: '0.5rem',
                      fontWeight: 'normal'
                    }}>
                      ({recipes.length})
                    </span>
                  </h3>
                  
                  {recipes.length === 0 ? (
                    <p style={{ 
                      color: '#999', 
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      padding: '1rem'
                    }}>
                      No meals planned
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {recipes.map((recipe, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: 'white',
                          borderRadius: '8px',
                          border: '1px solid #eee'
                        }}>
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '6px'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: 0, 
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              color: '#333',
                              marginBottom: '0.25rem'
                            }}>
                              {recipe.title}
                            </h4>
                            {recipe.time && (
                              <p style={{ 
                                margin: 0, 
                                fontSize: '0.8rem',
                                color: '#666'
                              }}>
                                ⏱️ {recipe.time}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #eee',
              textAlign: 'center'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '0.75rem 2rem',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedWeeks;