import { Contract, JsonRpcProvider, Result, WebSocketProvider } from 'ethers';
import { TopicFilter } from 'ethers/types/providers';
import { filter, flatten, join, map, random, times } from 'lodash';
import { ABIEvent, ContractStorage, EContract } from 'src/constant/contract';
export function transformArgsEvent(values: Result, keys: any[]) {
  let args = {};

  if (values.length !== keys.length) return;
  keys.forEach((key, i) => {
    args[key] = String(values[i]);
  });
  return args;
}

export function exportProviderViaURL(providerUrl: string) {
  try {
    if (/^(https|http)/i.test(providerUrl)) {
      return new JsonRpcProvider(providerUrl);
    }
    if (/^(wss|ws)/i.test(providerUrl)) {
      return new WebSocketProvider(providerUrl);
    }
    return;
  } catch (error) {
    return;
  }
}

export function flattenObject(Objects: Object, key: string) {
  return map(Objects, (object) => object[key]);
}

export function transformEventByABI(abi): { name: string; params: string[] }[] {
  const events: ABIEvent[] = filter(abi, { type: 'event' });
  if (events.length === 0) return;
  return map(events, (event) => ({
    name: event.name,
    params: flattenObject(event.inputs, 'name'),
  }));
}

export function getRangeBlocks(startBlock, latestBlock, step: number = 5000): { startBlock: number; endBlock: number }[] {
  let rangeBlocks = new Array();
  while (startBlock < latestBlock) {
    if (startBlock + step < latestBlock) {
      rangeBlocks.push({
        startBlock: startBlock,
        endBlock: startBlock + step,
      });
    } else {
      rangeBlocks.push({
        startBlock: startBlock,
        endBlock: startBlock + step,
      });
    }
    startBlock += step + 1;
  }
  return rangeBlocks;
}

export function generateJobName(contractName, eventsName: string[]) {
  return 'Crawler_' + contractName + '_' + join(eventsName, '_');
}

export async function combineEvents(contract: Contract, eventName: string[]) {
  let data = await Promise.all(map(eventName, async (event) => await contract.filters[event]().getTopicFilter()));
  return flatten(data) as TopicFilter;
}
