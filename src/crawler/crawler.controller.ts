import { CrawlerService } from './crawler.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { EContract, ContractStorage } from 'src/constant/contract';
import { CreateJobDto } from './dto/create-job.dto';
import { map } from 'lodash';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get()
  async test() {
    let job2 = this.crawlerService.createJobEvent(EContract.Snews, ContractStorage[EContract.Snews].eventsName, '30 * * * * *', 2);
    let job1 = this.crawlerService.createJobEvent(EContract.Snews, ContractStorage[EContract.Snews].eventsName, '10 * * * * *', 1);

    await Promise.all([job1, job2]);
  }

  @Post('/create-job')
  async createJobForContract(@Body() jobs: CreateJobDto[]) {
    let data = map(jobs, (job) =>
      this.crawlerService.createJobEvent(job.contractName, ContractStorage[job.contractName].eventsName, job.cronValue, job.nonceJob),
    );

    await Promise.all(data);
  }
}
