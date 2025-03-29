import { Types } from 'mongoose';

export function toObjectId(id: string) {
	if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id);

	throw new Error(`Invalid ObjectId: ${id}`);
}
