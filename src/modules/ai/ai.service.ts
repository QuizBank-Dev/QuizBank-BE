import { Injectable } from '@nestjs/common';
import { CategoryType } from '../quizbook/schema/quizbook.schema';
import { generateModelAnswerPrompt } from './prompt/modelAnswer.prompt';
import { Quiz, QuizType } from '../quiz/schema/quiz.schema';
import { generateShortAnswerPrompt } from './prompt/shortAnswer.prompt';
import { generateLongAnswerPrompt } from './prompt/longAnswer.prompt';
import { GeminiClient } from './client/gemini-client';
import { cleanRefinedAnswer, getEnglishCategory } from './utils/ai.utils';

@Injectable()
export class AIService {
	constructor(private readonly geminiClient: GeminiClient) {}

	async checkModelAnswerWithAI(
		category: CategoryType,
		question: string,
		answer: string,
	) {
		const prompt = generateModelAnswerPrompt(
			getEnglishCategory(category),
			question,
			answer,
		);

		const res = await this.geminiClient.request(prompt);

		const model = cleanRefinedAnswer(res);

		return model;
	}

	async gradeWithAI(quiz: Quiz, category: CategoryType, answer: string) {
		const prompt =
			quiz.type === QuizType.SHORT_ANSWER
				? generateShortAnswerPrompt(
						category,
						quiz.question,
						quiz.answer,
						answer,
					)
				: generateLongAnswerPrompt(
						category,
						quiz.question,
						quiz.answer,
						answer,
					);

		const res = await this.geminiClient.request(prompt);

		const score = Number(cleanRefinedAnswer(res));

		return score;
	}
}
