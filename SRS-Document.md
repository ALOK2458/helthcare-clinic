# Software Requirements Specification (SRS)

## 1. Introduction
This Software Requirements Specification describes the Healthcare Clinic Appointment Management System, a lightweight web application for scheduling clinic appointments and analyzing appointment risk using simple predictive models.

## 2. Product Overview
The product is a front-end website backed by a Node.js server that stores appointment information locally and exposes REST endpoints for appointment management and ML-style recommendations.

## 3. User Classes
### 3.1 Patient
A patient interacts with the booking form, enters personal and appointment details, and receives booking confirmation.

### 3.2 Clinic Staff
A clinic staff member can review appointment data, identify schedule conflicts, and use recommendation outputs to support operational decisions.

### 3.3 Developer / Maintainer
A developer manages the source code, performs testing, and supports deployment to GitHub Pages or a Node.js server.

## 4. System Features
### 4.1 Appointment Booking
The system shall allow users to submit appointment requests using the appointment form.

### 4.2 Data Validation
The system shall check required inputs, valid date format, valid time format, and non-past dates.

### 4.3 Conflict Management
The system shall search the stored appointment list for existing requests that conflict with the same doctor, date, and time.

### 4.4 ML Analysis
The system shall calculate:
- No-show probability
- Risk score
- Confidence score

### 4.5 Recommendations
The system shall produce:
- Best slot suggestions
- Recommended doctors for a consultation type

### 4.6 Health Monitoring
The API shall expose a health endpoint to validate uptime.

## 5. Functional Requirements
1. The system shall accept appointment requests through a web interface.
2. The server shall validate all required fields before saving data.
3. The server shall reject malformed dates or times.
4. The server shall reject dates already in the past.
5. The server shall prevent duplicate doctor/date/time slots.
6. The system shall persist valid requests in a local JSON file.
7. The system shall return a JSON success response including a generated appointment ID and timestamp.
8. The system shall provide prediction endpoint responses for no-show risk and appointment priority.
9. The system shall offer recommendations for available slots and doctors.
10. The system shall support retrieval of all stored appointments through an API endpoint.

## 6. Non-Functional Requirements
### 6.1 Performance
The app shall respond to appointment submission and prediction requests in a reasonable time for a local demo system.

### 6.2 Usability
The interface shall be simple enough for users to book appointments without prior training.

### 6.3 Reliability
The application shall handle invalid requests without crashing and return clear HTTP status codes and JSON responses.

### 6.4 Maintainability
The app shall separate front-end, server, and ML model logic for easier updates and testing.

### 6.5 Security and Privacy
The current implementation is a demo and should not be exposed to real patient data until secure authentication, data protection, and auditing controls are added.

## 7. Data Requirements
The system stores the following appointment fields:
- name
- phone
- doctor
- date
- time
- consultationType
- reason
- status
- createdAt
- id

## 8. External Interfaces
### 8.1 User Interface
The website provides forms and information panels for booking and receiving recommendations.

### 8.2 API Interfaces
The backend exposes endpoints for health checks, appointment submission, appointment listing, and ML analysis/recommendation features.

## 9. Assumptions
- The system operates in a local development or demo environment.
- Data persistence is file-based rather than database-backed.
- Prediction models are heuristic and intentionally lightweight.

## 10. Acceptance Test Scenarios
- Scenario A: Valid booking request returns 201 with appointment details.
- Scenario B: Missing required field returns 400 and descriptive error.
- Scenario C: Duplicate doctor/date/time returns 409 conflict response.
- Scenario D: Prediction endpoint returns no-show probability and risk score.
- Scenario E: Recommendation endpoint returns ranked slot or doctor suggestions.

## 11. Summary
The SRS defines a demo healthcare appointment system capable of booking, validating, storing, and analyzing appointments while emphasizing educational value and simple deployment.
