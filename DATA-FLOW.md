# Data Flow Documentation

This project uses a simple local data flow for the clinic appointment system.

## 1. User Input
The user interacts with the frontend pages such as `index.html` and `diet.html`.
The appointment form collects information like:
- name
- phone
- doctor
- date
- time
- consultation type
- reason

## 2. Frontend Submission
The browser-side logic in `js/main.js` sends this information to the backend API as JSON.

## 3. Backend Processing
The Node.js server in `server.js` handles the request.
It performs the following steps:
- validates the request body
- checks required fields
- rejects invalid dates or times
- prevents scheduling conflicts for the same doctor at the same time
- runs ML-style prediction logic from `js/ml-models.js`

## 4. Data Storage
If the appointment is valid, the backend saves it into the local JSON file:
- `data/appointments.json`

This is the project’s current persistence layer.

## 5. Response to Frontend
After saving, the backend sends a JSON response back to the browser containing:
- the saved appointment details
- ML prediction results such as:
  - no-show probability
  - risk score
  - confidence

## 6. Data Retrieval
The app can also fetch stored appointments through the API endpoint:
- `GET /api/appointments`

This allows the frontend or clinic staff to inspect the saved appointment dataset.

## 7. ML Data Flow
The ML model logic in `js/ml-models.js` uses appointment information to generate:
- no-show predictions
- appointment risk scores
- recommended slots
- recommended doctors

These recommendations are calculated using the current appointment data and the heuristic model rules defined in the file.

## 8. End-to-End Flow Summary
Browser UI → `js/main.js` → `server.js` → `js/ml-models.js` → `data/appointments.json` → JSON response back to UI

## 9. Important Note
This project currently uses a local JSON file for storage, so the data flow is simple and demo-friendly. It is not yet a production-grade medical data system.
