import { Injectable, Logger } from '@nestjs/common';
import { Contract, ContractEventName, EventLog, Log } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { combineEvents, generateJobName, getRangeBlocks, transformArgsEvent, transformEventByABI } from 'src/_util';
import { chunk, find, map, pick } from 'lodash';
import { events, JobStatus } from '@prisma/client';
import { CronJob } from 'cron';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ContractStorage, EContract } from 'src/constant/contract';
import { TopicFilter } from 'ethers/types/providers';

@Injectable()
export class CrawlerService {
  constructor(private readonly prismaService: PrismaService, private readonly schedulerRegistry: SchedulerRegistry) {}
  private readonly logger = new Logger(CrawlerService.name);

  async createJobEvent(contractName: EContract, eventsName: string[], cron: string | CronExpression) {
    let jobName = generateJobName(contractName, eventsName);

    const job = new CronJob(cron, async () => {
      const contractStorage = ContractStorage[contractName];

      let latestBlock = await contractStorage.provider.getBlockNumber();

      let prevJob = await this.prismaService.job.findFirst({
        where: {
          name: jobName,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      let startBlock = prevJob ? prevJob.end_block + 1 : contractStorage.startBlock;

      let currentJob = await this.prismaService.job.create({
        data: {
          name: jobName,
          start_block: startBlock,
          end_block: latestBlock,
          status: JobStatus.processing,
        },
      });
      this.logger.warn(`time for job ${jobName} to run! with start block: ${startBlock}, end block: ${latestBlock}`);

      try {
        let eventsRaw = await this.crawlEvent(contractName, eventsName, startBlock, latestBlock);

        let eventsResult: events[] = map(eventsRaw, (event) => {
          return {
            tx_hash: event.transactionHash,
            event_name: event.eventName,
            event_data: event.eventValue,
            status: event.status,
            timestamp: event.timestamp,
            job_id: currentJob.id,
          };
        });
        await this.prismaService.events.createMany({
          data: eventsResult,
          skipDuplicates: true,
        });
        await this.prismaService.job.update({
          where: {
            id: currentJob.id,
          },
          data: {
            status: JobStatus.complete,
          },
        });
      } catch (error) {
        this.logger.error(error);
        await this.prismaService.job.update({
          where: {
            id: currentJob.id,
          },
          data: {
            status: JobStatus.failed,
          },
        });
      }
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.warn(`job ${jobName} added for each minute with cron: ${cron}`);
  }

  async crawlEvent(contractName: EContract, eventsName: string[], startBlock: number, endBlock: number, elementsPerGroup: number = 10) {
    const contractStorage = ContractStorage[contractName];

    const contract = new Contract(contractStorage.address, contractStorage.abi, contractStorage.provider);

    const contractEvents = transformEventByABI(contractStorage.abi);

    let eventRaws: Log[] = [];

    let rangeBlocks = chunk(getRangeBlocks(startBlock, endBlock), elementsPerGroup);

    const topicFilter = await combineEvents(contract, eventsName);

    for (let i of rangeBlocks) {
      let data = await this._getEventRange(contract, topicFilter, i);
      if (data.length !== 0) {
        eventRaws.push(...data);
      }
    }

    return Promise.all(
      map(eventRaws, async (event) => ({
        ...pick(event, ['event', 'blockNumber', 'blockHash', 'transactionHash']),
        ...pick(await event.getTransactionReceipt(), ['from', 'to', 'status']),
        timestamp: (await event.getBlock()).timestamp,
        //@ts-ignore
        eventName: event?.fragment?.name,
        //@ts-ignore
        eventValue: this.exportEventValue(event, contractEvents, event.fragment.name),
      })),
    );
  }

  exportEventValue(event: Log, contractEvents: { name: string; params: string[] }[], eventName: string) {
    console.log(contractEvents, eventName);
    let eventContractDetail = find(contractEvents, { name: eventName });

    //@ts-ignore
    return transformArgsEvent(event.args, eventContractDetail.params);
  }

  async _getEventRange(contract: Contract, eventFilter: ContractEventName, rangeBlocks: { startBlock: number; endBlock: number }[]) {
    let events: EventLog | Log[] = [];
    for (let rangeBlock of rangeBlocks) {
      let rse = await contract.queryFilter([eventFilter] as TopicFilter, rangeBlock.startBlock, rangeBlock.endBlock);
      if (rse.length !== 0) {
        events.push(...rse);
      }
    }
    return events;
  }
}
