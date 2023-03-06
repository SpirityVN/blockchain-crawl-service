import { JsonRpcProvider, WebSocketProvider } from 'ethers';
import { BSC_TESTNET_PROVIDER, SNEWS_CONTRACT_ADDRESS } from 'src/constant/network';
import { exportProviderViaURL } from 'src/_util';
import { abi as MinesweeperABI } from '../abi/Minesweeper.json';
import { MINESWEEPER_CONTRACT_ADDRESS } from './network';
import { abi as SnewsABI } from '../abi/Snews.json';

export type EventInput = {
  indexed: boolean;
  internalType: string;
  name: string;
  type: string;
};
export type ABIEvent = {
  anonymous: boolean;
  inputs: EventInput[];
  name: string;
  type: string;
};
export type ContractType = {
  [key: string]: {
    abi: any;
    address: string;
    provider: JsonRpcProvider | WebSocketProvider;
    startBlock: number;
    eventsName: string[];
  };
};

export const ContractStorage: ContractType = {
  Minesweeper: {
    abi: MinesweeperABI,
    address: MINESWEEPER_CONTRACT_ADDRESS,
    provider: exportProviderViaURL(BSC_TESTNET_PROVIDER),
    startBlock: 24697350,
    eventsName: ['BuyTurn', 'OpenCell'],
  },
  Snews: {
    abi: SnewsABI,
    address: SNEWS_CONTRACT_ADDRESS,
    provider: exportProviderViaURL(BSC_TESTNET_PROVIDER),
    startBlock: 27806075,
    eventsName: ['CreateNews'],
  },
};

export enum EContract {
  Minesweeper = 'Minesweeper',
  Snews = 'Snews',
}
