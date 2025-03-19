import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from '../dto/base-response.dto';

/**
 * Swagger의 API 응답을 BaseResponse<T> 형태로 감싸는 커스텀 데코레이터
 * @param model - 실제 응답값에 적용될 데이터 모델
 * @param statusCode - 응답 상태 코드 (기본값 200)
 * @param description - 응답에 대한 설명 (Optional)
 */
export const ApiBaseResponse = <TModel extends Type<unknown>>(
	model: TModel | TModel[],
	statusCode: number = HttpStatus.OK,
	description?: string,
) => {
	const isArrayType = Array.isArray(model);
	const schemaModel = model instanceof Array ? model[0] : model;

	const apiResponseOptions: Record<string, any> = {
		status: statusCode,
		description,
		schema: {
			allOf: [
				{ $ref: getSchemaPath(BaseResponse) },
				{
					properties: {
						statusCode: { type: 'number', example: statusCode },
						message: { type: 'string', example: 'ok' },
						data: isArrayType
							? {
									type: 'array',
									items: { $ref: getSchemaPath(schemaModel) },
								} // ✅ 배열이면 자동으로 감싸기
							: { $ref: getSchemaPath(schemaModel) },
					},
				},
			],
		},
	};

	return applyDecorators(
		ApiExtraModels(BaseResponse, schemaModel),
		ApiResponse(apiResponseOptions),
	);
};
