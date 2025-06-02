import { Injectable } from '@nestjs/common';
import { QuizbookService } from '../quizbook/quizbook.service';
import { SitemapRepository } from './sitemap.repository';

@Injectable()
export class SitemapService {
	constructor(
		private readonly quizbookService: QuizbookService,
		private readonly sitemapRepo: SitemapRepository,
	) {}

	// 캐시 된 QuizbookList 조회
	async getQuizbookIdListForSitemap() {
		const curList = await this.quizbookService.getQuizbookIdList();
		const cachedList = await this.sitemapRepo.getCache();

		const isChanged =
			curList.length !== cachedList.length ||
			curList.some((id, i) => id !== cachedList[i]);

		if (isChanged) {
			await this.sitemapRepo.saveCache(curList);
		}

		return curList;
	}
}
