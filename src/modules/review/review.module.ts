import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import { Review, ReviewSchema } from './schema/review.schema';
import { QuizbookModule } from '../quizbook/quizbook.module';
import { ReviewRepository } from './review.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [
		DatabaseModule,
		MongooseModule.forFeature(
			[{ name: Review.name, schema: ReviewSchema }],
			DB_TYPE.DEFAULT,
		),
		forwardRef(() => QuizbookModule),
	],
	controllers: [ReviewController],
	providers: [ReviewService, ReviewRepository],
	exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
