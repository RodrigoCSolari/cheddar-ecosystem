import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  getCheddarBalance,
  getCheddarMetadata,
  getCheddarNFTBuyPrice,
  getNFTs,
  getTotalSupply,
} from '@/contracts/cheddarCalls';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

// USE IN REACT COMPONENT
// const { data: cheddarBalanceData, isLoading: isLoadingCheddarBalance, refetch as void=> () } = useGetCheddarBalance();
export const useGetCheddarBalance = (): UseQueryResult<null | bigint> => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetCheddarBalance', accountId],
    queryFn: () => (accountId ? getCheddarBalance(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

// USE IN REACT COMPONENT
// const { data: cheddarMetadata, isLoading: isLoadingCheddarMetadata, refetch as void=> () } = useGetCheddarMetadata();
export const useGetCheddarMetadata = (): UseQueryResult => {
  return useQuery({
    queryKey: ['useGetCheddarMetadata'],
    queryFn: () => getCheddarMetadata(),
    refetchInterval: Infinity,
    staleTime: Infinity,
  });
};

// USE IN REACT COMPONENT
// const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs, refetch as void=> () } = useGetCheddarNFTs();
export const useGetCheddarNFTs = (): UseQueryResult => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetCheddarNFTs', accountId],
    queryFn: () => (accountId ? getNFTs(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarTotalSupply = (): UseQueryResult<bigint> => {
  return useQuery({
    queryKey: ['useGetCheddarTotalSupply'],
    queryFn: () => getTotalSupply(),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarNFTPrice = (
  withCheddar: boolean
): UseQueryResult<string | null> => {
  const { accountId } = useWalletSelector();

  return useQuery<string | null>({
    queryKey: ['useGetCheddarNFTs', accountId, withCheddar],
    queryFn: () =>
      accountId ? getCheddarNFTBuyPrice(accountId, withCheddar) : null,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};
