import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { QuizbookService } from './quizbook.service';
import { CreateQuizbookDto } from './dto/create-quizbook.dto';
import { UpdateQuizbookDto } from './dto/update-quizbook.dto';

@Controller('quizbook')
export class QuizbookController {
	constructor(private readonly quizbookService: QuizbookService) {}

	@Post()
	create(@Body() createQuizbookDto: CreateQuizbookDto) {
		return this.quizbookService.create(createQuizbookDto);
	}

	@Get()
	findAll() {
		return this.quizbookService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.quizbookService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateQuizbookDto: UpdateQuizbookDto,
	) {
		return this.quizbookService.update(+id, updateQuizbookDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.quizbookService.remove(+id);
	}
}
