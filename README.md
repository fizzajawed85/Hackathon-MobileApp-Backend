# ⚙️ Medical App Backend (Node.js API)

A robust and secure RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the core infrastructure for the Medical Appointment & Records Management System.

## 🚀 Advanced Backend Features

### 🤖 MedBot AI (Real Artificial Intelligence)
- **Engine**: Powered by **Google Gemini 2.5 Flash** for high-speed, accurate medical guidance.
- **Expertise**: Provides specialist recommendations based on symptoms, analyzes drug information, and explains medical terms.
- **Safety**: Includes built-in system instructions for professional disclaimers and empathetic responses.
- **Endpoint**: `POST /api/ai/chat` for real-time interactive health assistance.

### 🔔 Smart Notification System
- **Real-time Alerts**: Automatically generates notifications for appointment bookings, cancellations, and medical record updates.
- **Management**: User endpoints to fetch all notifications, mark individual alerts as read, or clear all notifications.
- **Endpoints**: `GET /api/notifications`, `PATCH /api/notifications/:id`.

### 📊 Dashboard & Health Analytics
- **Aggregation**: Unified endpoint to fetch user profile, the nearest upcoming appointment, and health vital snapshots.
- **Vitals Integration**: Pre-calculates and serves data for **Heart Rate**, **Blood Pressure**, **Daily Steps**, and **Sleep Quality** trends.
- **Medication Tracking**: Serves current medication schedules and dosages.
- **Endpoint**: `GET /api/dashboard`.

### 📅 Medical Management API
- **Appointments API**:
  - `GET /api/medical/appointments`: Fetch user appointment history with **persistent storage**.
  - `POST /api/medical/appointments`: Book new appointments with specialist validation.
  - `DELETE /api/medical/appointments/:id`: Cancel upcoming visits and trigger notifications.
- **Medical Records API**:
  - `GET /api/medical/records`: Retrieve lab reports and prescriptions.
  - `POST /api/medical/records`: Support for records with image/PDF attachments (Advanced Base64 storage).
  - `DELETE /api/medical/records/:id`: Remove outdated records.

### 👤 Profile Enrichment
- **Extended User Model**: Supports `phoneNumber`, `location`, `about`, and `profileImage`.
- **Dynamic Updates**: Full support for updating personal information and profile photos via `PATCH /api/user/profile`.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Generative AI (Gemini)
- **Auth**: Passport.js & JWT
- **Email**: SendGrid/Nodemailer (OTP Delivery)

## 📦 Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=5000
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```

---
Built for the **Healthcare Innovation Hackathon**. 🚀
