// import { getQuizbookListEx } from '../quizbook/quizbook.example';

export const meExample = {
	_id: '65e8a5d6fc13ae5e7f000001',
	nickname: 'example1',
	profileImgUrl: '',
	introduce: '',
	category: ['자료구조'],
	experience: 0,
	isOAuthAccount: false,
};

export const otherExample = {
	_id: '65e8a5d6fc13ae5e7f000011',
	nickname: 'example11',
	profileImgUrl: '',
	introduce: '',
	experience: 0,
	follower: ['65e8a5d6fc13ae5e7f000001'],

	// 엔드포인트가 따로 파진 관계로 주석 처리 했습니다.
	// TODO Example 수정 필요
	// quizbook: getQuizbookListEx,
	// record: [],
};
