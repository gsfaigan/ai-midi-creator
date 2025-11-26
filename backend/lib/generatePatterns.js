import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generatePatterns(input, currentOctave, notes, apiKey, isCreative = false) {
    console.log('generatePatterns called with isCreative:', isCreative);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create different instructions based on creative mode
    const melodyInstructions = isCreative
        ? `Given this music description: "${input}", generate a COMPLEX melody with CHORDS for a 16-step sequencer.

Available notes: ${notes.map(n => n + currentOctave).join(', ')}.

YOU MUST CREATE CHORDS. A chord is when AT LEAST 3 NOTES play at the EXACT SAME step number.

INSTRUCTIONS:
1. Pick 4-6 step positions where chords will play (e.g. but don't copy exactly, steps 0, 4, 8, 12)
2. For EACH of those positions, place AT LEAST 3 different notes
3. Add 2-4 more notes at other positions for melody
4. ALL notes must use the SAME step numbers you chose for chords

EXAMPLE - See how steps 0, 4, 8, 12 each have THREE notes (C, E, G):
{
  "notes": [
    {"note": "C${currentOctave}", "steps": [0, 4, 8, 12]},
    {"note": "E${currentOctave}", "steps": [0, 4, 8, 12]},
    {"note": "G${currentOctave}", "steps": [0, 4, 8, 12]},
    {"note": "A${currentOctave}", "steps": [2, 6, 10, 14]},
    {"note": "D${currentOctave}", "steps": [1, 3, 5, 7]}
  ]
}

At step 0: C, E, G play together = CHORD
At step 4: C, E, G play together = CHORD
At step 8: C, E, G play together = CHORD
At step 12: C, E, G play together = CHORD

YOU MUST USE THIS EXACT PATTERN. Pick your chord notes and make them share the SAME step arrays.

Return ONLY valid JSON, no markdown or explanation.`
        : `Given this music description: "${input}", generate a simple complementary melody pattern for a 16-step sequencer.

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
- Include 4-6 different notes
- Steps should be sparse (not every step filled)
- Make it musical and fitting for ${input}

Return ONLY the JSON, no other text.`;

    const [drumResponse, pianoResponse] = await Promise.all([
        model.generateContent(
            `Given this drum beat description: "${input}", classify it into one of these categories: techno, house, trap, breakbeat, or minimal. Respond with ONLY the category name in lowercase, nothing else.`
        ),
        model.generateContent(melodyInstructions)
    ]);

    const pianoText = pianoResponse.response.text().trim();

    // Debug logging to see what AI returns
    if (isCreative) {
        console.log('=== CREATIVE MODE OUTPUT ===');
        console.log(pianoText);
        console.log('===========================');
    }

    return {
        drumPattern: drumResponse.response.text().trim().toLowerCase(),
        pianoPattern: pianoText
    };
}
