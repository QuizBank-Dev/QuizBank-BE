export const quizbookBaseExample = {
	_id: '65e8a5d6fc13ae5e7f000002',
	title: '알고리즘 문제집',
	description: '면접 준비용',
	category: '알고리즘',
	solvedCount: 100,
	solvedRate: 85.5,
	reviewCount: 10,
	reviewRate: 4.5,
	quizList: ['65e8a5d6fc13ae5e7f000099'],
	author: '65e8a5d6fc13ae5e7f000004',
};

export const quizbookPreviewExample = {
	...quizbookBaseExample,
	quizList: ['65e8a5d6fc13ae5e7f000099'],
	author: {
		_id: '65e8a5d6fc13ae5e7f000004',
		nickname: 'example123',
		profileImgUrl:
			'https://your-bucket.s3.ap-northeast-2.amazonaws.com/profile/user123.jpg',
	},
};

export const quizbookDetailExample = {
	...quizbookBaseExample,
	quizList: [
		{
			_id: '6602b123abc123456789abcd',
			question: '다음 중 정렬 알고리즘이 아닌 것은?',
			type: '객관식',
			optionList: ['버블 정렬', '삽입 정렬', '선택 정렬', '힙 탐색'],
		},
	],
	author: {
		_id: '65e8a5d6fc13ae5e7f000004',
		nickname: 'example123',
		profileImgUrl:
			'https://your-bucket.s3.ap-northeast-2.amazonaws.com/profile/user123.jpg',
	},
};
