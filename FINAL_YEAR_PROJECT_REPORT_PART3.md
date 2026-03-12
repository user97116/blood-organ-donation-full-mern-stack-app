# BLOOD & ORGAN DONATION MANAGEMENT SYSTEM
## Final Year Project Report - Part 3

# CHAPTER 3
# SPECIFICATIONS

## 3.1 Hardware Requirements

### 3.1.1 Development Environment

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB or higher |
| Storage | 256 GB HDD | 512 GB SSD |
| Display | 1366 x 768 | 1920 x 1080 |
| Network | Broadband Internet | High-speed Internet |

### 3.1.2 Deployment Environment (Server)

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB | 50 GB SSD |
| Bandwidth | 1 TB/month | 2 TB/month |
| Network | 100 Mbps | 1 Gbps |

### 3.1.3 Client Requirements

| Component | Specification |
|-----------|---------------|
| Device | Desktop, Laptop, Tablet, Smartphone |
| Display | Minimum 320px width (responsive) |
| Network | Internet connection (minimum 1 Mbps) |
| Input | Keyboard, Mouse, or Touch screen |

## 3.2 Software Requirements

### 3.2.1 Development Tools

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 14.x or higher | Runtime environment |
| npm | 6.x or higher | Package manager |
| Visual Studio Code | Latest | Code editor |
| Git | 2.x or higher | Version control |
| Postman | Latest | API testing |
| Chrome DevTools | Latest | Debugging |

### 3.2.2 Runtime Environment

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 14.x or higher | Backend runtime |
| SQLite | 3.x | Database |
| Web Browser | Latest versions | Client access |

**Supported Browsers:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

### 3.2.3 Operating System

**Development:**
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Fedora, etc.)

**Deployment:**
- Linux (Ubuntu Server 20.04+ recommended)
- Windows Server 2019+
- Cloud platforms (AWS, Azure, Google Cloud)

## 3.3 Technology Stack

### 3.3.1 Frontend Technologies

**React.js 18.x**
- Component-based architecture
- Virtual DOM for performance
- Rich ecosystem of libraries
- Strong community support

**React Router 6.x**
- Client-side routing
- Nested routes support
- Navigation management
- URL parameter handling

**Axios**
- HTTP client for API calls
- Promise-based
- Request/response interceptors
- Error handling

**CSS3**
- Modern styling
- Flexbox and Grid layouts
- Animations and transitions
- Responsive design

### 3.3.2 Backend Technologies

**Node.js 14+**
- JavaScript runtime
- Event-driven architecture
- Non-blocking I/O
- High performance

**Express.js 4.x**
- Web application framework
- Middleware support
- Routing
- RESTful API development

**SQLite3**
- Lightweight database
- Serverless
- Zero configuration
- ACID compliant

**JWT (jsonwebtoken)**
- Stateless authentication
- Token-based security
- Compact and self-contained
- Industry standard

**bcryptjs**
- Password hashing
- Salt generation
- Secure password storage
- Brute-force protection

### 3.3.3 Database

**SQLite 3.x**

**Advantages:**
- Lightweight (< 1 MB)
- No separate server process
- Single file database
- Cross-platform
- ACID compliant
- Zero configuration
- Public domain license

**Limitations:**
- Not suitable for very high concurrency
- Limited to single write at a time
- No user management
- File-based (not network database)

**Why SQLite for this project:**
- Perfect for small to medium deployments
- Easy development and testing
- Simple backup (single file)
- No database server setup required
- Sufficient for blood bank operations
- Can migrate to PostgreSQL/MySQL later if needed

## 3.4 Development Tools

### 3.4.1 Code Editor

**Visual Studio Code**
- Syntax highlighting
- IntelliSense
- Integrated terminal
- Git integration
- Extensions for React, Node.js
- Debugging support

**Useful Extensions:**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- GitLens
- REST Client

### 3.4.2 Version Control

**Git**
- Distributed version control
- Branch management
- Collaboration support
- History tracking

