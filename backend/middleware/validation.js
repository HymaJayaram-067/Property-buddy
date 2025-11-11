const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

// Property validation rules
const createPropertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
  body('propertyType')
    .isIn(['house', 'apartment', 'condo', 'townhouse', 'land'])
    .withMessage('Invalid property type'),
  body('bedrooms')
    .isInt({ min: 0, max: 50 })
    .withMessage('Bedrooms must be between 0 and 50'),
  body('bathrooms')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Bathrooms must be between 0 and 50'),
  body('squareFeet')
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Square feet must be between 1 and 1,000,000'),
  validate,
];

const updatePropertyValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid property ID'),
  ...createPropertyValidation,
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

const searchValidation = [
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Min price must be a number'),
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Max price must be a number'),
  query('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer'),
  query('propertyType')
    .optional()
    .isIn(['house', 'apartment', 'condo', 'townhouse', 'land'])
    .withMessage('Invalid property type'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  createPropertyValidation,
  updatePropertyValidation,
  idValidation,
  searchValidation,
  validate,
};
