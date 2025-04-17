import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { envKeys } from 'src/config/env.const';
import { GeminiResponse } from '../ai.types';

@Injectable()
export class GeminiClient {
	constructor(private readonly configService: ConfigService) {}

	async request(prompt: string) {
		try {
			const url = this.configService.get<string>(envKeys.AI.GEMINI.URL);
			const key = this.configService.get<string>(envKeys.AI.GEMINI.KEY);

			const res = await axios.post<GeminiResponse>(`${url}?key=${key}`, {
				contents: [{ parts: [{ text: prompt }] }],
			});

			return res.data;
		} catch (e) {
			throw new InternalServerErrorException(
				'AI 요청 중 오류가 발생했습니다.',
			);
		}
	}
}
