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
- Piano roll with 12 notes per octave
- AI-powered generation using Google Gemini
- Tempo control (60-200 BPM)
- Multi-language support
- Play, pause, stop, clear, and random pattern generation

## Security

Never commit your `.env` file. If you accidentally commit your API key, revoke it immediately at the provider dashboard and remove it from git history using:

```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```
