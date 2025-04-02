export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh',
	INVITE = 'invite',
}

export interface TokenOption {
	secret: string;
	expiry: number;
}
