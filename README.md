# ⚙️ Medical App Backend (Node.js API)

A robust and secure RESTful API built with **Node.js**, **Express**, and **MongoDB**. This backend serves as the core infrastructure for the Medical Appointment & Records Management System.

## 🚀 Managed Features

### 🔐 Multi-Role Authentication
- **JWT & OTP**: Secure login and registration with JSON Web Tokens and One-Time Password verification for password resets.
- **Secure Hashing**: User passwords are encrypted using `bcryptjs`.
- **Session Management**: Persistent sessions and logout handling.

### 📅 Medical Management API
- **Appointments API**:
  - `GET /api/medical/appointments`: Fetch user appointment history.
  - `POST /api/medical/appointments`: Book new appointments with specialist validation.
  - `DELETE /api/medical/appointments/:id`: Cancel upcoming visits.
- **Medical Records API**:
  - `GET /api/medical/records`: Retrieve lab reports and prescriptions.
  - `POST /api/medical/records`: Support for records with image/PDF attachments (Base64 storage for hackathon prototype).
  - `DELETE /api/medical/records/:id`: Remove outdated records.

### 👤 Profile Enrichment
- **Extended User Model**: Supports `phoneNumber`, `location`, `about`, and `profileImage`.
- **Dynamic Updates**: Full support for updating personal information and profile photos.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
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
   PORT=5000
   ```

3. **Start the Server**:
   ```bash
   npm run dev
   ```

---
Built for the **Healthcare Innovation Hackathon**. 🚀
