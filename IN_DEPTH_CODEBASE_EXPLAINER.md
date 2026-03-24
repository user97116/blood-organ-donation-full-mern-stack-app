# In-Depth Codebase Explainer

This file explains the project structure, how folders connect, and what each core file does in practical terms.

## 1) High-Level Architecture

This is a full-stack Blood and Organ Donation Management System:

- **Frontend:** React (`client/`)
- **Backend:** Node.js + Express (`server.js` + `routes/`)
- **Database:** SQLite (`donation.db`, schema in `config/database.js`)
- **Auth:** JWT with role-based access (`middleware/auth.js`)

User roles:
- **Donor/User** -> registers, donates, requests, asks doctor assistance
- **Doctor** -> views hospital-linked data, updates own availability, handles assigned requests
- **Admin** -> full control over users, hospitals, doctors, requests, assignments

---

## 2) Root-Level Files (Detailed)

### `server.js`
Main backend runtime file. It does all of this:
- initializes express app and middleware (`cors`, `express.json`)
- initializes database and attaches DB handle to each request (`req.db`)
- loads all route modules
- also contains several direct API handlers:
  - doctor CRUD/update endpoints
  - blood donation/request APIs
  - dashboard stats (auth + public stats)
  - admin-only mutation endpoints

In short: this file is the backend orchestrator and routing hub.

### `package.json` / `package-lock.json`
- `package.json`: scripts + dependency definitions
- `package-lock.json`: deterministic dependency tree (same versions on every install)

### `donation.db`
SQLite file storing all app data:
- users
- hospitals
- doctors
- blood/organ donations and requests
- doctor assistance requests

### `seedDatabase.js` / `addMoreData.js`
Utility scripts to quickly populate DB with fake/demo records.

---

## 3) Frontend Folder (`client/`) Deep View

## `client/src/App.js`
Application shell + route switcher.

Core responsibilities:
- reads auth token/user from localStorage
- applies axios auth interceptor (adds bearer token)
- renders navbar links based on role
- route protection:
  - `/admin` only for admin
  - `/dashboard` only for logged-in users
- home page data fetch from public APIs

### `client/src/Auth.js`
Auth UI and flows:
- login
- donor register
- admin register
- doctor register

Important detail:
- after register, login is performed and token/user are stored in localStorage.

### `client/src/Dashboard.js`
Main operational UI for donor + doctor.

Contains:
- overview/stat cards
- donor actions (blood/organ donation/request)
- history tables
- doctor tabs:
  - blood/organ data tables
  - assigned doctor requests
  - my availability updater (status + availability + schedule)

Data strategy:
- single `fetchDashboardData()` loads required API responses in batches.

### `client/src/AdminPanel.js`
Admin command center.

Major sections:
- users management
- hospital management
- doctor management
- blood/organ donation and request monitoring
- doctor-assistance request assignment to doctors
- doctor availability and schedule updates

Pattern used:
- fetch all needed data once
- render tabs
- update via API and refresh dataset

### `client/src/App.css`
Global styles for layout, tabs, cards, tables, forms, status badges.

---

## 4) Backend Configuration and Security

### `config/database.js`
Defines schema and init flow.

It:
- drops existing tables (for fresh predictable demo state)
- recreates tables in dependency-safe order
- includes latest fields like:
  - `doctors.availability_status`
  - `doctors.schedule`
  - `doctor_requests` table

This file is the source of truth for DB structure.

### `middleware/auth.js`
JWT auth middleware:
- parses `Authorization: Bearer <token>`
- verifies token
- sets `req.user`

Also includes admin role guard.

---

## 5) API Route Layer (`routes/`)

Routes are feature-separated to keep backend maintainable.

### `routes/auth.js`
- login
- donor/admin/doctor registration
- doctor registration includes doctors-table linking/backfill logic

### `routes/hospitals.js`
Hospital CRUD:
- public read
- admin write (create/update/delete)

### `routes/organ_donations.js`
Organ donation create/list/update/delete.
Role-aware list responses.

### `routes/organ_requests.js`
Organ request create/list/update.
Role-aware list and hospital joins.

### `routes/doctor_requests.js`
New assignment workflow:
- user submits request
- admin lists all + assigns doctor
- doctor sees assigned requests

### `routes/medical_evaluation.js`
Handles medical evaluation payload storage/retrieval.

### `routes/organ_inventory.js`
Organ inventory access endpoints.

### `routes/sop_acceptance.js`
SOP acceptance tracking APIs.

### `routes/chat.js`
Internal assistant endpoint with DB-backed stats and rule-based responses.

---

## 6) Data Seeding (`data/`)

### `data/dummyData.js`
Large demo dataset:
- hospitals across regions
- donors/admins
- doctors
- blood donations/requests
- organ donations/requests
- doctor assistance requests

Why it matters:
- app is demo-ready immediately after startup
- all dashboards show realistic populated tables

---

## 7) End-to-End Data Flow Examples

## A) Doctor Availability Update
1. Doctor opens Dashboard -> My Availability  
2. Frontend calls `GET /api/doctors/me`  
3. Doctor changes status/availability/schedule  
4. Frontend calls `PUT /api/doctors/me/availability`  
5. Backend updates `doctors` table and returns success

## B) User -> Admin -> Doctor Request Assignment
1. User submits doctor assistance request (`POST /api/doctor-requests`)  
2. Admin sees requests in Admin Panel (`GET /api/doctor-requests`)  
3. Admin assigns doctor (`PUT /api/doctor-requests/:id/assign`)  
4. Doctor sees assigned request in dashboard (`GET /api/doctor-requests`)

## C) Home Page Public Data
1. Home page fetches blood inventory and public stats  
2. Calls public APIs (no auth):  
   - `GET /api/blood-inventory`  
   - `GET /api/dashboard/public-stats`

---

## 8) Current Folder Responsibility Summary

- `client/` -> UI and user actions
- `routes/` -> feature-wise APIs
- `middleware/` -> auth and role checks
- `config/` -> DB schema and setup
- `data/` -> dummy/demo seed data
- root files -> app bootstrap, scripts, docs, DB file

This separation makes the project easier to debug, demo, and scale.