**GitHub/GitLab**
- Remote repository hosting
- Collaboration features
- Issue tracking
- CI/CD integration

### 3.4.3 API Testing

**Postman**
- API endpoint testing
- Request collections
- Environment variables
- Automated testing
- Documentation generation

### 3.4.4 Development Server

**Nodemon**
- Auto-restart on file changes
- Development efficiency
- Error detection
- Custom configurations

## 3.5 Database Schema

### 3.5.1 Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  blood_type TEXT,
  address TEXT,
  age INTEGER,
  gender TEXT,
  organ_donor INTEGER DEFAULT 0,
  organs_to_donate TEXT,
  role TEXT DEFAULT 'donor',
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- id: Unique identifier
- name: User's full name
- email: Unique email address
- password: Hashed password
- phone: Contact number
- blood_type: Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- address: Residential address
- age: User's age
- gender: Male/Female/Other
- organ_donor: Boolean flag (0/1)
- organs_to_donate: Comma-separated organ list
- role: admin/donor/hospital
- status: active/inactive
- created_at: Registration timestamp

### 3.5.2 Hospitals Table

```sql
CREATE TABLE hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3.5.3 Doctors Table

```sql
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialization TEXT,
  hospital_id INTEGER,
  license_number TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

### 3.5.4 Blood Donations Table

```sql
CREATE TABLE blood_donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  hospital_id INTEGER,
  blood_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  donation_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

### 3.5.5 Blood Requests Table

```sql
CREATE TABLE blood_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER,
  hospital_id INTEGER,
  blood_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  urgency TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  requested_date DATE NOT NULL,
  fulfilled_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

### 3.5.6 Blood Inventory Table

```sql
CREATE TABLE blood_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blood_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  hospital_id INTEGER,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

### 3.5.7 Organ Donations Table

```sql
CREATE TABLE organ_donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  hospital_id INTEGER,
  organ_type TEXT NOT NULL,
  medical_diseases TEXT,
  allergies TEXT,
  blood_pressure TEXT,
  diabetes TEXT,
  current_medications TEXT,
  previous_surgeries TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  consent_sop_accepted INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  donation_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);
```

## 3.6 API Specifications

### 3.6.1 Authentication Endpoints

**POST /api/register**
- Description: Register new user
- Authentication: Not required
- Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "blood_type": "O+",
  "age": 25,
  "gender": "Male"
}
```
- Response: 201 Created
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}
```

**POST /api/login**
- Description: User login
- Authentication: Not required
- Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Response: 200 OK
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "role": "donor"
  }
}
```

### 3.6.2 Blood Donation Endpoints

**POST /api/blood-donations**
- Description: Record blood donation
- Authentication: Required (JWT)
- Request Body:
```json
{
  "hospital_id": 1,
  "blood_type": "O+",
  "quantity": 1,
  "donation_date": "2024-03-11"
}
```
- Response: 201 Created

**GET /api/blood-donations**
- Description: Get blood donations
- Authentication: Required (JWT)
- Query Parameters: None
- Response: 200 OK
```json
[
  {
    "id": 1,
    "donor_name": "John Doe",
    "blood_type": "O+",
    "quantity": 1,
    "donation_date": "2024-03-11",
    "expiry_date": "2024-04-15"
  }
]
```

### 3.6.3 Blood Request Endpoints

**POST /api/blood-requests**
- Description: Submit blood request
- Authentication: Required (JWT)
- Request Body:
```json
{
  "hospital_id": 1,
  "blood_type": "O+",
  "quantity": 2,
  "urgency": "High",
  "reason": "Emergency surgery"
}
```
- Response: 201 Created

**GET /api/blood-requests**
- Description: Get blood requests
- Authentication: Required (JWT)
- Response: 200 OK

### 3.6.4 Inventory Endpoints

**GET /api/blood-inventory**
- Description: Get current blood inventory
- Authentication: Required (JWT)
- Response: 200 OK
```json
[
  {
    "blood_type": "O+",
    "quantity": 15,
    "expiry_date": "2024-04-15"
  }
]
```

