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
const { apiLimiter, aiLimiter } = require('../middleware/rateLimiter');
const {
  createPropertyValidation,
  updatePropertyValidation,
  idValidation,
  searchValidation,
} = require('../middleware/validation');

router.route('/').get(apiLimiter, searchValidation, getProperties).post(apiLimiter, protect, createPropertyValidation, createProperty);
router.post('/ai/generate-description', aiLimiter, protect, generateDescription);
router.post('/ai/search', apiLimiter, aiSearch);
router.post('/ai/recommendations', apiLimiter, getRecommendations);
router.route('/:id').get(apiLimiter, idValidation, getPropertyById).put(apiLimiter, protect, updatePropertyValidation, updateProperty).delete(apiLimiter, protect, idValidation, deleteProperty);

module.exports = router;
