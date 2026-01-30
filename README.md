# Blood & Organ Donation Management System

A comprehensive MERN stack application for managing blood and organ donations with SQLite database, featuring admin panel, hospital management, and donor tracking.

## 🩸 Features

### User Management
- **User Registration & Authentication** - JWT-based secure login system
- **Role-based Access Control** - Admin, Donor, and Hospital roles
- **Profile Management** - Complete user profiles with blood type, contact info
- **User Status Management** - Active/Inactive user control

### Blood Donation System
- **Donation Recording** - Track blood donations with expiry dates
- **Blood Inventory Management** - Real-time blood stock tracking
- **Blood Type Compatibility** - Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- **Expiry Tracking** - Automatic expiry date calculation (35 days)
- **Donation History** - Complete donation records for donors

### Request Management
- **Blood Requests** - Submit requests with urgency levels
- **Request Tracking** - Monitor request status (pending, fulfilled)
- **Urgency Levels** - Low, Medium, High, Critical priority system
- **Hospital Integration** - Link requests to specific hospitals

### Hospital Management
- **Hospital Registration** - Add hospitals with license verification
- **Hospital Profiles** - Complete hospital information management
- **Doctor Management** - Register doctors with specializations
- **Hospital-wise Inventory** - Track blood stock per hospital

### Admin Panel
- **Dashboard Overview** - Key statistics and metrics
- **User Management** - Add, edit, delete, activate/deactivate users
- **Hospital Management** - CRUD operations for hospitals
- **Doctor Management** - Manage doctor profiles and assignments
- **Donation Oversight** - Monitor all blood donations
- **Request Management** - View and manage all blood requests
- **Inventory Control** - Real-time blood inventory monitoring

### Advanced Features
- **Search & Filter** - Advanced search capabilities
- **Real-time Updates** - Live inventory and request updates
- **Responsive Design** - Mobile-friendly interface
- **Data Validation** - Comprehensive form validation
- **Error Handling** - Proper error messages and handling
- **Security** - Password hashing, JWT tokens, input sanitization

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 with comprehensive schema
- **Authentication**: JWT, bcryptjs
- **Styling**: Modern CSS with gradients and animations

## 📊 Database Schema

### Users Table
```sql
id, name, email, password, phone, blood_type, address, age, gender, role, status, created_at
```

### Hospitals Table
```sql
id, name, address, phone, email, license_number, status, created_at
```

### Doctors Table
```sql
id, name, email, phone, specialization, hospital_id, license_number, status, created_at
```

### Blood Donations Table
```sql
id, donor_id, hospital_id, blood_type, quantity, donation_date, expiry_date, status, notes, created_at
```

### Blood Requests Table
```sql
id, requester_id, hospital_id, blood_type, quantity, urgency, reason, status, requested_date, fulfilled_date, created_at
```

### Blood Inventory Table
```sql
id, blood_type, quantity, expiry_date, hospital_id, status, created_at
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
```bash
cd blood-organ-donation
npm install
```

2. **Start the server:**
```bash
npm run dev
```
Server runs on http://localhost:5000

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
Client runs on http://localhost:3000

## 🔐 Default Admin Credentials

- **Email**: admin@bloodbank.com
- **Password**: admin123

## 📋 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### User Management (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user status/role

### Hospital Management
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Add new hospital (Admin)
- `PUT /api/hospitals/:id` - Update hospital (Admin)
- `DELETE /api/hospitals/:id` - Delete hospital (Admin)

### Doctor Management
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor (Admin)

### Blood Donations
- `POST /api/blood-donations` - Record blood donation
- `GET /api/blood-donations` - Get donations (user-specific or all for admin)

### Blood Requests
- `POST /api/blood-requests` - Submit blood request
- `GET /api/blood-requests` - Get requests (user-specific or all for admin)

### Blood Inventory
- `GET /api/blood-inventory` - Get current blood inventory

## 🎯 Usage Guide

### For Donors
1. **Register** as a new donor with complete profile
2. **Login** with credentials
3. **Dashboard** - View overview and statistics
4. **Donate Blood** - Record new blood donations
5. **Request Blood** - Submit blood requests when needed
6. **View History** - Track donation and request history

### For Admins
1. **Login** with admin credentials
2. **Admin Panel** - Access comprehensive management tools
3. **Manage Users** - Add, edit, activate/deactivate users
4. **Manage Hospitals** - CRUD operations for hospitals
5. **Manage Doctors** - Register and manage doctor profiles
6. **Monitor Inventory** - Track blood stock levels
7. **Oversee Donations** - View all donation activities
8. **Handle Requests** - Manage blood requests

## 🔧 Development Features

- **Nodemon** for auto-restart during development
- **React Hot Reload** for instant UI updates
- **SQLite Database** created automatically on first run
- **Comprehensive Error Handling** throughout the application
- **Input Validation** on both frontend and backend
- **Responsive Design** for all screen sizes

## 🛡 Security Features

- **Password Hashing** using bcryptjs
- **JWT Authentication** with expiration
- **Role-based Authorization** middleware
- **Input Sanitization** and validation
- **CORS Protection** configured
- **SQL Injection Prevention** using parameterized queries

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 UI/UX Features

- **Modern Design** with gradients and animations
- **Intuitive Navigation** with clear menu structure
- **Status Indicators** with color-coded badges
- **Loading States** for better user experience
- **Error Messages** with clear feedback
- **Success Notifications** for completed actions

This blood donation management system provides a complete solution for blood banks, hospitals, and donors to efficiently manage blood donation activities while maintaining safety standards and regulatory compliance.
