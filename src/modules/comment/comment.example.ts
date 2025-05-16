export const createCommentEx = {
	_id: '67fe3f484d188f97d2aec4cf',
	content: 'Comment 생성 테스트',
	quiz: '67fdc5ac1e49a2871aeb6651',
	author: '67fe18f8bb486fc72e9a8004',
	createdAt: '2025-04-15T11:13:12.456Z',
	updatedAt: '2025-04-15T11:23:01.730Z',
	__v: 0,
};

export const updateCommentEx = {
	_id: '67fe3f484d188f97d2aec4cf',
	content: 'Comment 수정 테스트',
	quiz: '67fdc5ac1e49a2871aeb6651',
	author: '67fe18f8bb486fc72e9a8004',
	createdAt: '2025-04-15T11:13:12.456Z',
	updatedAt: '2025-04-15T11:23:01.730Z',
	__v: 0,
};

export const getCommentListEx = {
	data: [
		{
			_id: '67fdc72a1e49a2871aeb66cd',
			content: 'Comment 수정 테스트',
			quiz: '67fdc5ac1e49a2871aeb6651',
			author: {
				_id: '67e2e20e5872c849d5dd4b86',
				nickname: 'test계정',
			},
			createdAt: '2025-04-15T02:40:42.805Z',
			updatedAt: '2025-04-15T02:41:30.812Z',
			__v: 0,
			recommentCount: 6,
		},
	],
	nextCursor: null,
	totalCount: 1,
};

export const getMyCommentEx = {
	data: [
		{
			_id: '67fe3f484d188f97d2aec4cf',
			content: '대댓글 테스트7',
			quiz: '67fdc5ac1e49a2871aeb6651',
			author: '67fe18f8bb486fc72e9a8004',
			createdAt: '2025-04-15T11:13:12.456Z',
			updatedAt: '2025-04-15T11:13:12.456Z',
			__v: 0,
		},
	],
	nextCursor: null,
	totalCount: 1,
};

export const getCommentDetailEx = {
	data: [
		{
			_id: '67fdc8c61e49a2871aeb670f',
			parent: '67fdc72a1e49a2871aeb66cd',
			content: '대댓글 테스트6',
			quiz: '67fdc5ac1e49a2871aeb6651',
			author: {
				_id: '67e2e20e5872c849d5dd4b86',
				nickname: 'test계정',
			},
			createdAt: '2025-04-15T02:47:34.588Z',
			updatedAt: '2025-04-15T02:47:34.588Z',
			__v: 0,
		},
	],
	nextCursor: null,
	totalCount: 1,
};
