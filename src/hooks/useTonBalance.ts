import useTonWalletStore from '@/stores/ton-wallet.store';
import { useCallback, useEffect, useMemo } from 'react';
import { useTonConnect } from './useTonConnect';
import { TON_DECIMALS } from '@/helper/constant';
import { useShallow } from 'zustand/react/shallow';

const useTonBalance = () => {
  const { walletAddress, tonClient } = useTonConnect();
  const [balance, isFetching, fetchTonBalance] = useTonWalletStore(
    useShallow((state) => [
      state.balance,
      state.isFetchingBalance,
      state.fetchTonBalance,
    ])
  );

  useEffect(() => {
    if (!balance && tonClient && walletAddress) {
      fetchTonBalance(tonClient, walletAddress);
    }
  }, [tonClient, walletAddress?.toString()]);

  const refetch = useCallback(async () => {
    if (tonClient && walletAddress) {
      fetchTonBalance(tonClient, walletAddress);
    }
  }, [tonClient, walletAddress?.toString()]);

  const decimals = TON_DECIMALS;

  const formattedBalance = useMemo(() => {
    return Number(balance) / 10 ** decimals;
  }, [decimals, balance]);

  return {
    balance,
    decimals,
    formattedBalance,
    refetch,
    isFetching,
  };
};

export default useTonBalance;
