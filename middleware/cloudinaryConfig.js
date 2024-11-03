const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection
cloudinary.api.resources({ max_results: 1 }, (error, result) => {
  if (error) {
    console.error('Cloudinary Connection Error:', error);
  } else {
    console.log('Cloudinary Connection Successful:');
  }
});

module.exports = cloudinary;
