import { Quiz, QuizType } from 'src/modules/quiz/schema/quiz.schema';

export function getXpByType(type: QuizType): number {
	switch (type) {
		case QuizType.OX:
			return 5;
		case QuizType.MULTIPLE_CHOICE:
			return 10;
		case QuizType.SHORT_ANSWER:
			return 15;
		case QuizType.LONG_ANSWER:
			return 20;
		default:
			return 0;
	}
}

export function normalizeText(input: string) {
	return input
		.trim()
		.toLocaleLowerCase()
		.replace(/\s+/g, '')
		.replace(/[^\w가-힣]/g, '');
}

/**
 * 채점 유틸 함수
 * @param quiz Quiz모델
 * @param answer 사용자 답안
 * @returns Boolean
 */
export function isCorrect(quiz: Quiz, answer: string) {
	answer = normalizeText(answer);
	const model = normalizeText(quiz.answer);
	const similarList = quiz.similarList.map(normalizeText);

	return answer === model || similarList.includes(answer);
}

export function isWrong(quiz: Quiz, answer: string) {
	answer = normalizeText(answer);
	const wrongList = quiz.wrongList.map(normalizeText);

	return wrongList.includes(answer);
}
