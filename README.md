# CureWell - Hospital Management System (HMS)

CureWell is a modern, responsive, and secure Hospital Management System built with a Spring Boot backend and a React (Vite) frontend.

## Key Modules

1. **Admin Portal**: Manage system configuration, doctors list, register new users, and monitor billing, reports, and blood bank modules.
2. **Doctor Portal**: Access electronic medical records (EMR), write prescriptions, track patient history, view schedule queue, and set consultation details.
3. **Patient Portal**: Track appointments, view real-time token status, active medicine logs with checklist reminder tracking, download lab reports, inspect past visit timeline, configure profile/insurance details, and interact with the Tamil/English bilingual AI chatbot.
4. **Blood Bank Module**: Track blood stock, manage emergency requests, and log blood donor profiles.

---

## Technology Stack

### Backend
- **Core**: Spring Boot 3.2.4, Java 17+
- **Database**: MySQL, Flyway migrations
- **Security**: JWT Authentication

### Frontend
- **Core**: React 18 (Vite build)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Forms**: React Hook Form

---

## Getting Started

### Backend Setup
1. Configure database credentials in `hms-backend/src/main/resources/application.yml` or set environment variables `DB_USERNAME`, `DB_PASSWORD`.
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd hms-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
