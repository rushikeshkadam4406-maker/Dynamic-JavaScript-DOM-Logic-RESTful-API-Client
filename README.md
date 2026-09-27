# Dynamic Product Explorer

A responsive e-commerce product explorer built for a JavaScript REST API internship/project task.

## Features

- REST API integration using `fetch()` and `async/await`
- Fake Store API product data
- Dynamic DOM rendering
- Real-time product search
- Category filtering
- Price and name sorting
- Shopping cart state using `localStorage`
- Loading skeleton states
- User-friendly API error handling
- Modular JavaScript architecture
- Responsive design for mobile, tablet and desktop

## Project Structure

```text
dynamic-api-app/
├── index.html
├── style.css
├── README.md
└── js/
    ├── app.js
    ├── api.js
    └── storage.js
```

## API

This project uses:

https://fakestoreapi.com/products

## Run Locally

Because ES modules are used, open the project through a local web server.

### Option 1 — VS Code Live Server

Install the Live Server extension and open `index.html` with Live Server.

### Option 2 — Python

From the project folder:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## GitHub Upload

```bash
git init
git add .
git commit -m "Build dynamic REST API product explorer"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Expected Proof

The repository demonstrates:

- `app.js` for application and DOM logic
- `api.js` for REST API requests
- `storage.js` for localStorage
- Search, category tabs and sorting
- Cart persistence
- Loading and error states