### 3.6.5 Hospital Management Endpoints

**GET /api/hospitals**
- Description: Get all hospitals
- Authentication: Required (JWT)
- Response: 200 OK

**POST /api/hospitals**
- Description: Add new hospital
- Authentication: Required (Admin only)
- Request Body:
```json
{
  "name": "City Hospital",
  "address": "123 Main St",
  "phone": "1234567890",
  "email": "info@cityhospital.com",
  "license_number": "LIC123456"
}
```
- Response: 201 Created

**PUT /api/hospitals/:id**
- Description: Update hospital
- Authentication: Required (Admin only)
- Response: 200 OK

**DELETE /api/hospitals/:id**
- Description: Delete hospital
- Authentication: Required (Admin only)
- Response: 200 OK

### 3.6.6 AI Assistant Endpoint

**POST /api/chat**
- Description: AI assistant query
- Authentication: Not required
- Request Body:
```json
{
  "message": "kidney sop"
}
```
- Response: 200 OK
```json
{
  "reply": "🫘 Kidney Donation SOP:..."
}
```

### 3.6.7 Dashboard Endpoint

**GET /api/dashboard/stats**
- Description: Get dashboard statistics
- Authentication: Required (JWT)
- Response: 200 OK
```json
{
  "totalDonors": 150,
  "totalHospitals": 10,
  "totalDonations": 500,
  "totalInventory": 200
}
```

---

# CHAPTER 4
# SYSTEM ARCHITECTURE

## 4.1 Overall Architecture

The Blood & Organ Donation Management System follows a modern three-tier architecture pattern, separating concerns into distinct layers:

**Presentation Layer (Client):**
- React.js single-page application
- Responsive user interface
- Client-side routing
- State management

**Application Layer (Server):**
- Node.js with Express.js
- RESTful API endpoints
- Business logic processing
- Authentication and authorization

**Data Layer (Database):**
- SQLite database
- Data persistence
- Query optimization
- Transaction management

**Architecture Benefits:**
- Separation of concerns
- Independent scaling
- Easy maintenance
- Technology flexibility
- Parallel development

## 4.2 Three-Tier Architecture

### 4.2.1 Presentation Layer

**Components:**
- React Components
- CSS Stylesheets
- Client-side routing (React Router)
- HTTP client (Axios)

**Responsibilities:**
- User interface rendering
- User input handling
- Client-side validation
- API communication
- State management
- Navigation

**Key Features:**
- Component-based architecture
- Virtual DOM for performance
- Responsive design
- Progressive enhancement
- Accessibility support

### 4.2.2 Application Layer

**Components:**
- Express.js server
- Route handlers
- Middleware functions
- Business logic
- Authentication service
- AI assistant service

**Responsibilities:**
- Request processing
- Business logic execution
- Data validation
- Authentication/Authorization
- Database operations
- Response generation

**Middleware Stack:**
1. CORS middleware
2. JSON body parser
3. Authentication middleware
4. Route handlers
5. Error handling middleware

### 4.2.3 Data Layer

**Components:**
- SQLite database
- Database schema
- Query functions
- Transaction management

**Responsibilities:**
- Data persistence
- Data retrieval
- Data integrity
- Transaction management
- Backup and recovery

**Database Operations:**
- CRUD operations
- Complex queries
- Aggregations
- Joins
- Transactions

## 4.3 Component Architecture

### 4.3.1 Frontend Components

**App.js**
- Root component
- Routing configuration
- Global state
- Authentication context

**Dashboard.js**
- Statistics display
- Quick actions
- Recent activity
- Charts and graphs

**DonateBlood.js**
- Donation form
- Hospital selection
- Blood type selection
- Form validation

**RequestBlood.js**
- Request form
- Urgency selection
- Reason input
- Form submission

**AdminPanel.js**
- User management
- Hospital management
- Doctor management
- Statistics overview

**ChatAssistant.js**
- Chat interface
- Message display
- Query input
- Response rendering

**Login.js / Register.js**
- Authentication forms
- Input validation
- Error handling
- Redirect logic

