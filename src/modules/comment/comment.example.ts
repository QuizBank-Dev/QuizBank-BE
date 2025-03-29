export const commentBaseExample = {
	_id: '67e6f592d6648a01149e94f1',
	depth: 0,
	content: '이 문제 좀 이상하지 않나요?',
	quiz: '67e5ab5f60f22ad560ddac5b',
	replies: [],
	author: '67e2e20e5872c849d5dd4b86',
};

export const commentPreviewExample = {
	...commentBaseExample,
	author: {
		profileImg: '',
		_id: '67e2e20e5872c849d5dd4b86',
		nickname: 'test계정',
	},
};

export const commentDetailExample = {
	...commentBaseExample,
	replies: [
		{
			_id: '67e6f592d6648a01149e94f2',
			depth: 1,
			content: '그러게요. 제 생각도 그렇습니다.',
			quiz: '67e5ab5f60f22ad560ddac5b',
			replies: [],
			author: '67e2e20e5872c849d5dd4b87',
		},
	],
};
