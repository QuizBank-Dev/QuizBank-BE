export const createQuizbookEx = {
	_id: '67fdc5ac1e49a2871aeb6657',
	title: '면접 대비 CS 문제집',
	description: '면접 대비하는 문제입니다.',
	category: '웹 개발',
	quizList: [
		'67fdc5ac1e49a2871aeb6651',
		'67fdc5ac1e49a2871aeb6652',
		'67fdc5ac1e49a2871aeb6653',
	],
	solvedCount: 0,
	solvedScore: 0,
	totalScore: 60,
	reviewCount: 0,
	reviewScore: 0,
	reviewRating: 0,
	author: '67e2e20e5872c849d5dd4b86',
	createdAt: '2025-04-15T02:34:20.113Z',
	updatedAt: '2025-04-15T08:24:44.912Z',
	__v: 0,
};

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
			totalScore: 60,
			reviewCount: 1,
			reviewScore: 4,
			reviewRating: 4,
			author: {
				_id: '67e2e20e5872c849d5dd4b86',
				profileImg: '',
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

export const getGroupQuizbookListEx = {
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
			totalScore: 60,
			reviewCount: 1,
			reviewScore: 4,
			reviewRating: 4,
			author: {
				_id: '67e2e20e5872c849d5dd4b86',
				profileImg: '',
				nickname: 'test계정',
			},
			createdAt: '2025-04-15T02:34:20.113Z',
			updatedAt: '2025-04-15T08:24:44.912Z',
			__v: 0,
			endedAt: '2025-04-15T08:24:44.912Z',
		},
	],
	nextCursor: null,
	totalCount: 1,
};

export const getQuizbookMetaDataEx = {
	_id: '68003e7b56ae18a5b75151d1',
	title: '면접 대비 웹 개발 문제집',
	description:
		'웹 개발 면접에서 자주 나오는 필수 개념들을 복습하기 위한 문제집입니다.',
	category: '웹 개발',
	quizList: [
		{
			_id: '68003e7b56ae18a5b75151cf',
			type: '주관식',
			question:
				'다음 설명에 해당하는 용어는 무엇인가요? 연결 지향적이고 신뢰성이 높은 전송 프로토콜로, 패킷 순서 보장과 오류 제어 기능을 제공합니다.',
			answer: 'TCP',
			optionList: [],
		},
	],
	totalScore: 15,
	author: {
		_id: '67fe18f8bb486fc72e9a8004',
		nickname: 'test2계정',
		profileImg: '',
	},
	createdAt: '2025-04-15T02:34:20.113Z',
};

export const getQuizbookUserFlagsEx = {
	_id: '68003e7b56ae18a5b75151d1',
	isLiked: false,
	isStudied: true,
};

export const getQuizbookStatesEx = {
	_id: '68003e7b56ae18a5b75151d1',
	solvedCount: 1,
	solvedScore: 15,
	totalScore: 15,
	reviewCount: 0,
	reviewScore: 0,
	reviewRating: 0,
	createdAt: '2025-04-16T23:34:19.300Z',
	updatedAt: '2025-05-12T10:16:07.769Z',
};
