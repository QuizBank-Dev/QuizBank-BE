import { Injectable } from '@nestjs/common';
import { SitemapRepository } from './sitemap.repository';
import { QuizbookService } from '../quizbook/quizbook.service';

@Injectable()
export class SitemapService {
	constructor(
		private readonly quizbookService: QuizbookService,
		private readonly sitemapRepo: SitemapRepository,
	) {}

	async getQuizbookIdListForSitemap() {
		const cached = await this.sitemapRepo.getCache();

		if (!cached || cached.needsUpdate) {
			const quizbookIdList =
				await this.quizbookService.getQuizbookIdList();

			await this.sitemapRepo.saveCache(quizbookIdList);

			return quizbookIdList;
		}

		return cached.quizbookIdList;
	}
}
