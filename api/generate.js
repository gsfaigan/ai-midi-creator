import { generatePatterns } from '../backend/lib/generatePatterns.js';

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
        const { input, currentOctave, notes, isCreative } = req.body;

        console.log('🎛️ API received request with isCreative:', isCreative);
        console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));

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

        const { drumPattern, pianoPattern } = await generatePatterns(
            input,
            currentOctave,
            notes,
            process.env.GEMINI_API_KEY,
            isCreative
        );

        res.status(200).json({
            drumPattern,
            pianoPattern
        });
    } catch (error) {
        console.error('Error generating patterns:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Failed to generate patterns',
            message: error.message,
            details: error.toString()
        });
    }
}
