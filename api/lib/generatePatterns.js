import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generatePatterns(input, currentOctave, notes, apiKey, isCreative = false) {
    console.log('generatePatterns called with isCreative:', isCreative);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create different instructions based on creative mode
    const melodyInstructions = isCreative
        ? `Given this music description: "${input}", generate a COMPLEX melody with CHORDS for a 32-step sequencer.

CRITICAL: The sequencer has 32 steps (0-31), NOT 16 steps. You MUST use the FULL RANGE from step 0 to step 31.
IMPORTANT: 32 steps = 2 bars. Create VARIATION between the two bars - don't just repeat the same pattern twice!

Available notes: ${notes.map(n => n + currentOctave).join(', ')}.

YOU MUST CREATE CHORDS. A chord is when AT LEAST 3 NOTES play at the EXACT SAME step number.

INSTRUCTIONS:
1. Pick 6-8 step positions ACROSS THE FULL 32-STEP RANGE where chords will play (e.g., steps 0, 4, 8, 12, 16, 20, 24, 28)
2. For EACH of those positions, place AT LEAST 3 different notes
3. Add 2-4 more notes at other positions THROUGHOUT THE 32 STEPS for melody
4. IMPORTANT: Use steps from 0 all the way to 31 - don't stop at 15!
5. CREATE VARIETY: Steps 0-15 (bar 1) and steps 16-31 (bar 2) should have different patterns for musical interest

EXAMPLE showing FULL 32-step range:
{
  "notes": [
    {"note": "C${currentOctave}", "steps": [0, 8, 16, 24]},
    {"note": "E${currentOctave}", "steps": [0, 8, 16, 24]},
    {"note": "G${currentOctave}", "steps": [0, 8, 16, 24]},
    {"note": "A${currentOctave}", "steps": [4, 12, 20, 28, 31]},
    {"note": "D${currentOctave}", "steps": [2, 6, 10, 14, 18, 22, 26, 30]}
  ]
}

Notice: D uses steps including 18, 22, 26, 30 (beyond step 15!)
Notice: A uses step 31 (the last step!)

REMEMBER: Steps range from 0 to 31 (32 total steps). Use the ENTIRE range!

Return ONLY valid JSON, no markdown or explanation.`
        : `Given this music description: "${input}", generate a simple complementary melody pattern for a 32-step sequencer.

CRITICAL: The sequencer has 32 steps (0-31), NOT 16. You MUST use the FULL RANGE from step 0 to step 31.
IMPORTANT: 32 steps = 2 bars. Create some VARIATION between the bars - don't just copy the first 16 steps twice!

The available notes in octave ${currentOctave} are: ${notes.map(n => n + currentOctave).join(', ')}.

Create a melodic pattern that fits the mood. Return ONLY a JSON object in this exact format with no markdown:
{
  "notes": [
    {"note": "C${currentOctave}", "steps": [0, 8, 16, 24, 31]},
    {"note": "E${currentOctave}", "steps": [4, 12, 20, 28]},
    {"note": "G${currentOctave}", "steps": [2, 10, 18, 26, 30]}
  ]
}

Notice: Steps include 18, 20, 24, 26, 28, 30, 31 - using the FULL 32-step range!

Where:
- Each note object has a "note" (e.g., "C${currentOctave}") and "steps" (array of step positions from 0 to 31)
- Include 4-6 different notes
- Steps should be spread ACROSS ALL 32 STEPS, not just 0-15
- Make it musical and fitting for ${input}

IMPORTANT: Use the complete range 0-31, don't stop at step 15!

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
