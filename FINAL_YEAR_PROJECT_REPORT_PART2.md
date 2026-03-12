# BLOOD & ORGAN DONATION MANAGEMENT SYSTEM
## Final Year Project Report - Part 2

# CHAPTER 2 (Continued)
# PROPOSED SYSTEM ANALYSIS & DESIGN

## 2.5 Requirements Analysis

### 2.5.1 Functional Requirements

**FR1: User Management**
- FR1.1: System shall allow user registration with email and password
- FR1.2: System shall authenticate users using JWT tokens
- FR1.3: System shall support three user roles: Admin, Donor, Hospital
- FR1.4: System shall allow users to update their profiles
- FR1.5: System shall allow admins to activate/deactivate users
- FR1.6: System shall maintain user status (active/inactive)

**FR2: Blood Donation Management**
- FR2.1: System shall allow donors to record blood donations
- FR2.2: System shall track donation date, blood type, and quantity
- FR2.3: System shall automatically calculate expiry date (35 days)
- FR2.4: System shall maintain donation history for each donor
- FR2.5: System shall update inventory upon donation recording
- FR2.6: System shall support all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)

**FR3: Blood Inventory Management**
- FR3.1: System shall track real-time blood inventory
- FR3.2: System shall display inventory by blood type
- FR3.3: System shall show expiry dates for each unit
- FR3.4: System shall alert for expiring blood units
- FR3.5: System shall maintain hospital-wise inventory
- FR3.6: System shall prevent negative inventory

**FR4: Blood Request Management**
- FR4.1: System shall allow users to submit blood requests
- FR4.2: System shall capture urgency level (Low, Medium, High, Critical)
- FR4.3: System shall track request status (Pending, Fulfilled)
- FR4.4: System shall allow admins to fulfill requests
- FR4.5: System shall maintain request history

**FR5: Organ Donation Management**
- FR5.1: System shall allow organ donor registration
- FR5.2: System shall support Heart, Kidney, and Eye donations
- FR5.3: System shall collect comprehensive medical information
- FR5.4: System shall track disease history and allergies
- FR5.5: System shall record blood pressure and diabetes status
- FR5.6: System shall maintain current medications list
- FR5.7: System shall track previous surgeries
- FR5.8: System shall capture emergency contact information
- FR5.9: System shall track SOP acceptance status

**FR6: Hospital Management**
- FR6.1: System shall allow admin to register hospitals
- FR6.2: System shall maintain hospital profiles
- FR6.3: System shall verify hospital license numbers
- FR6.4: System shall allow admin to update hospital information
- FR6.5: System shall allow admin to delete hospitals
- FR6.6: System shall track hospital status

**FR7: Doctor Management**
- FR7.1: System shall allow admin to register doctors
- FR7.2: System shall link doctors to hospitals
- FR7.3: System shall track doctor specializations
- FR7.4: System shall verify doctor license numbers
- FR7.5: System shall maintain doctor contact information

**FR8: AI Assistant**
- FR8.1: System shall process natural language queries
- FR8.2: System shall provide organ-specific SOP information
- FR8.3: System shall display real-time inventory data
- FR8.4: System shall provide eligibility criteria
- FR8.5: System shall explain blood compatibility
- FR8.6: System shall provide donation procedure information
- FR8.7: System shall display donor statistics
- FR8.8: System shall list hospital information

**FR9: Admin Panel**
- FR9.1: System shall display dashboard with key statistics
- FR9.2: System shall allow CRUD operations on users
- FR9.3: System shall allow CRUD operations on hospitals
- FR9.4: System shall allow CRUD operations on doctors
- FR9.5: System shall display all donations
- FR9.6: System shall display all requests
- FR9.7: System shall provide search and filter capabilities

**FR10: Reporting**
- FR10.1: System shall generate donation reports
- FR10.2: System shall generate inventory reports
- FR10.3: System shall generate user statistics
- FR10.4: System shall display dashboard metrics

### 2.5.2 Non-Functional Requirements

**NFR1: Performance**
- NFR1.1: Page load time shall be less than 2 seconds
- NFR1.2: API response time shall be less than 500ms
- NFR1.3: System shall support 150+ concurrent users
- NFR1.4: Database queries shall execute in less than 100ms
- NFR1.5: System shall handle 1000+ transactions per day

**NFR2: Security**
- NFR2.1: Passwords shall be hashed using bcrypt
- NFR2.2: Authentication shall use JWT tokens
- NFR2.3: Tokens shall expire after 24 hours
- NFR2.4: System shall prevent SQL injection attacks
- NFR2.5: System shall validate all user inputs
- NFR2.6: System shall implement role-based access control
- NFR2.7: System shall use HTTPS for all communications

**NFR3: Usability**
- NFR3.1: Interface shall be intuitive and user-friendly
- NFR3.2: System shall provide clear error messages
- NFR3.3: System shall provide help and guidance
- NFR3.4: Training time shall be less than 3 hours
- NFR3.5: System shall follow accessibility standards

