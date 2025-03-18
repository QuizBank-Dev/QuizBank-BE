export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh',
}

export interface TokenOption {
	secret: string;
	expiry: number;
}
