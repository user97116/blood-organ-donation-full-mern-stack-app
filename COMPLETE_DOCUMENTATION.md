# Blood & Organ Donation Management System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Features](#features)
6. [Setup & Installation](#setup--installation)
7. [User Roles & Access](#user-roles--access)
8. [Data Summary](#data-summary)
9. [File Structure](#file-structure)

---

## 🎯 Project Overview

A comprehensive MERN stack application for managing blood and organ donations with SQLite database. The system features admin panel, hospital management, donor tracking, and organ donation with SOP compliance.

**Primary Focus:** Organ Donation with comprehensive Standard Operating Procedures (SOP) compliance.

**Key Organs Supported:**
- Heart Donation (Deceased donor only - brain death required)
- Kidney Donation (Living and deceased donor programs)
- Eye/Cornea Donation (Deceased donor - all ages, within 6-8 hours)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Auto-restart server
- **React Hot Reload** - Instant UI updates

---

## 📊 Database Schema

### 1. Users Table
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
)
```

### 2. Hospitals Table
```sql
CREATE TABLE hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  license_number TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 3. Doctors Table
```sql
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialization TEXT,
  hospital_id INTEGER,
  license_number TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 4. Blood Donations Table
```sql
CREATE TABLE blood_donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  hospital_id INTEGER,
  blood_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  donation_date DATE NOT NULL,
  expiry_date DATE,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 5. Blood Requests Table
```sql
CREATE TABLE blood_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER,
  hospital_id INTEGER,
  blood_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  urgency TEXT DEFAULT 'medium',
  reason TEXT,
  status TEXT DEFAULT 'pending',
  requested_date DATE NOT NULL,
  fulfilled_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 6. Blood Inventory Table
```sql
CREATE TABLE blood_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blood_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  expiry_date DATE,
  hospital_id INTEGER,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 7. Organ Donations Table
```sql
CREATE TABLE organ_donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  hospital_id INTEGER,
  organ_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  donation_date DATE,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 8. Organ Requests Table
```sql
CREATE TABLE organ_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER,
  hospital_id INTEGER,
  organ_type TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium',
  reason TEXT,
  status TEXT DEFAULT 'pending',
  requested_date DATE NOT NULL,
  fulfilled_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
)
```

### 9. Medical Evaluations Table
```sql
CREATE TABLE medical_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  organ_type TEXT NOT NULL,
  evaluation_date DATE NOT NULL,
  blood_pressure TEXT,
  diabetes_status TEXT,
  diseases TEXT,
  allergies TEXT,
  medications TEXT,
  previous_surgeries TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  evaluation_result TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id)
)
```

### 10. SOP Acceptances Table
```sql
CREATE TABLE sop_acceptances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  organ_type TEXT NOT NULL,
  accepted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  FOREIGN KEY (donor_id) REFERENCES users(id)
)
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register new user | No |
| POST | `/api/login` | User login | No |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | No |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | No |
| PUT | `/api/users/:id` | Update user status/role | No |
| DELETE | `/api/users/:id` | Delete user | No |
| GET | `/api/donors` | Get public donors list | No |

### Hospital Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/hospitals` | Get all hospitals | No |
| POST | `/api/hospitals` | Add new hospital | Yes (Admin) |
| PUT | `/api/hospitals/:id` | Update hospital | Yes (Admin) |
| DELETE | `/api/hospitals/:id` | Delete hospital | Yes (Admin) |

### Doctor Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/doctors` | Get all doctors | No |
| POST | `/api/doctors` | Add new doctor | No |
| DELETE | `/api/doctors/:id` | Delete doctor | No |

### Blood Donations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blood-donations` | Get donations | No |
| POST | `/api/blood-donations` | Record blood donation | No |
| PUT | `/api/blood-donations/:id` | Update donation status | No |
| DELETE | `/api/blood-donations/:id` | Delete donation | No |

### Blood Requests
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blood-requests` | Get requests | No |
| POST | `/api/blood-requests` | Submit blood request | No |
| PUT | `/api/blood-requests/:id` | Update request status | No |
| DELETE | `/api/blood-requests/:id` | Delete request | No |

### Blood Inventory
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blood-inventory` | Get current inventory | No |

### Organ Donations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/organ-donations` | Get organ donations | Yes |
| POST | `/api/organ-donations` | Register organ donation | Yes |
| PUT | `/api/organ-donations/:id` | Update donation status | Yes |
| DELETE | `/api/organ-donations/:id` | Delete donation | Yes |

### Organ Requests
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/organ-requests` | Get organ requests | Yes |
| POST | `/api/organ-requests` | Submit organ request | Yes |
| PUT | `/api/organ-requests/:id` | Update request status | Yes |
| DELETE | `/api/organ-requests/:id` | Delete request | Yes |

### Organ Inventory
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/organ-inventory` | Get organ inventory | Yes |

