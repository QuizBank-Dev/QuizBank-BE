import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { envKeys } from './config/env.const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const localUrl = configService.get<string>(envKeys.CLIENT.LOCAL);
	const prodUrl = configService.get<string>(envKeys.CLIENT.PROD);
	const port = configService.get<number>(envKeys.PORT);

	const config = new DocumentBuilder()
		.setTitle('QuizBank')
		.setDescription('QuizBank API 명세')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
	app.use(helmet());
	app.use(cookieParser());
	app.enableCors({
		origin: prodUrl ? [localUrl, prodUrl] : [localUrl],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		credentials: true,
	});
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1',
	});
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new GlobalResponseInterceptor());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	await app.listen(port || 3000);
}
bootstrap();
