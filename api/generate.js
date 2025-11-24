import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { input, currentOctave, notes } = req.body;

        if (!input) {
            return res.status(400).json({ error: 'Input text is required' });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({
                error: 'API key not configured',
                message: 'Please configure GEMINI_API_KEY in Vercel environment variables'
            });
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

        res.status(200).json({
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
}
