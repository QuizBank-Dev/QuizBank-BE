export const generateShortAnswerPrompt = (
	category: string,
	question: string,
	model: string,
	answer: string,
) => `
You are an expert in the field of "${category}".

Determine whether the student's short answer is semantically equivalent to the model answer.

Accept alternate forms such as abbreviations, full expressions, or technical synonyms.

Return only one number:
- 15 if the answer is correct
- 0 if the answer is incorrect

Do NOT include any explanation, label, or formatting. Return only the number.

[Question]
${question}

[Model Answer]
${model}

[Student Answer]
${answer}

[Response Format]
<number only, either 0 or 15>
`;
