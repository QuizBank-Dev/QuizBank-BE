export const AUTH_TOKEN_EXPIRY = {
	ACCESS: 60 * 15, // 15m
	REFRESH: 60 * 60 * 24 * 15, // 15d
};

export const AUTH_COOKIE_KEY = {
	ACCESS: 'access_token',
	REFRESH: 'refresh_token',
};

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
