export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh',
	INVITE = 'invite',
	RESET_PASSWORD = 'reset_password',
}

export interface TokenOption {
	secret: string;
	expiry: number;
}
