// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Image Compression API
app.post('/api/compress', upload.single('image'), async (req, res) => {
  try {
    const outputPath = `compressed/${Date.now()}.jpg`;
    
    await require('sharp')(req.file.path)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    res.download(outputPath, () => {
      // Temporary files delete karein
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend serve karein
app.use(express.static(path.join(__dirname, '../')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
