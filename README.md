# AI MIDI Generator

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
ai-midi-generator/
├── frontend/          # Vite frontend application
│   ├── index.html
│   └── package.json
├── backend/           # Express backend server
│   ├── local.js       # Local development server
│   ├── api/           # Vercel serverless functions
│   ├── lib/           # Shared AI logic
│   └── package.json
└── .env              # API keys (not committed)
```

## Features

- 16-step drum sequencer with 5 drum sounds
- Piano roll with multiple octaves
- AI-powered generation
- Tempo control (60-180 BPM)
- Play, pause, stop, clear, and random pattern generation
- Export to txt (for opening in the site later) and export to MIDI (for opening in a DAW)

## Security

Never commit your `.env` file.
