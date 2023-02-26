import { CrawlerService } from './crawler.service';
import { Controller, Get } from '@nestjs/common';
import { EContract, ContractStorage } from 'src/constant/contract';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  async test() {
    return await this.crawlerService.createJobEvent(EContract.Minesweeper, ContractStorage[EContract.Minesweeper].eventsName, '30 * * * * *');
  }
}
