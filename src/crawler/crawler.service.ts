import { Injectable } from '@nestjs/common';
import { Contract, ContractEventName, EventLog, Log } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { BSC_TESTNET_PROVIDER, MINESWEEPER_CONTRACT_ADDRESS } from 'src/constant/network';
import { exportProviderViaURL, getRangeBlocks, transformArgsEvent } from 'src/_util';
import { abi } from 'src/abi/Minesweeper.json';
import { chunk } from 'lodash';
@Injectable()
export class CrawlerService {
  constructor(private readonly prismaService: PrismaService) {}

  async crawlEvent() {
    const provider = exportProviderViaURL(BSC_TESTNET_PROVIDER);

    const contract = new Contract(MINESWEEPER_CONTRACT_ADDRESS, abi, provider);

    let latestBlock = await provider.getBlockNumber();

    let eventRaws: Log[] = [];

    let rangeBlocks = chunk(getRangeBlocks(24697350, latestBlock), 10);

    let eventBuyTurnFilter = contract.filters['BuyTurn'](null, null);

    for (let i of rangeBlocks) {
      let data = await this._getEventRange(contract, eventBuyTurnFilter, i);
      if (data.length !== 0) {
        eventRaws.push(...data);
      }
    }

    let result = eventRaws.map((event) => ({
      ...event,
      //@ts-ignore
      args: transformArgsEvent(event.args, ['buyer', 'numberOfTurns']),
    }));

    console.log(result);
  }

  async _getEventRange(contract: Contract, eventFilter: ContractEventName, rangeBlocks: { startBlock: number; endBlock: number }[]) {
    let events: EventLog | Log[] = [];
    for (let rangeBlock of rangeBlocks) {
      let rse = await contract.queryFilter(eventFilter, rangeBlock.startBlock, rangeBlock.endBlock);
      if (rse.length !== 0) {
        events.push(...rse);
      }
    }
    return events;
  }
}
