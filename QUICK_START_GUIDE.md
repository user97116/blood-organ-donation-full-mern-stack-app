# Quick Start Guide - Organ Donation System

## 🚀 Getting Started

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd blood-organ-donation
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd blood-organ-donation/client
npm start
```

### 2. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 👤 User Roles

### Admin Account
- **Email:** admin@bloodbank.com
- **Password:** admin123
- **Access:** Full system control, review donations, manage users

### Regular User
- Register new account
- **Access:** Donate organs, view history, submit requests

---

## 🫀 Organ Donation Process

### Step 1: Register/Login
1. Go to http://localhost:3000
2. Click "Login" or "Register"
3. Fill in your details

### Step 2: Navigate to Organ Donation
1. After login, you'll see the Dashboard
2. Click on **"Donate Organ"** tab

### Step 3: Fill the Registration Form

#### Section 1: Organ Selection
- Choose organ: **Kidney**, **Liver**, or **Heart**
- Select hospital from dropdown

#### Section 2: Medical Information (Required)
- **Diseases:** List any chronic conditions
- **Allergies:** Drug/food allergies or "None"
- **Blood Pressure:** e.g., "120/80 mmHg"
- **Diabetes:** Select status from dropdown
- **Medications:** Current medications (optional)
- **Surgeries:** Previous surgeries (optional)

#### Section 3: Emergency Contact (Required)
- **Name:** Full name of emergency contact
- **Phone:** 10-digit phone number

#### Section 4: Additional Notes (Optional)
- Any extra information

#### Section 5: SOP Consent (Required)
1. Click **"Read SOP (Required)"** button
2. Review the key points
3. Check the consent checkbox
4. Submit the form

### Step 4: View Your Registration
1. Click **"My History"** tab
2. See your organ donation under "My Organ Donations"
3. Status will show as "pending"

---

## 👨‍💼 Admin Review Process

### Step 1: Login as Admin
- Use admin credentials above

### Step 2: Access Admin Panel
- Click **"Admin Panel"** in navigation

### Step 3: Review Organ Donations
1. Navigate to organ donations section
2. View all registrations
3. Check medical information
4. Update status:
   - **Pending** → Initial submission
   - **Eligible** → Passed initial screening
   - **Completed** → Donation completed
   - **Rejected** → Not suitable

---

## 📄 Forms and Documents

### Available Documents:

1. **`ORGAN_DONATION_SOP.md`**
   - Complete Standard Operating Procedures
   - Read before registration
   - Covers all aspects of donation

2. **`ORGAN_DONATION_CONSENT_FORM.html`**
   - Open in browser
   - Print for official records
   - Bring to hospital appointment

3. **`MEDICAL_EVALUATION_FORM.md`**
   - For medical staff use
   - Complete during evaluation
   - Comprehensive health assessment

---

## 🎯 Key Features

### 3 Primary Organs
- ✅ **Kidney** - Living donation
- ✅ **Liver** - Partial donation
- ✅ **Heart** - Deceased donation only

### Medical Information Collected
- ✅ Disease history
- ✅ Allergies
- ✅ Blood pressure
- ✅ Diabetes status
- ✅ Current medications
- ✅ Previous surgeries
- ✅ Emergency contact

### SOP Compliance
- ✅ Mandatory SOP reading
- ✅ Digital consent tracking
- ✅ Risk disclosure
- ✅ Eligibility criteria
- ✅ Post-donation care info

---

## 🔍 Testing the System

### Test Scenario 1: New Donor Registration
```
1. Register new user
2. Login
3. Go to "Donate Organ"
4. Fill form:
   - Organ: Kidney
   - Hospital: Select any
   - Diseases: "None"
   - Allergies: "None"
   - BP: "120/80"
   - Diabetes: "No"
   - Emergency: "John Doe, 9876543210"
5. Read SOP
6. Check consent box
7. Submit
8. Check "My History"
```

### Test Scenario 2: Admin Review
```
1. Login as admin
2. Go to Admin Panel
3. View organ donations
4. Update status to "Eligible"
5. Verify status change
```

---

## ⚠️ Important Notes

### Before Submitting Registration:
- ✅ Read the complete SOP
- ✅ Understand all risks
- ✅ Provide accurate medical information
- ✅ Ensure emergency contact is reachable
- ✅ Accept consent checkbox

### Medical Information:
- Be honest about health conditions
- List ALL medications
- Include ALL allergies
- Provide accurate blood pressure
- Mention all previous surgeries

### SOP Acceptance:
- **Mandatory** - Cannot submit without accepting
- Confirms understanding of:
  - Eligibility criteria
  - Surgical risks
  - Recovery period
  - Post-donation care
  - Donor rights

---

## 🆘 Troubleshooting

### Form Won't Submit
- ✅ Check all required fields are filled
- ✅ Ensure SOP consent checkbox is checked
- ✅ Verify hospital is selected
- ✅ Check organ type is selected

### Can't See SOP
- ✅ Click "Read SOP (Required)" button
- ✅ Scroll down in the expanded section
- ✅ Click link to view full document

### Status Not Updating
- ✅ Refresh the page
- ✅ Check if you're logged in as admin
- ✅ Verify you have admin permissions

---

## 📞 System Information

### Database
- **Type:** SQLite
- **Location:** `donation.db`
- **Auto-created:** On first server start

### API Endpoints
- **POST** `/api/organ-donations` - Submit registration
- **GET** `/api/organ-donations` - View donations
- **PUT** `/api/organ-donations/:id` - Update status
- **DELETE** `/api/organ-donations/:id` - Delete donation

### Required Fields
- Organ type ✅
- Hospital ✅
- Medical diseases ✅
- Allergies ✅
- Blood pressure ✅
- Diabetes status ✅
- Emergency contact name ✅
- Emergency contact phone ✅
- SOP consent ✅

---

## 📚 Additional Resources

### Documentation Files:
1. `README.md` - Project overview
2. `ORGAN_DONATION_SOP.md` - Complete procedures
3. `MEDICAL_EVALUATION_FORM.md` - Evaluation template
4. `ORGAN_DONATION_CONSENT_FORM.html` - Printable consent
5. `IMPLEMENTATION_SUMMARY.md` - Technical details
6. `QUICK_START_GUIDE.md` - This file

### For Developers:
- `config/database.js` - Database schema
- `routes/organ_donations.js` - API routes
- `client/src/Dashboard.js` - Frontend form
- `client/src/App.css` - Styling

---

## ✅ Checklist for First Use

### Setup:
- [ ] Install Node.js
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in client directory
- [ ] Start backend server
- [ ] Start frontend server

### Testing:
- [ ] Access http://localhost:3000
- [ ] Register new user account
- [ ] Login successfully
- [ ] Navigate to "Donate Organ"
- [ ] Fill complete form
- [ ] Read SOP
- [ ] Accept consent
- [ ] Submit registration
- [ ] View in history

### Admin Testing:
- [ ] Login as admin
- [ ] Access admin panel
- [ ] View organ donations
- [ ] Update donation status
- [ ] Verify changes

---

## 🎉 You're Ready!

The organ donation system is now fully operational. Follow the steps above to:
- Register donors
- Collect medical information
- Track SOP compliance
- Manage donations
- Review and approve registrations

For detailed information, refer to the comprehensive documentation files listed above.

**Happy Donating! 🫀**
