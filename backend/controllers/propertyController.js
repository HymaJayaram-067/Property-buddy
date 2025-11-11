const Property = require('../models/Property');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { search, propertyType, minPrice, maxPrice, bedrooms } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    const properties = await Property.find(query).populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      owner: req.user._id,
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this property' });
      }

      Object.assign(property, req.body);
      property.updatedAt = Date.now();

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this property' });
      }

      await property.deleteOne();
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate property description using AI
// @route   POST /api/properties/ai/generate-description
// @access  Private
const generateDescription = async (req, res) => {
  try {
    const { propertyType, bedrooms, bathrooms, squareFeet, location, amenities } = req.body;

    const prompt = `Generate a compelling property listing description for a ${propertyType} with ${bedrooms} bedrooms, ${bathrooms} bathrooms, ${squareFeet} square feet, located in ${location.city}, ${location.state}. Amenities include: ${amenities.join(', ')}. Make it professional and engaging.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    res.json({ description: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Natural language property search using AI
// @route   POST /api/properties/ai/search
// @access  Public
const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    // Use OpenAI to parse natural language query
    const prompt = `Convert this natural language property search query into structured search parameters: "${query}". 
    Extract: propertyType (house/apartment/condo/townhouse/land), minPrice, maxPrice, bedrooms, bathrooms, city, state.
    Respond in JSON format only with extracted parameters. If a parameter is not mentioned, omit it.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    let searchParams = {};
    try {
      searchParams = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      return res.status(400).json({ message: 'Could not parse search query' });
    }

    // Build MongoDB query
    let dbQuery = {};
    
    if (searchParams.propertyType) {
      dbQuery.propertyType = searchParams.propertyType;
    }
    
    if (searchParams.minPrice || searchParams.maxPrice) {
      dbQuery.price = {};
      if (searchParams.minPrice) dbQuery.price.$gte = searchParams.minPrice;
      if (searchParams.maxPrice) dbQuery.price.$lte = searchParams.maxPrice;
    }
    
    if (searchParams.bedrooms) {
      dbQuery.bedrooms = searchParams.bedrooms;
    }
    
    if (searchParams.bathrooms) {
      dbQuery.bathrooms = searchParams.bathrooms;
    }
    
    if (searchParams.city) {
      dbQuery['location.city'] = new RegExp(searchParams.city, 'i');
    }
    
    if (searchParams.state) {
      dbQuery['location.state'] = new RegExp(searchParams.state, 'i');
    }

    const properties = await Property.find(dbQuery).populate('owner', 'name email');
    res.json({ properties, parsedQuery: searchParams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI-powered property recommendations
// @route   POST /api/properties/ai/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const { propertyId } = req.body;
    
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find similar properties based on criteria
    const recommendations = await Property.find({
      _id: { $ne: propertyId },
      propertyType: property.propertyType,
      bedrooms: { $gte: property.bedrooms - 1, $lte: property.bedrooms + 1 },
      price: { $gte: property.price * 0.8, $lte: property.price * 1.2 },
    }).limit(5).populate('owner', 'name email');

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  generateDescription,
  aiSearch,
  getRecommendations,
};
