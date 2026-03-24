# Project Files in One Simple Line Each

## Root Files

- `server.js` - Backend ka main file hai, yahin se saare APIs chalte hain.
- `package.json` - Project ki dependencies aur scripts ka list hai.
- `package-lock.json` - Installed packages ke exact versions lock karta hai.
- `donation.db` - SQLite database file jisme actual data save hota hai.
- `README.md` - Project setup aur basic usage guide.
- `seedDatabase.js` - Database me initial sample data dalne ka helper script.
- `addMoreData.js` - Existing DB me extra demo data add karne ka script.

## Frontend (`client/`)

- `client/src/App.js` - Routing, navbar, auth flow, aur home page logic handle karta hai.
- `client/src/Auth.js` - Login/Register screens (donor, doctor, admin) ka code.
- `client/src/Dashboard.js` - User/Doctor dashboard tabs aur main actions ka code.
- `client/src/AdminPanel.js` - Admin ke management screens (users, doctors, requests, etc.).
- `client/src/App.css` - App ka main styling file.

## Backend Config & Security

- `config/database.js` - DB tables create/reset karta hai aur DB initialization handle karta hai.
- `middleware/auth.js` - JWT token verify karta hai aur role-based access control lagata hai.

## API Routes (`routes/`)

- `routes/auth.js` - Register/login aur auth related APIs.
- `routes/hospitals.js` - Hospital create/update/delete/list APIs.
- `routes/organ_donations.js` - Organ donation records ke APIs.
- `routes/organ_requests.js` - Organ request submit/list/update APIs.
- `routes/organ_inventory.js` - Organ inventory related endpoints.
- `routes/medical_evaluation.js` - Medical evaluation form APIs.
- `routes/sop_acceptance.js` - SOP consent acceptance APIs.
- `routes/chat.js` - Internal AI assistant/chat API.
- `routes/doctor_requests.js` - User request -> admin assign -> doctor handling flow APIs.

## Data / Dummy Seed (`data/`)

- `data/dummyData.js` - Demo hospitals, users, doctors, donations, requests ka bulk seed data.

## Docs (Project Explainers)

- `*_GUIDE.md` files - Feature/demo/use-case guides.
- `*_REPORT.md` files - Project report/documentation files.
- `SHORTS_CODE_FOLDER_EXPLAINER.md` - Ye current short human-readable explainer file.

