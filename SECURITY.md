# Security Documentation

This document outlines the security measures implemented in the Property Pulse application.

## Security Features

### 1. Authentication & Authorization
- **JWT-based authentication**: Secure token-based authentication with 30-day expiration
- **Password hashing**: bcrypt with salt rounds for secure password storage
- **Protected routes**: Middleware-based route protection for authenticated endpoints

### 2. Rate Limiting
We implement multiple rate limiting strategies:
- **Auth endpoints**: 5 requests per 15 minutes (login/register)
- **API endpoints**: 100 requests per 15 minutes (general API)
- **AI endpoints**: 20 requests per hour (expensive OpenAI operations)

This prevents:
- Brute force attacks on authentication
- API abuse and DoS attacks
- Excessive AI API usage

### 3. Input Validation & Sanitization
- **express-validator**: Comprehensive input validation for all endpoints
  - Email normalization and validation
  - Field length restrictions
  - Type checking (numbers, ObjectIds, enums)
- **express-mongo-sanitize**: Prevents NoSQL injection by removing MongoDB operators from user input
- **Mongoose schemas**: Type validation at database level

### 4. NoSQL Injection Prevention
Multiple layers of protection:
1. **express-mongo-sanitize**: Strips out `$` and `.` characters from user input
2. **Mongoose ORM**: Parameterized queries prevent injection
3. **Input validation**: express-validator validates and sanitizes all inputs
4. **Type checking**: Schema validation ensures correct data types

**Note**: CodeQL may report SQL injection warnings on Mongoose queries. These are false positives because:
- Mongoose uses parameterized queries internally
- We sanitize all input with express-mongo-sanitize
- All inputs are validated before reaching the database
- MongoDB doesn't use SQL, so traditional SQL injection isn't applicable

### 5. CORS Configuration
- Cross-Origin Resource Sharing enabled for frontend communication
- Can be restricted to specific origins in production

### 6. Environment Variables
Sensitive data stored in environment variables:
- `JWT_SECRET`: Token signing secret
- `MONGODB_URI`: Database connection string
- `OPENAI_API_KEY`: OpenAI API key
- `.env` files excluded from version control

### 7. Error Handling
- Generic error messages to prevent information leakage
- Stack traces only shown in development mode
- Proper HTTP status codes

## Security Recommendations for Production

1. **Environment Variables**
   - Use strong, random JWT_SECRET (32+ characters)
   - Keep OpenAI API key secure
   - Use MongoDB Atlas with authentication

2. **HTTPS**
   - Deploy with HTTPS/TLS encryption
   - Use secure cookies for tokens if implementing cookie-based auth

3. **CORS**
   - Restrict CORS to specific frontend domain in production
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

4. **Rate Limiting**
   - Consider using Redis for distributed rate limiting in scaled deployments
   - Adjust rate limits based on traffic patterns

5. **Database**
   - Use MongoDB Atlas with network access restrictions
   - Enable MongoDB authentication
   - Regular backups

6. **Dependencies**
   - Regular `npm audit` checks
   - Keep dependencies updated
   - Use `npm audit fix` for vulnerabilities

7. **Logging & Monitoring**
   - Implement request logging
   - Monitor for suspicious patterns
   - Set up alerts for failed authentication attempts

## Reporting Security Issues

If you discover a security vulnerability, please email security@propertypulse.com (example) instead of using the public issue tracker.
