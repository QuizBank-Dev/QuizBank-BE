export const generateLongAnswerPrompt = (
	category: string,
	question: string,
	model: string,
	answer: string,
): string => `
You are an instructor in the field of "${category}".

Evaluate the student's answer based on how well it captures the core meaning and intent of the model answer, and whether it sufficiently responds to the question.

Ignore style, tone, grammar, and phrasing. Focus only on conceptual correctness.

Return only a number score from 0 to 20.
Do NOT include any explanation, label, or text before or after the score.

[Question]
${question}

[Model Answer]
${model}

[Student Answer]
${answer}

[Response Format]
<number only, from 0 to 20>
`;
