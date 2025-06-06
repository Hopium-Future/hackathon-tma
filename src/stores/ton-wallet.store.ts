import { JettonWallet } from '@/web3/ton/JettonWallet';
import { Address, Cell } from '@ton/core';
import { TonClient, JettonMaster } from '@ton/ton';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { JettonConfigType } from './payment-asset.store';

type JestonData = {
  isFetching: boolean;
  userAddress?: Address;
  walletData?: {
    balance: bigint;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
  };
};

type Store = {
  jestons: Record<string, JestonData>;
  balance: bigint;
  isFetchingBalance: boolean;
  fetchJettonData: (
    tonClient: TonClient,
    symbol: string,
    walletAddress: Address,
    jettonConfig: JettonConfigType
  ) => Promise<void>;
  fetchTonBalance: (
    tonClient: TonClient,
    walletAddress: Address
  ) => Promise<void>;
  reset: () => void;
};

const useTonWalletStore = create<Store>()(
  immer((set, get) => ({
    jestons: {},
    isFetchingBalance: false,
    balance: BigInt(0),
    reset: () => {
      set({ jestons: {} });
    },
    fetchJettonData: async (
      tonClient: TonClient,
      symbol: string,
      walletAddress: Address,
      jettonConfig: JettonConfigType
    ) => {
      let existed = get().jestons[symbol];
      if (existed && existed.isFetching) {
        return;
      }

      set((state) => {
        if (!existed) {
          state.jestons[symbol] = { isFetching: true };
        } else {
          state.jestons[symbol].isFetching = true;
        }
      });

      existed = get().jestons[symbol];

      let userAddress = existed?.userAddress;
      
      const masterAddress = jettonConfig[symbol].address ;
      
      if (!userAddress) {
        const jettonMaster = tonClient.open(JettonMaster.create(masterAddress));        
        userAddress = await jettonMaster.getWalletAddress(walletAddress);
        
        set((state) => {
          state.jestons[symbol].userAddress = userAddress;
        });
      }
      const jettonWallet = tonClient.open(
        JettonWallet.createFromAddress(userAddress)
      );
      try {
        const walletData = await jettonWallet.getWalletData();

        set((state) => {
          state.jestons[symbol].walletData = walletData;
        });
      } catch (error) {
        console.error(error);
      } finally {
        set((state) => {
          state.jestons[symbol].isFetching = false;
        });
      }
    },
    fetchTonBalance: async (tonClient: TonClient, walletAddress: Address) => {
      if (get().isFetchingBalance) {
        return;
      }
      set({ isFetchingBalance: true });
      try {
        const balance = await tonClient.getBalance(walletAddress);
        set({ balance });
      } catch (error) {
        console.error(error);
      } finally {
        set({ isFetchingBalance: false });
      }
    },
  }))
);

export default useTonWalletStore;
