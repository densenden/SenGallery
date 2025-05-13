import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch galleries from the API
    const fetchGalleries = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/galleries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch galleries');
        }
        
        const data = await response.json();
        setGalleries(data.galleries);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading galleries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-light mb-8">Galleries</h2>
      
      {galleries.length === 0 ? (
        <div className="text-center py-10">
          <p>No galleries found. Create folders in the images directory to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Link 
              key={gallery.name}
              to={`/gallery/${gallery.name}`}
              className="block bg-secondary hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-light capitalize">{gallery.name.replace(/-/g, ' ')}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 