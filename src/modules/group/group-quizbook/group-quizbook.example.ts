export const GroupQuizbookListExample = {
	list: [
		{
			group: '65e8a5d6fc13ae5e7f000002',
			quizbook: {
				_id: '65e8a5d6fc13ae5e7f000002',
				title: '알고리즘 문제집',
				description: '면접 준비용',
				category: '알고리즘',
				quizList: [],
				author: {
					_id: '유저ID',
					nickname: '유저 닉네임',
					profileImg: '이미지 url',
				},
				solvedCount: 1,
				solvedScore: 15,
				totalScore: 15,
				reviewCount: 0,
				reviewScore: 0,
				reviewRating: 0,
			},
			endedAt: '2025-04-02',
		},
	],
	nextCursor: '2025-04-02',
	leftCount: 24,
};

export const GroupQuizbookExample = {
	group: '65e8a5d6fc13ae5e7f000002',
	quizbook: {
		_id: '65e8a5d6fc13ae5e7f000002',
		title: '알고리즘 문제집',
		description: '면접 준비용',
		category: '알고리즘',
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
		author: '65e8a5d6fc13ae5e7f000002',
	},
	endedAt: '2025-04-02',
};
