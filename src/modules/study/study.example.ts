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

export const getQuizbookRecordListEx = {
	data: [
		{
			quizbook: {
				_id: '68303717243137e8fed8a2a0',
				title: '알고리즘 문제집',
				description: '퉁퉁',
				category: '알고리즘',
				quizList: ['68303717243137e8fed8a29e'],
				solvedCount: 1,
				solvedScore: 5,
				totalScore: 5,
				reviewCount: 0,
				reviewScore: 0,
				reviewRating: 0,
				author: {
					_id: '68149ad6ee14a9829e44135c',
					nickname: 'Seokjun Yun',
					profileImg:
						'https://avatars.githubusercontent.com/u/57414420?v=4',
				},
				createdAt: '2025-05-23T08:51:35.145Z',
				updatedAt: '2025-05-26T00:41:22.682Z',
				__v: 0,
			},
			score: 5,
			updatedAt: '2025-05-26T00:41:22.668Z',
		},
	],
	nextCursor: {
		_id: '682c8e04f480a6a411ce80f6',
	},
	totalCount: 9,
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
	memberList: [
		{
			_id: '67e2e20e5872c849d5dd4b86',
			nickname: 'test계정',
			profileImg: '',
		},
		{
			_id: '67e2e20e5872c849d5dd4b86',
			nickname: 'test계정',
			profileImg: '',
		},
	],
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
