# Property Pulse – AI-Powered Real Estate Platform

Property Pulse is a full-stack web application that enables users to discover, evaluate, and interact with property listings using intelligent automation powered by Google Gemini AI.

## Features

- **Full-Stack Architecture**: Built with React (TypeScript), Node.js, Express, and MongoDB
- **AI-Powered Features**:
  - Natural language property search
  - AI-generated property descriptions
  - Intelligent property recommendations
- **User Authentication**: Secure JWT-based authentication
- **Property Management**: Full CRUD operations for property listings
- **Responsive UI**: Mobile-friendly TypeScript-based React interface
- **Advanced Search**: Filter properties by type, price, bedrooms, and more

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Google Gemini API Integration
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- Context API for state management
- Responsive CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key (free from Google AI Studio)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/property-pulse
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey). No credit card required!

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Register/Login
1. Navigate to the registration page
2. Create an account with your email and password
3. Login with your credentials

### Browse Properties
- View all available properties on the home page
- Use the search bar to filter properties
- Try the AI search with natural language queries like "3 bedroom house in Seattle under 500k"

### Add a Property
1. Click "Add Property" in the navigation
2. Fill in the property details
3. Use the "Generate with AI" button to create a compelling description automatically
4. Submit the form to create the listing

### View Property Details
- Click on any property card to view full details
- See AI-powered recommendations for similar properties
- Edit or delete your own listings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Properties
- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### AI Features
- `POST /api/properties/ai/generate-description` - Generate AI description (protected)
- `POST /api/properties/ai/search` - Natural language search
- `POST /api/properties/ai/recommendations` - Get property recommendations

## Project Structure

```
Property-buddy/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── propertyController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Property.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── propertyRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   └── PropertyForm.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── README.md
```

## Getting a Free Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. Add it to your `.env` file as `GEMINI_API_KEY`

**Benefits of Google Gemini:**
- ✅ Free tier available (no credit card required)
- ✅ Generous rate limits
- ✅ Fast response times
- ✅ Supports JSON output for structured data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