**NFR4: Reliability**
- NFR4.1: System uptime shall be 99%+
- NFR4.2: System shall handle errors gracefully
- NFR4.3: System shall provide data backup mechanisms
- NFR4.4: System shall recover from failures automatically
- NFR4.5: Data integrity shall be maintained

**NFR5: Scalability**
- NFR5.1: System shall support horizontal scaling
- NFR5.2: Database shall handle growing data volumes
- NFR5.3: System architecture shall be modular
- NFR5.4: System shall support cloud deployment

**NFR6: Maintainability**
- NFR6.1: Code shall be well-documented
- NFR6.2: System shall follow coding standards
- NFR6.3: System shall be modular and extensible
- NFR6.4: System shall support easy updates

**NFR7: Compatibility**
- NFR7.1: System shall work on Chrome, Firefox, Safari, Edge
- NFR7.2: System shall be responsive (desktop, tablet, mobile)
- NFR7.3: System shall support modern browsers (last 2 versions)

**NFR8: Availability**
- NFR8.1: System shall be available 24/7
- NFR8.2: Planned maintenance shall be during off-peak hours
- NFR8.3: System shall provide status notifications

## 2.6 System Design

### 2.6.1 Use Case Diagram

**Actors:**
1. Donor
2. Admin
3. Hospital
4. AI System

**Use Cases:**

**Donor Use Cases:**
- Register Account
- Login
- Update Profile
- Donate Blood
- Register as Organ Donor
- Submit Blood Request
- View Donation History
- Chat with AI Assistant

**Admin Use Cases:**
- Login
- Manage Users (Add, Edit, Delete, Activate/Deactivate)
- Manage Hospitals (Add, Edit, Delete)
- Manage Doctors (Add, Edit, Delete)
- View All Donations
- View All Requests
- Manage Inventory
- View Dashboard Statistics
- Generate Reports

**Hospital Use Cases:**
- Login
- View Inventory
- Submit Blood Requests
- View Request Status
- Update Hospital Profile

**AI System Use Cases:**
- Process Query
- Fetch Real-time Data
- Provide SOP Information
- Display Eligibility Criteria
- Show Blood Compatibility
- List Hospitals

### 2.6.2 Sequence Diagram

**Sequence Diagram 1: User Registration**
```
User -> Frontend: Enter registration details
Frontend -> Backend: POST /api/register
Backend -> Database: Check if email exists
Database -> Backend: Email not found
Backend -> Backend: Hash password
Backend -> Database: INSERT user record
Database -> Backend: User created
Backend -> Backend: Generate JWT token
Backend -> Frontend: Return token and user data
Frontend -> User: Registration successful
```

**Sequence Diagram 2: Blood Donation**
```
Donor -> Frontend: Fill donation form
Frontend -> Backend: POST /api/blood-donations
Backend -> Middleware: Verify JWT token
Middleware -> Backend: Token valid
Backend -> Database: INSERT donation record
Database -> Backend: Donation recorded
Backend -> Database: UPDATE blood_inventory
Database -> Backend: Inventory updated
Backend -> Frontend: Success response
Frontend -> Donor: Donation recorded successfully
```

**Sequence Diagram 3: AI Assistant Query**
```
User -> Frontend: Type query "kidney sop"
Frontend -> Backend: POST /api/chat
Backend -> Backend: Parse query with regex
Backend -> Database: Fetch real-time stats
Database -> Backend: Return statistics
Backend -> Backend: Generate response
Backend -> Frontend: Return formatted reply
Frontend -> User: Display SOP information
```

### 2.6.3 Activity Diagram

**Activity Diagram 1: Blood Donation Process**
```
Start
  ↓
User Logs In
  ↓
Navigate to Donate Blood
  ↓
Fill Donation Form
  ↓
Select Blood Type
  ↓
Enter Quantity
  ↓
Select Hospital
  ↓
Submit Form
  ↓
[Valid Data?]
  Yes → Record Donation
    ↓
    Update Inventory
    ↓
    Show Success Message
    ↓
    End
  No → Show Error
    ↓
    Return to Form
```

**Activity Diagram 2: Admin User Management**
```
Start
  ↓
Admin Logs In
  ↓
Navigate to Admin Panel
  ↓
Select User Management
  ↓
[Action?]
  Add User → Fill User Form → Submit → Save to DB → End
  Edit User → Select User → Update Form → Submit → Update DB → End
  Delete User → Select User → Confirm → Delete from DB → End
  Activate/Deactivate → Select User → Toggle Status → Update DB → End
```

### 2.6.4 Class Diagram

**Main Classes:**

