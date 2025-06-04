import { forwardRef, Module } from '@nestjs/common';
import { QuizbookModule } from '../quizbook/quizbook.module';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TYPE } from 'src/database/database.const';
import {
	SitemapCache,
	SitemapCacheSchema,
} from './schema/sitemap-cache.schema';
import { SitemapRepository } from './sitemap.repository';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: SitemapCache.name, schema: SitemapCacheSchema }],
			DB_TYPE.DEFAULT,
		),
		forwardRef(() => QuizbookModule),
	],
	controllers: [SitemapController],
	providers: [SitemapService, SitemapRepository],
	exports: [SitemapService, SitemapRepository],
})
export class SitemapModule {}
