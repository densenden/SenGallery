import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGrid from '../components/ImageGrid';
import ImageModal from '../components/ImageModal';

const GalleryPage = () => {
  const { galleryName } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Fetch images for this gallery
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Use relative URL or environment variable instead of hardcoded localhost
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        const response = await fetch(`${apiUrl}/galleries/${galleryName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        
        const data = await response.json();
        
        // Create image objects for the photo album
        const processedImages = data.images.map((image, index) => ({
          id: index,
          src: image.url,
          alt: image.name,
          width: 1600, // Default width until actual dimensions are loaded
          height: 1200, // Default height until actual dimensions are loaded
        }));
        
        setImages(processedImages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, [galleryName]);

  // Handle image click
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
    return images.findIndex(img => img.id === selectedImage.id);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading gallery...</div>
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-light capitalize">
          {galleryName.replace(/-/g, ' ')}
        </h2>
        <Link to="/" className="text-sm border border-secondary px-4 py-2 hover:bg-secondary transition-colors">
          Back to Galleries
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-10">
          <p>No images found in this gallery.</p>
        </div>
      ) : (
        <ImageGrid images={images} onImageClick={handleImageClick} />
      )}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={getCurrentIndex() < images.length - 1}
          hasPrevious={getCurrentIndex() > 0}
        />
      )}
    </div>
  );
};

export default GalleryPage; 