# HealthCare Clinic

MediCare is a healthcare demo site with a small Node.js backend for storing appointment requests locally.

Quick start

Run the full app with Node.js 18 or newer:

```powershell
npm start

# then open http://localhost:3000
```

Appointments are saved to `data/appointments.json`. The API also exposes:

- `GET /api/health` to check that the service is running.
- `POST /api/appointments` to create a request.
- `GET /api/appointments` to inspect locally saved requests.

The backend validates required fields, rejects past dates, and prevents two active appointments for the same doctor, date, and time. Successful bookings return a unique request ID and timestamp.

Deploy to GitHub

1. Create a new GitHub repository and push this folder.
```bash
git init
git add .
git commit -m "Initial healthcare demo site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
2. Enable GitHub Pages: Repository Settings → Pages → Branch `main` → `/ (root)` → Save.
3. CI/CD is already configured in `.github/workflows/ci.yml` and `.github/workflows/deploy-pages.yml`.
   - `ci.yml` runs on every push and pull request and validates the app using a smoke test.
   - `deploy-pages.yml` publishes the static site to GitHub Pages after a successful push to `main`.

Notes

- This is a local educational demo, not a production medical records system.
- Do not use it with real patient data until authentication, encryption, access control, validation, and a compliant database are added.
