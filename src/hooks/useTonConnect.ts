import { useContext, useMemo } from 'react';
import { TonClient } from '@ton/ton';
import { CHAIN, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { Address, Sender, SenderArguments } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui';
import { TonClientContext } from '@/context/ton-client-context';
import useUserStore from '@/stores/user.store';

export const useTonConnect = (): {
  sender: Sender;
  connected: boolean;
  walletAddress: Address | null;
  network: CHAIN | null;
  tonConnectUI: TonConnectUI;
  tonClient: TonClient | undefined;
} => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { tonClient } = useContext(TonClientContext);
  const walletAddress = wallet?.account?.address
    ? Address.parse(wallet.account.address)
    : undefined;
  const { user } = useUserStore();
  const connected = useMemo(() => {
    if (!wallet?.account?.address || !user?.tonAddress) return false;

    const sameAddress = Address.parse(wallet?.account?.address).toString() === Address.parse(user?.tonAddress).toString();
    if (tonConnectUI.connected && sameAddress) return true;
    return false;
  }, [wallet, user, tonConnectUI.connected]);
  return {
    sender: {
      send: async (args: SenderArguments): Promise<any> => {
        const result = await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc()?.toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
        console.log('Transaction result:', result);
        return result;
      },
      address: walletAddress,
    },

    connected: connected,
    walletAddress: walletAddress ?? null,
    network: wallet?.account?.chain ?? null,
    tonConnectUI,
    tonClient,
  };
};
