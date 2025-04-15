import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	chatRoomId: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}
