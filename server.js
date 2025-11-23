import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Check if API key is configured
if (!process.env.GEMINI_API_KEY) {
    console.error('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
    console.error('Please create a .env file with your API key');
    console.error('Get your free API key at: https://aistudio.google.com/app/apikey');
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Generate endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const { input, currentOctave, notes } = req.body;

        if (!input) {
            return res.status(400).json({ error: 'Input text is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate both drum and piano patterns in parallel
        const [drumResponse, pianoResponse] = await Promise.all([
            // Drum pattern classification
            model.generateContent(
                `Given this drum beat description: "${input}", classify it into one of these categories: techno, house, trap, breakbeat, or minimal. Respond with ONLY the category name in lowercase, nothing else.`
            ),
            // Piano melody generation
            model.generateContent(
                `Given this music description: "${input}", generate a simple complementary melody pattern for a 16-step sequencer. 
                        
The available notes in octave ${currentOctave} are: ${notes.map(n => n + currentOctave).join(', ')}.

Create a melodic pattern that fits the mood. Return ONLY a JSON object in this exact format with no markdown:
{
  "notes": [
    {"note": "C${currentOctave}", "steps": [0, 4, 8, 12]},
    {"note": "E${currentOctave}", "steps": [2, 6, 10, 14]},
    {"note": "G${currentOctave}", "steps": [1, 5, 9, 13]}
  ]
}

Where:
- Each note object has a "note" (e.g., "C${currentOctave}") and "steps" (array of step positions 0-15)
- Include 2-4 different notes maximum for simplicity
- Steps should be sparse (not every step filled)
- Make it musical and fitting for ${input}

Return ONLY the JSON, no other text.`
            )
        ]);

        // Extract responses
        const drumPattern = drumResponse.response.text().trim().toLowerCase();
        const pianoPattern = pianoResponse.response.text().trim();

        res.json({
            drumPattern,
            pianoPattern
        });

    } catch (error) {
        console.error('Error generating patterns:', error);
        res.status(500).json({ 
            error: 'Failed to generate patterns',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
