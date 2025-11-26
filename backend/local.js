import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePatterns } from './lib/generatePatterns.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check if API key is configured
if (!process.env.GEMINI_API_KEY) {
    console.error('WARNING: GEMINI_API_KEY not found in environment variables');
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
        const { input, currentOctave, notes, isCreative } = req.body;

        console.log('API received request with isCreative:', isCreative);
        console.log('Full request body:', JSON.stringify(req.body, null, 2));

        if (!input) {
            return res.status(400).json({ error: 'Input text is required' });
        }

        const { drumPattern, pianoPattern } = await generatePatterns(
            input,
            currentOctave,
            notes,
            process.env.GEMINI_API_KEY,
            isCreative
        );

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
