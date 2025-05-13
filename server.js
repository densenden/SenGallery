const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const imagesPath = path.join(__dirname, 'public', 'images');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all galleries
app.get('/api/galleries', (req, res) => {
  try {
    const folders = fs.readdirSync(imagesPath);
    
    const galleries = folders
      .filter(folder => {
        const folderPath = path.join(imagesPath, folder);
        return fs.statSync(folderPath).isDirectory();
      })
      .map(gallery => {
        // Try to count images in the gallery
        let count = 0;
        let previewImage = null;
        
        try {
          const galleryPath = path.join(imagesPath, gallery);
          const files = fs.readdirSync(galleryPath);
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          
          const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
          });
          
          count = images.length;
          
          // Set the first image as preview if available
          if (images.length > 0) {
            previewImage = `/images/${gallery}/${images[0]}`;
          }
        } catch (err) {
          console.error(`Error reading gallery ${gallery}:`, err);
        }
        
        return {
          name: gallery,
          path: `/images/${gallery}`,
          count: count,
          previewImage: previewImage,
          description: `Gallery ${gallery}`
        };
      });
    
    res.json({ galleries });
  } catch (error) {
    console.error('Error reading galleries:', error);
    res.status(500).json({ error: 'Error reading galleries' });
  }
});

// Get images from a specific gallery
app.get('/api/galleries/:galleryName', (req, res) => {
  try {
    const galleryPath = path.join(imagesPath, req.params.galleryName);
    
    if (!fs.existsSync(galleryPath) || !fs.statSync(galleryPath).isDirectory()) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    
    const files = fs.readdirSync(galleryPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Get basic file stats
        const filePath = path.join(galleryPath, file);
        let stats = {};
        
        try {
          const fileStats = fs.statSync(filePath);
          stats = {
            size: fileStats.size,
            created: fileStats.birthtime
          };
        } catch (err) {
          console.error(`Error reading file stats for ${file}:`, err);
        }
        
        return {
          name: file,
          url: `/images/${req.params.galleryName}/${file}`,
          stats: stats
        };
      })
      // Sort by filename (could be modified to sort by date or other attributes)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({ 
      gallery: req.params.galleryName,
      count: images.length,
      images: images
    });
  } catch (error) {
    console.error('Error reading gallery images:', error);
    res.status(500).json({ error: 'Error reading gallery images' });
  }
});

// Get information about a specific image
app.get('/api/galleries/:galleryName/:imageName', (req, res) => {
  try {
    const imagePath = path.join(imagesPath, req.params.galleryName, req.params.imageName);
    
    if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const stats = fs.statSync(imagePath);
    
    res.json({
      name: req.params.imageName,
      gallery: req.params.galleryName,
      url: `/images/${req.params.galleryName}/${req.params.imageName}`,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
  } catch (error) {
    console.error('Error reading image information:', error);
    res.status(500).json({ error: 'Error reading image information' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 