### 4.3.2 Backend Components

**server.js**
- Express app initialization
- Middleware configuration
- Route registration
- Server startup

**config/database.js**
- Database initialization
- Schema creation
- Connection management

**middleware/auth.js**
- JWT verification
- User authentication
- Role authorization
- Token validation

**routes/bloodDonations.js**
- Donation endpoints
- Request handling
- Database operations

**routes/hospitals.js**
- Hospital CRUD operations
- Authorization checks
- Data validation

**routes/chat.js**
- AI assistant logic
- Query processing
- Response generation
- Database queries

## 4.4 Security Architecture

### 4.4.1 Authentication Flow

```
1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Token sent to client
5. Client stores token (localStorage)
6. Client includes token in subsequent requests
7. Server verifies token on each request
8. Server processes authorized request
```

### 4.4.2 Authorization Levels

**Public Access:**
- Registration
- Login
- AI Assistant (basic queries)

**Authenticated Access:**
- Dashboard
- Donate Blood
- Request Blood
- View History
- Update Profile

**Admin Access:**
- User Management
- Hospital Management
- Doctor Management
- All Donations View
- All Requests View
- System Statistics

### 4.4.3 Security Measures

**Password Security:**
- bcrypt hashing (10 salt rounds)
- No plain text storage
- Minimum length requirements
- Complexity requirements (optional)

**Token Security:**
- JWT with expiration (24 hours)
- Signed with secret key
- Includes user ID and role
- Verified on each request

**Input Validation:**
- Client-side validation
- Server-side validation
- SQL injection prevention
- XSS prevention

**API Security:**
- CORS configuration
- Rate limiting (optional)
- HTTPS enforcement (production)
- Error message sanitization

## 4.5 AI Assistant Architecture

### 4.5.1 Query Processing Pipeline

```
1. User Input
   ↓
2. Text Normalization (lowercase)
   ↓
3. Pattern Matching (regex)
   ↓
4. Intent Recognition
   ↓
5. Data Fetching (if needed)
   ↓
6. Response Generation
   ↓
7. Response Formatting
   ↓
8. Return to User
```

### 4.5.2 Pattern Matching

**Regex Patterns:**
- Organ-specific SOP queries
- Blood inventory queries
- Eligibility queries
- Compatibility queries
- Statistics queries
- Hospital queries

**Example Patterns:**
```javascript
// Kidney SOP
/kidney.*(sop|procedure|guideline)/i

// Blood inventory
/\b(available|stock|inventory)\b.*\b(blood|units)\b/i

// Donor statistics
/\b(how many|total|count)\b.*\bdonor/i
```

### 4.5.3 Response Generation

**Components:**
- Template responses
- Real-time data injection
- Formatting (emojis, structure)
- Context awareness

**Response Types:**
- Informational (SOPs, eligibility)
- Data-driven (statistics, inventory)
- Procedural (how-to guides)
- Conversational (greetings, thanks)

## 4.6 Data Flow Architecture

### 4.6.1 Blood Donation Flow

```
Donor → Frontend Form
  ↓
Frontend Validation
  ↓
API Request (POST /api/blood-donations)
  ↓
JWT Verification
  ↓
Server Validation
  ↓
Calculate Expiry Date
  ↓
Insert Donation Record
  ↓
Update Inventory
  ↓
Return Success Response
  ↓
Update Frontend UI
```

### 4.6.2 Request Fulfillment Flow

```
User → Submit Request
  ↓
Store in blood_requests table
  ↓
Admin Views Requests
  ↓
Admin Fulfills Request
  ↓
Update Request Status
  ↓
Update Inventory (decrease)
  ↓
Notify User (future enhancement)
```

### 4.6.3 AI Query Flow

```
User → Type Query
  ↓
Send to /api/chat
  ↓
Parse Query
  ↓
Match Pattern
  ↓
Fetch Real-time Data
  ↓
Generate Response
  ↓
Return Formatted Reply
  ↓
Display to User
```

---
