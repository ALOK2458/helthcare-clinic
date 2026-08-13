# HealthCare Clinic — Demo Static Site

This is a minimal, static demo healthcare website suitable for GitHub Pages or simple static hosting.

Quick start

- Open `index.html` in your browser, or run a local static server:

```bash
# with Python 3
python -m http.server 8000

# then open http://localhost:8000
```

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

Notes

- This is a front-end demo: form submissions are handled locally and not stored.
- Customize `css/style.css` and `index.html` to match branding and content.
