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

    // Get location information
    const [locationResult] = await client.landmarkDetection(req.file.path);
    const landmarks = locationResult.landmarkAnnotations || [];
    const location = landmarks.length > 0 ? landmarks[0].description : 'Unknown';

    res.json({ category, workflow: `${category} workflow triggered`, labels, location });
  } catch (err) {
    res.status(500).json({ error: 'Failed to categorize image', details: err.message });
  }
});

// POST /verify-image
router.post('/verify-image', upload.single('image'), async function(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const guidelines = req.body.guidelines || '';
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

    // Get location information
    const [locationResult] = await client.landmarkDetection(req.file.path);
    const landmarks = locationResult.landmarkAnnotations || [];
    const location = landmarks.length > 0 ? landmarks[0].description : 'Unknown';

    // Verify against guidelines
    const guidelineList = guidelines.split(',').map(g => g.trim().toLowerCase()).filter(g => g);
    if (guidelineList.length === 0) {
      // If no guidelines provided, consider it compliant
      res.json({ category, workflow: `${category} workflow triggered`, labels, location, complies: true });
      return;
    }

    // Check if any of the guidelines are present in the labels
    const matchingGuidelines = guidelineList.filter(guideline => 
      labels.some(label => label.includes(guideline) || guideline.includes(label))
    );

    // Consider it compliant if at least 50% of the guidelines are matched
    const complianceThreshold = 0.5;
    const complies = matchingGuidelines.length / guidelineList.length >= complianceThreshold;

    res.json({ 
      category, 
      workflow: `${category} workflow triggered`, 
      labels, 
      location, 
      complies,
      matchingGuidelines,
      totalGuidelines: guidelineList.length,
      matchedGuidelines: matchingGuidelines.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify image', details: err.message });
  }
});

module.exports = router;
