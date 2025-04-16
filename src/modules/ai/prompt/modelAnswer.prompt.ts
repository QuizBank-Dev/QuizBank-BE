export const generateModelAnswerPrompt = (
	category: string,
	question: string,
	origin: string,
) => `
You are a technical proofreader specializing in the subject of "${category}".

Below is a question and a model answer written by a user.  
Your task is to revise the answer to ensure accuracy, clarity, and grammatical correctness — without changing its intended meaning.

The revised answer should be suitable for storing in a database as the official answer to the question.

Return only the final revised answer.  
Do NOT include any labels, explanations, formatting, or introductory text.  
Do NOT include "Refined Answer:" or any similar prefix.

[Question]
${question}

[Original Model Answer]
${origin}

[Response Format]
<final answer only, no prefix>
`;
