import React, { useEffect } from 'react';

const ImageModal = ({ image, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        onPrevious();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Lock scrolling on body
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  // Add touch swipe support
  let touchStartX = 0;
  
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) {
        // Swipe left - next image
        onNext();
      } else if (diff < 0 && hasPrevious) {
        // Swipe right - previous image
        onPrevious();
      }
    }
  };

  return (
    <div 
      className="modal"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={image.src} 
          alt={image.alt}
          className="modal-image"
        />
        
        <button 
          className="close-button"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {hasPrevious && (
          <button 
            className="navigation-button left-4"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        
        {hasNext && (
          <button 
            className="navigation-button right-4"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal; 