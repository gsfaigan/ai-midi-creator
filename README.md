# AI MIDI Generator - Rhythm Machine

An AI-powered rhythm and melody generator with a visual drum machine and piano roll interface.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Free API Key

**Get your FREE Google Gemini API key:**

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click "Create API key"
3. Copy your API key

### 3. Configure API Key

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your-api-key-here
```

### 4. Run the Application

Start both the frontend and backend servers:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend (Vite dev server)
npm run dev

# Terminal 2 - Backend API server
npm run server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Features

- 🥁 **16-step drum sequencer** with 5 drum sounds (kick, snare, hi-hat, open hat, clap)
- 🎹 **Piano roll** with 12 notes per octave
- 🤖 **AI-powered generation** using Google Gemini (FREE) to create drum patterns and melodies
- 🎚️ **Tempo control** (60-200 BPM)
- 🎨 **Visual gradient** on piano roll cells
- 🌍 **Multi-language support** (English/Spanish)
- ⏯️ **Play/Pause/Stop** controls
- 🔄 **Clear** and **Random** pattern generation

## Usage

1. Enter a description of the beat/melody you want (e.g., "energetic techno beat")
2. Click "Generate" to let AI create the pattern
3. Click on grid cells to manually edit the pattern
4. Use Play/Pause/Stop to control playback
5. Adjust tempo with the slider

## Architecture

- **Frontend**: Vanilla JavaScript with HTML5 Audio API
- **Backend**: Express.js server handling Google Gemini API calls
- **API**: Google Gemini 1.5 Flash (FREE tier - 15 req/min, 1500 req/day)

The backend server securely handles API authentication, keeping your API key safe from client-side exposure.

**Security / Prevent leaking API keys**

- **Never commit** your `.env` file containing `GEMINI_API_KEY` to git. This repository now includes a `.gitignore` entry for `.env`.
- If you have already committed your key, **rotate** or **revoke** it immediately from the provider dashboard.
- To stop tracking your local `.env` and commit the change locally, run:

```
git rm --cached .env
git add .gitignore
git commit -m "Stop tracking .env and ignore it"
```

- If the key was pushed to a remote and you need to purge it from history, follow these steps (be careful — these rewrite history):

	- Simple remove-from-history (affects only recent commits):

	```bash
	# remove the file from all commits
	git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all
	git push origin --force --all
	git push origin --force --tags
	```

	- Or use the BFG Repo-Cleaner (recommended for ease): https://rtyley.github.io/bfg-repo-cleaner/

- After purging, **rotate** the leaked key on the provider side — treat the old key as compromised.

If you'd like, I can: add a script to help remove `.env` from history, run the local git commands for you (commit only), or walk you through fully purging the key from the remote.
