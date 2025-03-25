import { OmitType } from '@nestjs/swagger';
import { BaseResponse } from './base-response.dto';

export class DefaultResponse extends OmitType(BaseResponse<never>, [
	'data',
] as const) {
	constructor(statusCode: number, message: string) {
		super(statusCode, message);
	}
}
