import { CrawlerService } from './crawler.service';
import { Controller, Get } from '@nestjs/common';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  async getEvents() {
    await this.crawlerService.crawlEvent();
  }
}
