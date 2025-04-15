import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from '../dto/base-response.dto';
import { DefaultResponse } from '../dto/default-response.dto';

/**
 * Swagger의 API 응답을 BaseResponse<T> 형태로 감싸는 커스텀 데코레이터
 * @param statusCode - 응답 상태 코드 (기본값 200)
 * @param description - 응답에 대한 설명
 * @param exmaple - 실제 응답값에 적용될 데이터 객체 (Optional)
 */
export const ApiBaseResponse = (
	statusCode: number = HttpStatus.OK,
	description: string,
	example?: Record<string, unknown> | Record<string, unknown>[],
) => {
	const baseProperties: Record<string, any> = {
		statusCode: { type: 'number', example: statusCode },
		message: { type: 'string', example: 'ok' },
	};

	if (example) {
		baseProperties['result'] = { example };

		return applyDecorators(
			ApiExtraModels(BaseResponse),
			ApiResponse({
				status: statusCode,
				description,
				schema: {
					allOf: [
						{ $ref: getSchemaPath(BaseResponse) },
						{ properties: baseProperties },
					],
				},
			}),
		);
	}

	// example이 없는 경우 (data 없이 공통 응답)
	return applyDecorators(
		ApiExtraModels(DefaultResponse),
		ApiResponse({
			status: statusCode,
			description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(DefaultResponse) },
					{ properties: baseProperties },
				],
			},
		}),
	);
};
