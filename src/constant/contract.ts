import { JsonRpcProvider, WebSocketProvider } from 'ethers';
import { BSC_TESTNET_PROVIDER } from 'src/constant/network';
import { exportProviderViaURL } from 'src/_util';
import { abi as MinesweeperABI } from '../abi/Minesweeper.json';
import { MINESWEEPER_CONTRACT_ADDRESS } from './network';

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
};

export enum EContract {
  Minesweeper = 'Minesweeper',
}
