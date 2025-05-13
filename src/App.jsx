import React, { useState, useEffect } from 'react';

const App = () => {
  const [galleries, setGalleries] = useState([]);
  const [currentGallery, setCurrentGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch galleries
  useEffect(() => {
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

  // Fetch images when a gallery is selected
  useEffect(() => {
    if (!currentGallery) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/galleries/${currentGallery}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        setImages(data.images);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentGallery]);

  // Handle gallery selection
  const handleGalleryClick = (galleryName) => {
    setCurrentGallery(galleryName);
    setSelectedImage(null);
  };

  // Handle back to galleries
  const handleBackClick = () => {
    setCurrentGallery(null);
    setSelectedImage(null);
  };

  // Handle image selection
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Find image index in array
  const getCurrentIndex = () => {
    if (!selectedImage) return -1;
    return images.findIndex(img => img.url === selectedImage.url);
  };

  // Navigate to next image
  const handleNext = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  // Navigate to previous image
  const handlePrevious = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  };

  if (loading && !currentGallery && !selectedImage) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <header className="py-6 border-b border-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-light tracking-wider uppercase">Sen Gallery</h1>
          <p className="font-mono text-light-gray text-sm mt-1">Minimalist photography gallery</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!currentGallery ? (
          // Gallery List View
          <div>
            <h2 className="text-xl font-light mb-8">Galleries</h2>
            
            {galleries.length === 0 ? (
              <div className="text-center py-10">
                <p>No galleries found. Create folders in the images directory to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <div 
                    key={gallery.name}
                    onClick={() => handleGalleryClick(gallery.name)}
                    className="cursor-pointer bg-secondary hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-light capitalize">{gallery.name.replace(/-/g, ' ')}</h3>
                      <p className="font-mono text-light-gray text-xs mt-2">View gallery →</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Gallery Image View
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light capitalize">
                  {currentGallery.replace(/-/g, ' ')}
                </h2>
                <p className="font-mono text-light-gray text-xs mt-1">{images.length} images</p>
              </div>
              <button 
                onClick={handleBackClick}
                className="text-sm border border-secondary px-4 py-2 hover:bg-secondary transition-colors font-mono text-light-gray"
              >
                ← Back
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading images...</div>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-10">
                <p>No images found in this gallery.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.name}
                    className="cursor-pointer overflow-hidden relative transition-transform duration-300 hover:scale-[1.02]"
                    onClick={() => handleImageClick(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <p className="font-mono text-white text-xs truncate">{image.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
          onClick={handleCloseModal}
        >
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
            
            <button 
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full"
              onClick={handleCloseModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="font-mono text-white text-xs">{selectedImage.name}</p>
              <p className="font-mono text-light-gray text-xs mt-1">{getCurrentIndex() + 1} of {images.length}</p>
            </div>
            
            {getCurrentIndex() > 0 && (
              <button 
                className="absolute top-1/2 -translate-y-1/2 left-4 bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
            
            {getCurrentIndex() < images.length - 1 && (
              <button 
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      <footer className="py-6 border-t border-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-light-gray text-xs">© {new Date().getFullYear()} Sen Gallery</p>
        </div>
      </footer>
    </div>
  );
};

export default App; 