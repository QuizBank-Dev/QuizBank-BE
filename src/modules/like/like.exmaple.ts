import { quizBaseExample } from '../quiz/quiz.example';
import { quizbookBaseExample } from '../quizbook/quizbook.example';

export const toggleLikeExample = {
	state: true,
};

export const likeByUserIdWithQuizbookList = {
	_id: '65e8a5d6fc13ae5e7f000002',
	quizbookList: [quizbookBaseExample],
	owner: '65e8a5d6fc13ae5e7f000004',
};

export const likeByUserIdWithQuizList = {
	_id: '65e8a5d6fc13ae5e7f000002',
	quizList: [quizBaseExample],
	owner: '65e8a5d6fc13ae5e7f000004',
};
