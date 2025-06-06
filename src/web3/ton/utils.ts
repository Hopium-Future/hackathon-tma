import {
  Address,
  TonClient,
  Transaction,
} from '@ton/ton';

interface WaitForTransactionOptions {
  walletAddress: Address;
  refetchInterval?: number;
  refetchLimit?: number;
  queryId: number
}

export const waitForTransaction = async (
  options: WaitForTransactionOptions,
  client: TonClient
): Promise<Transaction | null> => {
  const { refetchInterval = 1000, refetchLimit, walletAddress, queryId } = options;

  return new Promise((resolve) => {
    let refetches = 0;
    const interval = setInterval(async () => {
      refetches += 1;

      console.log('waiting transaction...');
      try {
        const state = await client.getContractState(walletAddress);
        if (!state || !state.lastTransaction) {
          clearInterval(interval);
          resolve(null);
          return;
        }
        const lastLt = state.lastTransaction.lt;
        const lastHash = state.lastTransaction.hash;
        const lastTx = await client.getTransaction(
          walletAddress,
          lastLt,
          lastHash
        );

        if (lastTx && lastTx.inMessage) {
          const slice = lastTx.inMessage.body.beginParse();
          const opcode = slice.loadUint(32);
          const txQueryId = slice.loadUintBig(64);
          console.log(opcode);
          if (Number(txQueryId) === queryId) {
            clearInterval(interval);
            resolve(lastTx);
          }
        }
        if (refetchLimit && refetches >= refetchLimit) {
          clearInterval(interval);
          resolve(null);
        }
      } catch (error) {
        console.warn('Error while waiting for transaction', error);
      }
    }, refetchInterval);
  });
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number }
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await delay(options.delay);
    }
  }
  throw lastError;
}