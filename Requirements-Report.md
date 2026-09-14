# Requirements Report

## 1. Project Title
Healthcare Clinic Appointment Management System

## 2. Purpose
This project provides a healthcare clinic demo website that allows patients to request appointments, validates submitted information, checks for scheduling conflicts, and uses lightweight machine-learning-inspired logic to estimate no-show risk, appointment priority, and slot recommendations.

## 3. Scope
The system covers:
- Appointment request submission from the web interface
- Server-side validation of required appointment fields
- Conflict detection for existing doctor/date/time bookings
- ML-based appointment analysis for no-show probability and risk score
- Slot and doctor recommendations for scheduling assistance
- Local storage of appointment requests for demonstration purposes

The system does not provide full medical record management, authentication, role-based access control, or production-grade data security.

## 4. Stakeholders
- Patients: Book appointments and receive confirmation
- Clinic staff: Review requests and identify scheduling conflicts
- Developers: Maintain the front-end, back-end, and ML demo logic
- Repository maintainers: Publish and manage the project on GitHub

## 5. Functional Requirements
### FR1: Appointment Request Submission
The system shall allow a user to submit a booking request containing name, phone number, doctor, date, time, consultation type, and optional reason.

### FR2: Input Validation
The system shall reject incomplete or malformed appointment data and inform the user of the specific validation error.

### FR3: Past Date Prevention
The system shall prevent appointment requests for dates earlier than the current date.

### FR4: Scheduling Conflict Detection
The system shall detect duplicate bookings for the same doctor, date, and time and reject the second request.

### FR5: Appointment Persistence
The system shall save valid appointment requests locally in the JSON data store.

### FR6: ML Prediction Support
The system shall calculate a no-show probability, risk score, and confidence value for each appointment request.

### FR7: Recommendation Feature
The system shall recommend the best available slots and likely suitable doctors based on the provided consultation type, date, and current appointment schedule.

### FR8: Health Check Endpoint
The system shall expose a health endpoint that confirms the API is available.

## 6. Non-Functional Requirements
### NFR1: Accessibility
The interface should remain easy to use on standard desktop and mobile browsers.

### NFR2: Reliability
The application should gracefully handle invalid JSON, missing files, and unsupported routes.

### NFR3: Performance
The system should respond to typical appointment requests and prediction calls quickly for a demo environment.

### NFR4: Maintainability
The code should be organized into separate modules such as front-end scripts, ML models, and server logic.

### NFR5: Security Awareness
The current version is a demo and should not be used with real patient data until stronger security controls are added.

## 7. Assumptions and Constraints
- The system uses a local JSON file for persistence.
- The application runs on Node.js.
- The ML logic is a lightweight heuristic model rather than a trained production ML system.
- The project is intended for educational and demonstration use.

## 8. Acceptance Criteria
- A patient can submit an appointment request successfully with valid data.
- Invalid requests return appropriate error messages.
- Duplicate doctor/date/time bookings are blocked.
- The API returns ML-based analysis values in response to booking and prediction requests.
- The site loads successfully through the main entry page and web server.

## 9. Summary
The Requirements Report confirms that the MEdicare project is designed as a functional appointment booking and scheduling demo with predictive assistant capabilities. It supports the core booking workflow while clearly identifying the current limitations of the implementation.
