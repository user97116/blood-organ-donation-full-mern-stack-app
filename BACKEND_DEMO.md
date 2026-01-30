# ⚙️ Backend Demo Guide - Blood Donation System

## What is the Backend?

The **backend** is the server-side application that handles all the business logic, database operations, and API endpoints. Built with **Node.js** and **Express**, it provides secure data management and API services for the frontend.

## 🚀 Quick Start

### Setup (2 minutes)
```bash
# In the main project folder
npm install

# Start the development server
npm run dev
```
✅ Server runs at: http://localhost:5000

## 🏗️ Backend Architecture

### Core Components
- **Express Server:** HTTP request handling
- **SQLite Database:** Data storage and management
- **JWT Authentication:** Secure user sessions
- **bcryptjs:** Password encryption
- **CORS:** Cross-origin resource sharing

### Project Structure
```
├── server.js          # Main server file
├── database.db        # SQLite database (auto-created)
├── package.json       # Dependencies and scripts
└── node_modules/      # Installed packages
```

## 🗄️ Database Schema Demo

### Tables Overview
```sql
-- Users: Donors, Admins, Hospital staff
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    blood_type TEXT,
    role TEXT DEFAULT 'donor'
);

-- Hospitals: Medical facilities
CREATE TABLE hospitals (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    license_number TEXT UNIQUE
);

-- Blood Donations: Donation records
CREATE TABLE blood_donations (
    id INTEGER PRIMARY KEY,
    donor_id INTEGER,
    blood_type TEXT,
    quantity INTEGER,
    donation_date DATE,
    expiry_date DATE
);

-- Blood Requests: Blood needed
CREATE TABLE blood_requests (
    id INTEGER PRIMARY KEY,
    requester_id INTEGER,
    blood_type TEXT,
    quantity INTEGER,
    urgency TEXT,
    status TEXT DEFAULT 'pending'
);
```

## 🔌 API Endpoints Demo

### Authentication APIs
```bash
# Register new user
POST /api/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "blood_type": "A+"
}

# User login
POST /api/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { "token": "jwt_token_here", "user": {...} }
```

### Dashboard APIs
```bash
# Get dashboard statistics
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>
Response: {
  "totalUsers": 150,
  "totalDonations": 89,
  "totalRequests": 23,
  "bloodInventory": {...}
}
```

### Blood Management APIs
```bash
# Record blood donation
POST /api/blood-donations
Body: {
  "hospital_id": 1,
  "blood_type": "A+",
  "quantity": 450,
  "notes": "Regular donation"
}

# Get blood inventory
GET /api/blood-inventory
Response: {
  "A+": { "quantity": 15, "expiry_dates": [...] },
  "O-": { "quantity": 3, "expiry_dates": [...] }
}
```

## 🎮 Backend Demo Walkthrough

### Part 1: Server Startup (2 minutes)

1. **Show Terminal Output:**
   ```
   Server running on port 5000
   Database connected successfully
   Tables created/verified
   Admin user created
   ```

2. **Database Creation:**
   - SQLite file appears in project folder
   - Tables auto-created on first run
   - Default admin user inserted

### Part 2: API Testing with Postman/curl (5 minutes)

1. **User Registration:**
   ```bash
   curl -X POST http://localhost:5000/api/register \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123",
     "blood_type": "A+"
   }'
   ```

2. **User Login:**
   ```bash
   curl -X POST http://localhost:5000/api/login \
   -H "Content-Type: application/json" \
   -d '{
     "email": "test@example.com",
     "password": "test123"
   }'
   ```

3. **Protected Route Access:**
   ```bash
   curl -X GET http://localhost:5000/api/dashboard/stats \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Part 3: Database Operations (3 minutes)

1. **Show SQLite Database:**
   ```bash
   # Open database in SQLite browser or command line
   sqlite3 database.db
   .tables
   SELECT * FROM users LIMIT 5;
   SELECT * FROM blood_donations LIMIT 5;
   ```

2. **Real-time Data Changes:**
   - Add donation via API
   - Show updated inventory
   - Demonstrate expiry calculation

### Part 4: Security Features (3 minutes)

1. **Password Hashing:**
   ```javascript
   // Show in code: bcryptjs hashing
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Token Verification:**
   ```javascript
   // Middleware demonstration
   const token = req.headers.authorization?.split(' ')[1];
   const decoded = jwt.verify(token, JWT_SECRET);
   ```

3. **Role-based Access:**
   ```javascript
   // Admin-only routes
   if (user.role !== 'admin') {
     return res.status(403).json({ error: 'Access denied' });
   }
   ```

## 🔧 Technical Features

### Data Validation
```javascript
// Input validation example
const validateDonation = (data) => {
  if (!data.blood_type || !data.quantity) {
    throw new Error('Missing required fields');
  }
  if (data.quantity < 100 || data.quantity > 500) {
    throw new Error('Invalid quantity range');
  }
};
```

### Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});
```

### Database Queries
```javascript
// Parameterized queries (SQL injection prevention)
const getDonations = (userId) => {
  return db.all(
    'SELECT * FROM blood_donations WHERE donor_id = ?',
    [userId]
  );
};
```

## 📊 Business Logic Demo

### Blood Expiry Calculation
```javascript
// Automatic expiry date (35 days from donation)
const donationDate = new Date();
const expiryDate = new Date(donationDate);
expiryDate.setDate(expiryDate.getDate() + 35);
```

### Inventory Management
```javascript
// Update inventory after donation
const updateInventory = async (bloodType, quantity) => {
  await db.run(`
    INSERT INTO blood_inventory (blood_type, quantity, expiry_date)
    VALUES (?, ?, ?)
  `, [bloodType, quantity, expiryDate]);
};
```

### Request Fulfillment
```javascript
// Check if request can be fulfilled
const canFulfillRequest = async (bloodType, quantity) => {
  const available = await getAvailableBlood(bloodType);
  return available.quantity >= quantity;
};
```

## 🎯 Backend Demo Script

### Opening (1 minute)
"Now let me show you the backend - the engine that powers everything behind the scenes."

### Server Demo (2 minutes)
1. Start server with npm run dev
2. Show terminal output
3. Explain auto-database creation

### API Testing (4 minutes)
1. Test registration endpoint
2. Test login and get JWT token
3. Test protected routes
4. Show error handling

### Database Demo (3 minutes)
1. Open SQLite database
2. Show table structure
3. Demonstrate data relationships

### Security Demo (2 minutes)
1. Show password hashing
2. Explain JWT tokens
3. Demonstrate role-based access

## 🔍 Monitoring & Debugging

### Server Logs
```javascript
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
```

### Database Monitoring
```bash
# Check database size
ls -lh database.db

# Monitor active connections
netstat -an | grep :5000
```

### Performance Metrics
- Response time monitoring
- Database query optimization
- Memory usage tracking
- Error rate monitoring

## 🎪 Backend Demo Tips

### Preparation
- Have Postman/curl ready
- Prepare sample API requests
- Clear database for fresh demo
- Have SQLite browser installed

### During Demo
- Show actual HTTP requests/responses
- Explain status codes (200, 401, 500)
- Demonstrate error scenarios
- Show database changes in real-time

### Key Points to Emphasize
- **Security:** Encrypted passwords, JWT tokens
- **Reliability:** Error handling, data validation
- **Performance:** Efficient database queries
- **Scalability:** RESTful API design
- **Maintainability:** Clean, organized code

---

**Backend Success:** Audience should understand the robust, secure foundation that powers the entire application!
