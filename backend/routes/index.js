const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const vision = require('@google-cloud/vision');
const path = require('path');

// Set up Google Vision client
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../google-credentials.json')
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST /categorize-image
router.post('/categorize-image', upload.single('image'), async function(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  try {
    // Use Google Vision API to detect labels
    const [result] = await client.labelDetection(req.file.path);
    const labels = result.labelAnnotations?.map(l => l.description.toLowerCase()) || [];
    let category = 'other';
    if (labels.some(label => label.includes('document'))) {
      category = 'document';
    } else if (labels.some(label => label.includes('nature'))) {
      category = 'nature';
    }
    res.json({ category, workflow: `${category} workflow triggered`, labels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to categorize image', details: err.message });
  }
});

module.exports = router;