### Medical Evaluation
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/medical-evaluation/:donorId` | Get evaluation | Yes |
| POST | `/api/medical-evaluation` | Submit evaluation | Yes |

### SOP Acceptance
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/sop-acceptance` | Accept SOP | Yes |
| GET | `/api/sop-acceptance/:donorId/:organType` | Check acceptance | Yes |

### Chat Assistant
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chat` | Send chat message | Yes |

---

## ✨ Features

### 🩸 Blood Donation System
- **Donation Recording** - Track blood donations with expiry dates (35 days)
- **Blood Inventory Management** - Real-time blood stock tracking
- **Blood Type Compatibility** - Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Expiry Tracking** - Automatic expiry date calculation
- **Donation History** - Complete donation records for donors

### 🫀 Organ Donation System
- **Focused Organ Donation** - Heart, Kidney, Eye/Cornea
- **SOP Documentation** - Complete guidelines for each organ
- **Mandatory SOP Acceptance** - Donors must read and accept organ-specific SOP
- **Eligibility Criteria** - Age, health, and medical requirements
- **Risk Disclosure** - Complete information about surgical risks
- **Post-Donation Care** - Lifelong follow-up protocols

### 🏥 Medical Information Collection
- **Disease History** - Comprehensive medical condition tracking
- **Allergy Information** - Drug and food allergy documentation
- **Blood Pressure Monitoring** - Current BP status
- **Diabetes Screening** - Type 1, Type 2, and pre-diabetic status
- **Current Medications** - Complete medication list
- **Previous Surgeries** - Surgical history tracking
- **Emergency Contacts** - Designated emergency contact persons

### 📝 Request Management
- **Blood Requests** - Submit requests with urgency levels
- **Organ Requests** - Submit organ transplant requests
- **Request Tracking** - Monitor request status (pending, fulfilled)
- **Urgency Levels** - Low, Medium, High, Critical priority system
- **Hospital Integration** - Link requests to specific hospitals

### 🏥 Hospital Management
- **Hospital Registration** - Add hospitals with license verification
- **Hospital Profiles** - Complete hospital information management
- **Doctor Management** - Register doctors with specializations
- **Hospital-wise Inventory** - Track blood stock per hospital

### 👨‍💼 Admin Panel
- **Dashboard Overview** - Key statistics and metrics
- **User Management** - Add, edit, delete, activate/deactivate users
- **Hospital Management** - CRUD operations for hospitals
- **Doctor Management** - Manage doctor profiles and assignments
- **Donation Oversight** - Monitor all blood and organ donations
- **Request Management** - View and manage all requests
- **Inventory Control** - Real-time blood inventory monitoring

### 🔐 Security Features
- **Password Hashing** - Using bcryptjs
- **JWT Authentication** - With expiration
- **Role-based Authorization** - Admin, Donor roles
- **Input Sanitization** - Validation on frontend and backend
- **CORS Protection** - Configured
- **SQL Injection Prevention** - Parameterized queries

### 🎨 UI/UX Features
- **Modern Design** - Gradients and animations
- **Intuitive Navigation** - Clear menu structure
- **Status Indicators** - Color-coded badges
- **Loading States** - Better user experience
- **Error Messages** - Clear feedback
- **Success Notifications** - Completed actions
- **Responsive Design** - Mobile-friendly interface

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to project directory:**
```bash
cd blood-organ-donation
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the React app:**
```bash
npm start
```
Client runs on `http://localhost:3000`

### Database Initialization
- Database file: `donation.db`
- Automatically created on first run
- Dummy data inserted automatically

---

## 👥 User Roles & Access

### Admin
- **Email:** admin@bloodbank.com
- **Password:** admin123
- **Access:**
  - Full admin panel access
  - User management
  - Hospital management
  - Doctor management
  - View all donations and requests
  - Inventory management

### Donor
- **Registration:** Self-registration available
- **Default Password:** password123 (for dummy users)
- **Access:**
  - Personal dashboard
  - Donate blood
  - Request blood
  - Register for organ donation
  - Submit medical evaluation
  - View donation history

---

## 📊 Data Summary

### Current Database Statistics

**Hospitals:** 30
- Yavatmal District (4 hospitals)
- Hingoli District (3 hospitals)
- Nagpur Division (3 hospitals)
- Akola District (2 hospitals)
- Washim District (2 hospitals)
- Amravati District (2 hospitals)
- Buldhana District (2 hospitals)
- Wardha District (2 hospitals)
- Chandrapur, Gondia, Bhandara, Gadchiroli, and more

**Users:** 57
- 4 Admins
- 53 Donors
- Blood types: All types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Organ donors: 40+ registered

**Doctors:** 39
- Specializations: Cardiology, Nephrology, Hematology, Emergency Medicine, Orthopedics, Gynecology, Internal Medicine, Dermatology, Anesthesiology, Pediatrics, and more

**Blood Donations:** 48+
- Active donations tracked
- Expiry dates monitored
- Hospital-wise distribution

