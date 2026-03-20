import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

function getText(text: string | undefined, label: string): string {
	if (!text) throw new Error(`Gemini returned no text for: ${label}`);
	return text;
}

export type QuizQuestion = {
	question: string;
	options: string[];
	answerIndices: number[];
	explanation: string;
	multiSelect: boolean;
};

export async function generateQuizBatch(
	skill: string,
	topic: string,
	count = 5
): Promise<QuizQuestion[]> {
	const result = await ai.models.generateContent({
		model: MODEL,
		contents: `You are a quiz generator for people learning ${skill}.
Generate ${count} varied quiz questions about: ${topic}

Some questions should have ONE correct answer, others should have MULTIPLE correct answers.
Mix it up — vary the difficulty and question style.

Respond with ONLY valid JSON — an array of exactly ${count} objects:
[
  {
    "question": "the question text",
    "options": ["option A", "option B", "option C", "option D"],
    "answerIndices": [0],
    "explanation": "why these answers are correct",
    "multiSelect": false
  }
]

Rules:
- answerIndices is an array of correct answer positions (0-based)
- multiSelect is true if there are 2+ correct answers, false otherwise
- For multiSelect questions, always have exactly 2 correct answers
- No markdown, no code fences, just raw JSON array.`
	});

	return JSON.parse(getText(result.text, 'generateQuizBatch'));
}

export async function generateFlashcards(
	skill: string,
	topic: string,
	count = 5
): Promise<{ front: string; back: string }[]> {
	const result = await ai.models.generateContent({
		model: MODEL,
		contents: `You are a flashcard generator for people learning ${skill}.
Generate ${count} flashcards about: ${topic}

Respond with ONLY valid JSON — an array of objects:
[
  { "front": "question or prompt", "back": "answer or explanation" }
]

No markdown, no code fences, just raw JSON.`
	});

	return JSON.parse(getText(result.text, 'generateFlashcards'));
}

export async function explainConcept(skill: string, concept: string): Promise<string> {
	const result = await ai.models.generateContent({
		model: MODEL,
		contents: `You are a patient tutor helping someone learn ${skill}.
Explain this concept clearly and concisely in 2-3 short paragraphs: ${concept}
Use simple language and a practical example if possible.`
	});

	return getText(result.text, 'explainConcept');
}
