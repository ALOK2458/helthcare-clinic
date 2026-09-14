# Software Requirements Specification (SRS)

## 1. Introduction
This Software Requirements Specification (SRS) defines the MEdicare Smart Health Assistance project, a lightweight clinic appointment management system with integrated ML-style prediction and scheduling support. The current implementation is a web application that allows patients to request appointments, validates those requests on the server, stores them locally, and returns no-show risk, risk score, and recommendation outputs to support clinic operations.

## 2. Product Overview
MEdicare is a browser-based healthcare appointment system backed by a Node.js server. The system provides a simple booking form, REST API endpoints for appointment management, and heuristic recommendation logic for appointment risk analysis and scheduling assistance. The application is designed as a demo and educational project rather than a production medical record system.

## 3. System Purpose
The system shall:
- allow patients or clinic users to request medical appointments through a web interface,
- validate appointment input before storing data,
- prevent duplicate bookings for the same doctor, date, and time,
- persist valid appointments to a local JSON data store,
- analyze appointment risk using lightweight predictive models,
- recommend suitable time slots and doctors,
- expose health and monitoring endpoints for availability checks.

## 4. Actors
### 4.1 Patient
A patient uses the front-end form to submit appointment details and receives booking confirmation and ML-based insights.

### 4.2 Clinic Staff / Receptionist
Clinic staff review appointment records, identify scheduling issues, and use recommendation outputs to plan the day.

### 4.3 Developer / Maintainer
A developer maintains the application code, runs smoke tests, deploys the site, and monitors system availability.

### 4.4 External Monitoring System
A monitoring tool or developer can call the health endpoint to verify that the backend service is running.

## 5. Functional Requirements
### FR1: Appointment Request Submission
The system shall accept appointment requests from the web interface and transmit them to the backend API using JSON.

### FR2: Input Validation
The server shall validate that required fields are present and correctly formatted for the following inputs:
- name
- phone
- doctor
- date
- time
- consultationType

The system shall reject malformed dates and invalid times.

### FR3: Past Date Protection
The system shall reject appointment dates that are earlier than the current date.

### FR4: Conflict Detection
The system shall compare each new appointment request against stored appointments and prevent overlapping bookings for the same doctor, date, and time.

### FR5: Data Persistence
The system shall store valid appointment requests in the local `data/appointments.json` file.

### FR6: Response Handling
The system shall return clear JSON responses indicating success, validation errors, conflicts, or system errors.

### FR7: Appointment Retrieval
The system shall provide an API endpoint to retrieve all stored appointment records.

### FR8: Health Monitoring
The system shall provide a health endpoint that reports whether the backend service is operational.

### FR9: No-Show Probability Analysis
The system shall calculate a no-show probability for an appointment request using a lightweight heuristic model.

### FR10: Risk Scoring
The system shall calculate a risk score based on consultation type, appointment time, and current scheduling load.

### FR11: Slot Recommendations
The system shall generate ranked suggestions for available appointment slots based on predicted risk and current availability.

### FR12: Doctor Recommendations
The system shall recommend suitable doctors for a consultation type and scheduled date based on load and specialization heuristics.

## 6. Non-Functional Requirements
### NFR1: Performance
The application shall respond to booking and analysis requests within a reasonable timeframe for local demo usage.

### NFR2: Usability
The user interface shall be simple, readable, and suitable for first-time users without training.

### NFR3: Reliability
The system shall fail gracefully when invalid JSON or incomplete data is submitted, returning descriptive error messages instead of crashing.

### NFR4: Maintainability
The project shall separate front-end logic, server logic, and ML-model logic for easier maintenance and testing.

### NFR5: Security and Privacy
Because this project uses local JSON storage and demo data, it shall not be used with real patient data unless robust authentication, encryption, audit controls, and controlled access are added.

## 7. Data Requirements
The system stores appointment requests with the following fields:
- id
- name
- phone
- doctor
- date
- time
- consultationType
- reason
- status
- createdAt

### 7.1 Data Store
The project currently uses a local file-based persistence model through `data/appointments.json`.

### 7.2 ML Inputs
The recommendation and prediction logic uses appointment attributes such as consultation type, date, time, doctor assignment, and current appointment load.

## 8. System Interface Requirements
### 8.1 User Interface
The web interface shall allow users to:
- enter appointment details,
- submit booking requests,
- receive confirmation responses,
- view predicted no-show risk, risk score, and recommendation output.

### 8.2 API Interfaces
The backend shall expose the following endpoints:
- `GET /api/health`
- `POST /api/appointments`
- `GET /api/appointments`
- `POST /api/ml/predict`
- `POST /api/ml/recommend-slots`
- `POST /api/ml/recommend-doctors`
- `GET /api/ml/analyze/:appointmentId`

## 9. Data Flow and Processing Overview
The system flow is as follows:
1. A user fills in the appointment form in the browser.
2. The front-end sends a JSON payload to the backend `/api/appointments` endpoint.
3. The server validates the request and checks for conflicts.
4. If valid, the appointment is stored in `data/appointments.json`.
5. The server computes no-show probability and risk score using the ML model classes.
6. The response is returned to the client, where the UI renders confirmation and prediction results.
7. Staff or monitoring systems can later call the appointment retrieval and analysis endpoints.

## 10. Business Rules
- An appointment request must include all required fields.
- Appointment dates must not be in the past.
- Duplicate doctor/date/time combinations are not allowed.
- Risk and recommendation outputs are heuristic and intended for demonstration purposes.
- All stored appointments are retained in the local JSON file until manually cleared or replaced.

## 11. Acceptance Criteria
### AC1: Valid Booking
When a valid appointment request is submitted, the system returns `201` and a success message with the generated appointment ID.

### AC2: Invalid Input Handling
When required fields are missing or malformed, the system returns `400` and a descriptive error response.

### AC3: Scheduling Conflict Handling
When a duplicate doctor/date/time booking is submitted, the system returns `409` and prevents creation of the conflicting appointment.

### AC4: Prediction Output
When a prediction request is sent, the system returns no-show probability, risk score, confidence, and interpretation results.

### AC5: Recommendation Output
When slot or doctor recommendation requests are made, the system returns ranked suggestions for the requested consultation.

## 12. Assumptions and Constraints
- The system operates as a local demo or educational deployment.
- The current data layer is file-based rather than database-backed.
- The ML logic is heuristic and simplified; it is not a certified clinical decision system.
- Deployment targets include GitHub Pages for the frontend and Node.js for the backend service.

## 13. Summary
The MEdicare Smart Health Assistance project provides a complete basic workflow for appointment booking, validation, storage, and lightweight risk analysis. The current implementation is suitable for demonstration, testing, and further extension toward a more secure and scalable healthcare scheduling platform.
