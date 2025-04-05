const userList = [
	{
		_id: '65e8a5d6fc13ae5e7f000001',
		nickname: 'example1',
		profileImgUrl: '',
	},
	{
		_id: '65e8a5d6fc13ae5e7f000002',
		nickname: 'example2',
		profileImgUrl: '',
	},
	{
		_id: '65e8a5d6fc13ae5e7f000003',
		nickname: 'example3',
		profileImgUrl: '',
	},
];

export const allExample = {
	follower: userList,
	following: userList,
};

export const followerExample = {
	follower: allExample.follower,
};

export const followingExample = {
	following: allExample.following,
};
