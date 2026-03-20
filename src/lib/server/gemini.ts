import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

function getText(text: string | undefined, label: string): string {
	if (!text) throw new Error(`Gemini returned no text for: ${label}`);
	return text;
}

export async function generateQuiz(
	skill: string,
	topic: string
): Promise<{
	question: string;
	options: string[];
	answerIndex: number;
	explanation: string;
}> {
	const result = await ai.models.generateContent({
		model: MODEL,
		contents: `You are a quiz generator for people learning ${skill}.
Generate a multiple choice question about: ${topic}

Respond with ONLY valid JSON in this exact shape:
{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "answerIndex": 0,
  "explanation": "why this answer is correct"
}

No markdown, no code fences, just raw JSON.`
	});

	return JSON.parse(getText(result.text, 'generateQuiz'));
}

export async function generateFlashcards(
	skill: string,
	topic: string,
	count = 5
): Promise<
	{
		front: string;
		back: string;
	}[]
> {
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
