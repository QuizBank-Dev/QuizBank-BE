/**
 * 토큰 만료일
 * - AccessToken: 15분
 * - RefreshToken: 14일
 */
export const AUTH_TOKEN_EXPIRY = {
	ACCESS: 60 * 15, // 15m
	REFRESH: 60 * 60 * 24 * 14, // 14d
	INVITE: 60 * 60 * 24, // 1d
};

/**
 * Cookie keys
 */
export const AUTH_COOKIE_KEY = {
	ACCESS: 'access_token',
	REFRESH: 'refresh_token',
} as const;

/**
 * Cookie Options
 */
export const AUTH_COOKIE_OPTIONS = {
	ACCESS: {
		httpOnly: true,
		maxAge: AUTH_TOKEN_EXPIRY.ACCESS * 1000,
	},
	REFRESH: {
		httpOnly: true,
		maxAge: AUTH_TOKEN_EXPIRY.REFRESH * 1000,
	},
};
