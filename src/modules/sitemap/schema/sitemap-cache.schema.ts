import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SitemapCache extends Document {
	@Prop({ type: [String], required: true })
	quizbookIdList: string[];

	@Prop({ type: Boolean, default: false })
	needsUpdate: boolean;
}

export const SitemapCacheSchema = SchemaFactory.createForClass(SitemapCache);
