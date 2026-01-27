# Lil Beat Generator


![Vite](https://img.shields.io/badge/Vite-5.0.0-blueviolet?logo=vite)
![Express](https://img.shields.io/badge/Express.js-4.21.2-lightgrey?logo=express)
![Google Gemini API](https://img.shields.io/badge/Google%20Gemini%20API-%40google%2Fgenerative--ai-yellow?logo=google)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-F7DF1E?logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-%3E%3D5-E34F26?logo=html5)

AI-powered rhythm and melody generator with drum machine and piano roll interface.

## Setup

Install all dependencies:

```bash
npm run install:all
```

Get a free Google Gemini API key at https://aistudio.google.com/app/apikey and add it to `.env` in the root directory:

```
GEMINI_API_KEY=your-api-key-here
```

Run the application:

```bash
npm run dev:all
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3001)

## Project Structure


```
ai-midi-creator/
├── api/             # Vercel serverless functions (API endpoints)
│   ├── generate.js  # Main API handler for pattern generation
│   └── lib/         # Shared API logic
│       └── ...
├── backend/         # Express backend server (local/dev)
│   ├── local.js     # Entry point for backend server
│   ├── lib/         # Shared backend logic
│   │   └── ...
│   └── ...
├── frontend/        # Vite frontend app
│   ├── index.html   # Main content file
│   ├── vite.config.js # Vite config
│   └── ...
├── package.json     # Root scripts and shared dependencies
├── README.md
└── ...
```

## Features

- 32-step sequencer
- AI-powered generation
- Tempo control
- Play, pause, stop, clear
- Export to txt (for opening in the site later) and export to MIDI (for opening in a DAW)