**Blood Requests:** 37+
- Pending and fulfilled requests
- Urgency levels tracked
- Hospital-wise requests

**Blood Inventory:** 40+ items
- All blood types available
- Hospital-wise inventory
- Expiry tracking

**Organ Donations:** 33+
- Heart, Kidney, Liver, Cornea donations
- Pending and completed status
- Hospital-wise tracking

**Organ Requests:** 29+
- Critical to low urgency
- Pending and fulfilled status
- Hospital-wise requests

---

## 📁 File Structure

```
blood-organ-donation/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # Main styles
│   │   ├── Auth.js                  # Login/Register components
│   │   ├── Dashboard.js             # User dashboard
│   │   ├── AdminPanel.js            # Admin panel
│   │   ├── OrganDonation.js         # Organ donation form
│   │   ├── OrganRequest.js          # Organ request form
│   │   ├── OrganInventory.js        # Organ inventory view
│   │   ├── MedicalHistory.js        # Medical evaluation form
│   │   ├── SOPModal.js              # SOP acceptance modal
│   │   ├── ChatAssistant.js         # Chat assistant
│   │   └── index.js                 # Entry point
│   └── package.json
│
├── routes/                          # API routes
│   ├── auth.js                      # Authentication routes
│   ├── hospitals.js                 # Hospital management
│   ├── organ_donations.js           # Organ donation routes
│   ├── organ_requests.js            # Organ request routes
│   ├── organ_inventory.js           # Organ inventory routes
│   ├── medical_evaluation.js        # Medical evaluation routes
│   ├── sop_acceptance.js            # SOP acceptance routes
│   └── chat.js                      # Chat assistant routes
│
├── config/
│   └── database.js                  # Database initialization
│
├── middleware/
│   └── auth.js                      # JWT authentication middleware
│
├── data/
│   └── dummyData.js                 # Dummy data insertion
│
├── SOP_DOCUMENTS/                   # Standard Operating Procedures
│   ├── SOP_HEART_DONATION.md
│   ├── SOP_KIDNEY_DONATION.md
│   └── SOP_EYE_DONATION.md
│
├── server.js                        # Express server
├── addMoreData.js                   # Script to add more data
├── donation.db                      # SQLite database
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables
```
PORT=5000
```

### Database Configuration
- **Type:** SQLite3
- **File:** donation.db
- **Location:** Project root
- **Auto-create:** Yes

### CORS Configuration
```javascript
app.use(cors());
```

### JWT Configuration
```javascript
jwt.sign({ userId, role }, 'your-secret-key', { expiresIn: '24h' })
```

---

## 🎯 Usage Guide

### For Donors

1. **Register** - Create account with complete profile
2. **Login** - Access dashboard
3. **Donate Blood** - Record new blood donations
4. **Request Blood** - Submit blood requests when needed
5. **Register for Organ Donation** - Complete SOP acceptance and medical evaluation
6. **View History** - Track donation and request history

### For Admins

1. **Login** - Use admin credentials
2. **Admin Panel** - Access comprehensive management tools
3. **Manage Users** - Add, edit, activate/deactivate users
4. **Manage Hospitals** - CRUD operations for hospitals
5. **Manage Doctors** - Register and manage doctor profiles
6. **Monitor Inventory** - Track blood stock levels
7. **Oversee Donations** - View all donation activities
8. **Handle Requests** - Manage blood and organ requests

---

## 🐛 Troubleshooting

### Common Issues

**1. Server not starting**
- Check if port 5000 is available
- Verify Node.js installation
- Check for missing dependencies

**2. Database errors**
- Delete `donation.db` and restart server
- Check SQLite3 installation
- Verify database schema

**3. Frontend not loading**
- Check if React app is running on port 3000
- Verify API_URL in frontend code
- Check browser console for errors

**4. Authentication issues**
- Clear localStorage
- Check JWT token expiration
- Verify credentials

**5. CORS errors**
- Verify CORS is enabled in server.js
- Check API_URL matches backend URL

---

## 📝 Notes

### Blood Donation
- Blood expiry: 35 days from donation date
- Automatic expiry calculation
- Real-time inventory tracking

### Organ Donation
- SOP acceptance mandatory
- Medical evaluation required
- Age and health criteria enforced
- Post-donation follow-up protocols

### Security
- Passwords hashed with bcryptjs
- JWT tokens expire in 24 hours
- Role-based access control
- Input validation on all forms

---

## 🚀 Future Enhancements

- Email notifications
- SMS alerts for critical requests
- Advanced search and filtering
- Report generation (PDF)
- Mobile app
- Real-time chat support
- Blood donation camps management
- Donor rewards system
- Integration with national organ donation registry

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Check database integrity
4. Verify API endpoints

---

## 📄 License

This project is for educational and healthcare management purposes.

---

**Last Updated:** March 9, 2026
**Version:** 1.0.0
**Database Records:** 30 Hospitals | 57 Users | 39 Doctors | 48+ Donations | 37+ Requests
