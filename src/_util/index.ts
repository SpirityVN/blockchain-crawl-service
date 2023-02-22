import { JsonRpcProvider, Result, WebSocketProvider } from 'ethers';
export function transformArgsEvent(values: Result, keys: any[]) {
  let args = {};

  if (values.length !== keys.length) return;
  keys.forEach((key, i) => {
    args[key] = values[i];
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
