import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
	constructor(statusCode: number, message: string, data?: T) {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}

	@ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
	statusCode: number;

	@ApiProperty({ example: 'ok', description: '응답 메시지' })
	message: string;

	@ApiProperty({ description: '응답 데이터', required: false })
	data?: T;
}
