import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SitemapService } from './sitemap.service';
import { Public } from '../auth/decorator/public.decorator';

@Controller({
	path: 'sitemap',
	version: '1',
})
@ApiTags('Sitemap')
export class SitemapController {
	constructor(private readonly sitemapService: SitemapService) {}

	@Public()
	@Get()
	async getQuizbookIdList() {
		const quizbookIdList =
			await this.sitemapService.getQuizbookIdListForSitemap();

		return {
			quizbookIdList,
		};
	}
}
