import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SitemapCache } from './schema/sitemap-cache.schema';
import { DB_TYPE } from 'src/database/database.const';
import { Model } from 'mongoose';

@Injectable()
export class SitemapRepository {
	constructor(
		@InjectModel(SitemapCache.name, DB_TYPE.DEFAULT)
		private readonly sitemapCacheModel: Model<SitemapCache>,
	) {}

	async getCache() {
		return await this.sitemapCacheModel.findOne().lean();
	}

	async saveCache(quizbookIdList: string[]) {
		await this.sitemapCacheModel.findOneAndUpdate(
			{},
			{
				quizbookIdList,
				needsUpdate: false,
			},
			{ upsert: true, new: true },
		);
	}

	async markNeedsUpdate() {
		await this.sitemapCacheModel.updateOne(
			{},
			{ needsUpdate: true },
			{ upsert: true },
		);
	}
}
