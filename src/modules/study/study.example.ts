export const getStudyResultEx = {
	quizList: [
		{
			_id: '67fdc5ac1e49a2871aeb6651',
			question: 'test',
			type: '주관식',
			score: 10,
			isLiked: true,
		},
		{
			_id: '67fdc5ac1e49a2871aeb6652',
			question: 'test',
			type: '서술형',
			score: 0,
			isLiked: false,
		},
		{
			_id: '67fdc5ac1e49a2871aeb6653',
			question: 'test',
			type: 'ox',
			score: 5,
			isLiked: false,
		},
	],
	createdAt: '2025-04-15T08:24:44.877Z',
	updatedAt: '2025-04-15T08:24:44.877Z',
};

export const getQuizRecordOfAnswerListEx = {
	data: [
		{
			answer: 'test',
			score: 10,
			owner: {
				_id: '67fe18f8bb486fc72e9a8004',
				nickname: 'test2계정',
				profileImg: '',
			},
		},
		{
			answer: 'test',
			score: 10,
			owner: {
				_id: '67e2e20e5872c849d5dd4b86',
				nickname: 'test계정',
			},
		},
	],
	nextCursor: null,
	totalCount: 2,
};

export const getQuizRecordOfAnswerListInGroupEx = [
	{
		score: 40,
		answer: '블라블라블라블라',
		owner: {
			_id: '67fe18f8bb486fc72e9a8004',
			nickname: 'test2계정',
			profileImg: '',
		},
	},
	{
		score: 40,
		answer: '블라블라블라블라',
		owner: {
			_id: '67e2e20e5872c849d5dd4b86',
			nickname: 'test계정',
			profileImg: '',
		},
	},
];

export const getQuizbookRecordOfScoreListEx = {
	memberList: ['62ae18f8bb486fc72e9a8004', '68be18f8bb486fc72e9a8004'],
	scoreList: [
		{
			score: 40,
			owner: {
				_id: '67fe18f8bb486fc72e9a8004',
				nickname: 'test2계정',
				profileImg: '',
			},
		},
		{
			score: 40,
			owner: {
				_id: '67e2e20e5872c849d5dd4b86',
				nickname: 'test계정',
				profileImg: '',
			},
		},
	],
};
