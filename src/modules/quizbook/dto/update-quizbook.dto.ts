import { PartialType } from '@nestjs/swagger';
import { CreateQuizbookDto } from './create-quizbook.dto';

export class UpdateQuizbookDto extends PartialType(CreateQuizbookDto) {}
