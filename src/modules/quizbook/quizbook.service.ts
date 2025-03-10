import { Injectable } from '@nestjs/common';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { UpdateQuizbookDto } from './dto/update-quizbook.dto';

@Injectable()
export class QuizbookService {
	create(createQuizbookDto: CreateQuizbookDto) {
		return 'This action adds a new quizbook';
	}

	findAll() {
		return `This action returns all quizbook`;
	}

	findOne(id: number) {
		return `This action returns a #${id} quizbook`;
	}

	update(id: number, updateQuizbookDto: UpdateQuizbookDto) {
		return `This action updates a #${id} quizbook`;
	}

	remove(id: number) {
		return `This action removes a #${id} quizbook`;
	}
}
