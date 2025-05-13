# Sen Gallery 🖼️

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://gallery.sen.studio)

A minimalist gallery website inspired by Tadao Ando's architectural style, designed for displaying images with elegant simplicity.

🌐 **[Live Website](https://gallery.sen.studio)**

## Features

- ✨ **Fully Dynamic**: Automatically detects all image folders and files without manual configuration
- 📱 **Responsive Design**: Optimized for all screen sizes, including portrait touchscreens
- 🔲 **Multiple Layouts**: Grid layout with configurable columns
- 🌓 **Dark/Light Mode**: Theme toggle with persistent settings
- 👆 **Touch & Keyboard Navigation**: Intuitive controls for all devices
- 🔍 **Image Modal**: Clean, fullscreen image viewing experience
- ▶️ **Slideshow Mode**: Automatic presentation with play/pause controls

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/densenden/SenGallery
   cd sengallery
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Add your images:
   - Place your images in subdirectories under the `public/images/` folder
   - Example: `public/images/gallery1/image1.jpg`
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP

4. Start the server:
   ```
   ./start.sh
   ```
   Or you can run:
   ```
   npm run server
   ```

5. Open in your browser:
   ```
   http://localhost:3001
   ```

## Adding New Galleries 📁

To add a new gallery, simply create a new folder under `public/images/` and add your images to it. The gallery will be automatically detected and displayed on the homepage.

For example:
```
public/images/my_new_gallery/image1.jpg
public/images/my_new_gallery/image2.jpg
```

No code changes are required - the system will automatically detect the new gallery and its images.

## Technical Details 🔧

- 🖥️ **Frontend**: HTML, CSS, JavaScript (Vanilla)
- 🔄 **Backend**: Node.js with Express
- 🔤 **Fonts**: Geist and Geist Mono
- 💾 **No Database Required**: Galleries are generated directly from the filesystem

## Design Principles 🎨

Inspired by Tadao Ando's minimalist architectural style, Sen Gallery emphasizes:

- 🧹 Clean, uncluttered spaces
- 📐 Strong geometric forms
- ☯️ Balance of light and shadow
- ✨ Simplicity and elegance
- 🖼️ Focus on the content itself

## License

ISC 