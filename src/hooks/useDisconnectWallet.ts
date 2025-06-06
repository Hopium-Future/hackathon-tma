import useTonWalletStore from '@/stores/ton-wallet.store';
import { useTonConnectUI } from '@tonconnect/ui-react';

const useDisconnectWallet = () => {
  const [tonConnectUI] = useTonConnectUI();

  const resetTonWalletData = useTonWalletStore((state) => state.reset);

  const disconnect = async () => {
      if (tonConnectUI.connected) await tonConnectUI.disconnect();
      resetTonWalletData();
  };

  return disconnect;
};

export default useDisconnectWallet;
