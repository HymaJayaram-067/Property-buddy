const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  generateDescription,
  aiSearch,
  getRecommendations,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

router.route('/').get(getProperties).post(protect, createProperty);
router.post('/ai/generate-description', protect, generateDescription);
router.post('/ai/search', aiSearch);
router.post('/ai/recommendations', getRecommendations);
router.route('/:id').get(getPropertyById).put(protect, updateProperty).delete(protect, deleteProperty);

module.exports = router;
