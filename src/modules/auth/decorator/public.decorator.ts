import { Reflector } from '@nestjs/core';

/**
 * 인증 없이 접근이 가능한 엔드포인트 설정을 위한 데코레이터
 */
export const Public = Reflector.createDecorator();
