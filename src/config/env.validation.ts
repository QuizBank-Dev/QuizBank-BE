import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	ENV: Joi.string().valid('dev', 'prod').default('dev'),
	PORT: Joi.number().default(3000),
	DB_DEFAULT_URI: Joi.string().required(),
	DB_SUB_URI: Joi.string().required(),
	ACCESS_TOKEN_SECRET: Joi.string().required(),
	REFRESH_TOKEN_SECRET: Joi.string().required(),
	CLIENT_LOCAL_URL: Joi.string().default('http://localhost:3000'),
	CLIENT_PROD_URL: Joi.string(),
	MAILER_HOST: Joi.string(),
	MAILER_PORT: Joi.number(),
	MAILER_USER: Joi.string(),
	MAILER_PASS: Joi.string(),
	HASH_ROUNDS: Joi.number(),
});
