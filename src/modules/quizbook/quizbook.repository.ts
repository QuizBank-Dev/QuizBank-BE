import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizbook } from './schema/quizbook.schema';
import { DB_TYPE } from 'src/database/database.const';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class QuizbookRepository {
	constructor(
		@InjectModel(Quizbook.name, DB_TYPE.DEFAULT)
		private readonly quizbookModel: Model<Quizbook>,
	) {}

	// 문제집 존재 유/무 확인
	async existsOrFail(quizbookId: string) {
		if (!isValidObjectId(quizbookId))
			throw new BadRequestException('유효하지 않은 문제집 ID 입니다.');

		const exists = await this.quizbookModel.exists({ _id: quizbookId });

		if (!exists)
			throw new NotFoundException(
				`${quizbookId}에 대한 문제집을 찾을 수 없습니다.`,
			);
	}
}
