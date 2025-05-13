import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const ImageGrid = ({ images, onImageClick }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3 }}
    >
      <Masonry gutter="16px">
        {images.map((image) => (
          <div 
            key={image.id}
            className="image-container cursor-pointer"
            onClick={() => onImageClick(image)}
          >
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default ImageGrid; 