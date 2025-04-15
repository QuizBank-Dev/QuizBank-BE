export const getQuizbookListEx = {
	data: [
		{
			_id: '67fdc5ac1e49a2871aeb6657',
			title: '면접 대비 CS 문제집',
			description: '면접 대비하는 문제입니다.',
			category: '웹 개발',
			quizList: [
				'67fdc5ac1e49a2871aeb6651',
				'67fdc5ac1e49a2871aeb6652',
				'67fdc5ac1e49a2871aeb6653',
			],
			solvedCount: 3,
			solvedScore: 40,
			reviewCount: 1,
			reviewScore: 4,
			reviewRating: 4,
			author: {
				_id: '67e2e20e5872c849d5dd4b86',
				nickname: 'test계정',
			},
			createdAt: '2025-04-15T02:34:20.113Z',
			updatedAt: '2025-04-15T08:24:44.912Z',
			__v: 0,
			isLiked: true,
			isStudied: true,
		},
	],
	nextCursor: null,
	totalCount: 1,
};

export const getQuizbookWithDetailEx = {
	_id: '67fdc5c21e49a2871aeb665d',
	title: '면접 대비 CS 문제집',
	description: '면접 대비하는 문제입니다.',
	category: '웹 개발',
	quizList: [
		{
			_id: '67fdc5c21e49a2871aeb6659',
			type: '주관식',
			question: 'test',
			optionList: [],
		},
		{
			_id: '67fdc5c21e49a2871aeb665a',
			type: '서술형',
			question: 'test',
			optionList: [],
		},
	],
	solvedCount: 0,
	solvedScore: 0,
	reviewCount: 1,
	reviewScore: 1,
	reviewRating: 1,
	author: {
		_id: '67e2e20e5872c849d5dd4b86',
		nickname: 'test계정',
	},
	createdAt: '2025-04-15T02:34:42.134Z',
	updatedAt: '2025-04-15T02:39:29.532Z',
	__v: 0,
	isLiked: true,
	isStudied: false,
};
