# AI MIDI Generator

AI-powered rhythm and melody generator with drum machine and piano roll interface.

## Setup

Install dependencies:

```bash
npm install
```

Get a free Google Gemini API key at https://aistudio.google.com/app/apikey and add it to `.env`:

```
GEMINI_API_KEY=your-api-key-here
```

Run the application:

```bash
npm run dev:all
```

Access at http://localhost:5173

## Features

- 16-step drum sequencer with 5 drum sounds
- Piano roll with multiple octaves
- AI-powered generation
- Tempo control (60-180 BPM)
- Play, pause, stop, clear, and random pattern generation
- Export to txt (for opening in the site later) and export to MIDI (for opening in a DAW)

## Security

Never commit your `.env` file.
