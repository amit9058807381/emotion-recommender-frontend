# Emotion-Based Recommendation System — Frontend

React frontend for an AI-powered emotion-aware recommendation system. Captures a user's webcam image, sends it to the backend for emotion detection, and displays personalized movie/music/video recommendations.

## Tech Stack

- **React** (Vite)
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Lucide React** (icons)

## Features

- Register / Login (email & password)
- Google OAuth login
- Webcam-based emotion capture and detection
- Emotion-based recommendations (movies, music, videos) with content-type switching
- Engagement tracking (clicking a recommendation improves future ranking)
- Responsive, mobile-friendly, dark-themed UI

## Prerequisites

- Node.js and npm
- The backend service running (see [backend repo](https://github.com/amit9058807381/emotion-recommender-backend))

## Running Locally

```bash
git clone https://github.com/amit9058807381/emotion-recommender-frontend.git
cd emotion-recommender-frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` by default.

> Make sure the backend is running on `http://localhost:8081` (or update the base URL in `src/services/api.js`).

## Pages

| Route | Description |
|---|---|
| `/` | Landing/home page |
| `/register` | User registration |
| `/login` | User login (email/password or Google) |
| `/oauth-success` | Handles the redirect after Google login |
| `/dashboard` | Webcam capture, emotion detection, recommendations |

## Project Structure

- `src/pages/` — Page components (Home, Login, Register, Dashboard, etc.)
- `src/services/` — Axios instance / API calls
- `src/App.jsx` — Route definitions

## Author

Amit — College Project (Statement of Purpose: Emotion-Based Personalized Recommendation System)