```
User
- id: Integer
- name: String
- email: String
- password: String
- phone: String
- blood_type: String
- address: String
- age: Integer
- gender: String
- organ_donor: Boolean
- organs_to_donate: String
- role: String
- status: String
+ register()
+ login()
+ updateProfile()
+ getDonationHistory()

Hospital
- id: Integer
- name: String
- address: String
- phone: String
- email: String
- license_number: String
- status: String
+ create()
+ update()
+ delete()
+ getInventory()

BloodDonation
- id: Integer
- donor_id: Integer
- hospital_id: Integer
- blood_type: String
- quantity: Integer
- donation_date: Date
- expiry_date: Date
- status: String
+ record()
+ getHistory()
+ updateInventory()

BloodInventory
- id: Integer
- blood_type: String
- quantity: Integer
- expiry_date: Date
- hospital_id: Integer
+ getStock()
+ updateStock()
+ checkExpiry()

BloodRequest
- id: Integer
- requester_id: Integer
- hospital_id: Integer
- blood_type: String
- quantity: Integer
- urgency: String
- status: String
+ submit()
+ fulfill()
+ getStatus()

OrganDonation
- id: Integer
- donor_id: Integer
- organ_type: String
- medical_diseases: String
- allergies: String
- sop_accepted: Boolean
+ register()
+ updateMedicalInfo()
+ acceptSOP()

Doctor
- id: Integer
- name: String
- email: String
- phone: String
- specialization: String
- hospital_id: Integer
- license_number: String
+ create()
+ update()
+ delete()

AIAssistant
- query: String
- response: String
+ processQuery()
+ fetchData()
+ generateResponse()
```

### 2.6.5 ER Diagram

**Entities and Relationships:**

```
USERS (1) ----< (M) BLOOD_DONATIONS
USERS (1) ----< (M) BLOOD_REQUESTS
USERS (1) ----< (M) ORGAN_DONATIONS

HOSPITALS (1) ----< (M) BLOOD_DONATIONS
HOSPITALS (1) ----< (M) BLOOD_REQUESTS
HOSPITALS (1) ----< (M) BLOOD_INVENTORY
HOSPITALS (1) ----< (M) DOCTORS
HOSPITALS (1) ----< (M) ORGAN_DONATIONS
```

**Entity Attributes:**

**USERS**
- PK: id
- name, email, password, phone
- blood_type, address, age, gender
- organ_donor, organs_to_donate
- role, status, created_at

**HOSPITALS**
- PK: id
- name, address, phone, email
- license_number, status, created_at

**DOCTORS**
- PK: id
- FK: hospital_id
- name, email, phone
- specialization, license_number
- status, created_at

**BLOOD_DONATIONS**
- PK: id
- FK: donor_id, hospital_id
- blood_type, quantity
- donation_date, expiry_date
- status, notes, created_at

**BLOOD_REQUESTS**
- PK: id
- FK: requester_id, hospital_id
- blood_type, quantity, urgency
- reason, status
- requested_date, fulfilled_date, created_at

**BLOOD_INVENTORY**
- PK: id
- FK: hospital_id
- blood_type, quantity
- expiry_date, status, created_at

**ORGAN_DONATIONS**
- PK: id
- FK: donor_id, hospital_id
- organ_type, medical_diseases
- allergies, blood_pressure, diabetes
- current_medications, previous_surgeries
- emergency_contact_name, emergency_contact_phone
- sop_accepted, status, donation_date
- notes, created_at

### 2.6.6 Data Flow Diagram

**DFD Level 0 (Context Diagram):**
```
External Entities: Donor, Admin, Hospital

Donor → [Blood & Organ Donation System] → Donor
Admin → [Blood & Organ Donation System] → Admin
Hospital → [Blood & Organ Donation System] → Hospital

Data Flows:
- Donor: Registration, Donation Info, Requests → System
- System → Donor: Confirmation, History, Information
- Admin: User Management, Hospital Management → System
- System → Admin: Reports, Statistics
- Hospital: Requests, Updates → System
- System → Hospital: Inventory, Request Status
```

**DFD Level 1:**
```
Processes:
1.0 User Management
2.0 Blood Donation Management
3.0 Organ Donation Management
4.0 Inventory Management
5.0 Request Management
6.0 AI Assistant
7.0 Reporting

Data Stores:
D1: Users
D2: Hospitals
D3: Blood Donations
D4: Organ Donations
D5: Blood Inventory
D6: Blood Requests

Data Flows:
Donor → 1.0: Registration Data
1.0 → D1: Store User
Donor → 2.0: Donation Details
2.0 → D3: Store Donation
2.0 → 4.0: Update Inventory
4.0 → D5: Update Stock
Donor → 5.0: Blood Request
5.0 → D6: Store Request
Admin → 1.0: User Management
Admin → 7.0: Report Request
7.0 → Admin: Generated Reports
User → 6.0: Query
6.0 → D1, D2, D3, D5: Fetch Data
6.0 → User: Response
```

---
