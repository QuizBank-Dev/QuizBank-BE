import { Module } from '@nestjs/common';
import { QuizbookService } from './quizbook.service';
import { QuizbookController } from './quizbook.controller';

@Module({
	controllers: [QuizbookController],
	providers: [QuizbookService],
})
export class QuizbookModule {}
