# ⚙️ Medical App Backend (Full API Documentation)

A production-ready healthcare management API built on the **MERN (MongoDB, Express, React Native, Node)** stack. This backend serves as the secure backbone for the Medical Appointment & Records Management System, handling everything from AI-driven consultations to complex medical data persistence.

## 🚀 Repository Purpose
This backend exists to provide a secure, scalable, and intelligent infrastructure for healthcare management. It bridges the gap between raw medical data and a premium mobile experience through advanced AI and robust security protocols.

---

## 🛠️ Core Technology Stack
- **Node.js & Express**: High-performance runtime and framework for the RESTful API.
- **MongoDB & Mongoose**: NoSQL database for flexible medical record storage and user data modeling.
- **Google Gemini 2.5 Flash**: Real-time AI engine for the MedBot assistant.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication for mobile-backend communication.
- **Bcrypt.js**: Industry-standard hashing for secure password storage.
- **Nodemailer/SendGrid**: Automated email system for OTP (One-Time Password) delivery.

---

## 🔑 Advanced Security & Authentication
- **JWT Authentication System**:
  - Secure login/registration producing cross-platform compatible tokens.
  - Custom middleware for protected route access.
  - Stateless architecture allowing for seamless app reloads.
- **3-Phase Password Recovery**:
  - **Phase 1 (Forgot)**: Email-based validation with unique OTP generation.
  - **Phase 2 (Verify)**: Server-side OTP validation with expiration logic.
  - **Phase 3 (Reset)**: Secure password update with Bcrypt hashing.
- **CORS Management**: Configured for secure cross-origin requests from both mobile and web clients.

---

## 🤖 MedBot AI (Medical Assistant)
- **Real Artificial Intelligence**: Powered by **Google Gemini 2.5 Flash API**.
- **Dual-Mode Intelligence**:
  - **AI Base Mode**: Provides expert medical guidance, symptom analysis, and drug information.
  - **Personal Mode**: Interacts with the user's data to check appointments, history, and medical records.
- **System Intelligence**:
  - Empathy-first communication profile.
  - Specialist suggestion engine (analyzes symptoms and suggests specific doctor types).
  - Medical terminology explanation and drug information processing.
- **Compliance**: Automatic injection of professional medical disclaimers in every AI response.

---

## 📅 Medical Management Systems
- **Intelligent Appointment Booking**:
  - Dynamic specialist selection and availability checking.
  - Real-time booking with **Automatic Notification Triggers**.
  - **Persistent History Log**: Every appointment remains in the DB with status tracking (Pending, Confirmed, Cancelled).
- **Medical Records Vault**:
  - Secure storage for Lab Reports, Prescriptions, and Scans.
  - **Attachment Support**: Advanced Base64 handling for mobile image/PDF uploads.
  - **Metadata Management**: Categorization by doctors, dates, and record types.
- **History & Records Persistence**:
  - Guaranteed data retention—records never disappear; they are archived for future reference.

---

## 👤 User Profile & Health Statistics
- **Enriched Health Profile**:
  - **Extended Data**: Stores PhoneNumber, Location, and Bio ("About").
  - **Dynamic Patient ID**: Unique ID generation for medical identification.
  - **Health Vitals Dashboard**: Aggregates real-time stats for **Steps** and **Sleep Quality**.
  - **💓 Demo Vitals Tracking**: Includes tech demos for **Heart Rate** and **Blood Pressure (BP)** monitoring.
- **Image Management**: Support for profile photo updates with secure storage integration.

---

## 🔔 Notification & Dashboard Engine
- **Dashboard Aggregator**: 
  - A single, high-performance endpoint to serve user profile, vital signs, medication schedules, and the nearest upcoming appointment.
- **Notification System**:
  - Context-aware alerts for all account activities.
  - Management API: Fetch, Mark as Read (single or all).

---

## 📁 Directory Architecture
```
backend/
├── controllers/      # Business logic (AI, Auth, Appointments, etc.)
├── models/           # Mongoose schemas (User, Record, Notification, Doctor)
├── routes/           # API Endpoints
├── middleware/       # JWT and Security checks
├── utils/            # Helper functions (Emailing, OTP generation)
└── server.js         # Entry point & DB configuration
```

---

## 📦 Setup & Installation

1. **Clone & Install**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration** (`.env`):
   Create a `.env` file in the root backend directory:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secure_random_key
   GEMINI_API_KEY=your_google_ai_key

   # 📧 Email & OTP Configuration (Nodemailer)
   EMAIL_HOST=smtp.gmail.com   # e.g., smtp.gmail.com
   EMAIL_PORT=587              # 587 for TLS, 465 for SSL
   EMAIL_USER=your_email       # SMTP login email
   EMAIL_PASS=your_password    # SMTP app-specific password
   ```

3. **Execution**:
   ```bash
   npm run dev
   ```

---
Built for the **Healthcare Innovation Hackathon**. 🚀
