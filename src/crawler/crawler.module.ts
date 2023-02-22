import { PrismaService } from 'nestjs-prisma';
import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';

@Module({
  providers: [CrawlerService, PrismaService],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
