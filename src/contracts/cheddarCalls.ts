import { getConfig } from '@/configs/config';
import { view } from './contractUtils';
import { Metadata } from './CheddarToken';
import { NFT } from './nftCheddarContract';
import { Wallet } from '@near-wallet-selector/core';

const { cheddarToken, cheddarNft } = getConfig().contracts;

const tokenViewMethods = {
  ftBalanceOf: 'ft_balance_of',
  ftMetadata: 'ft_metadata',
  ftTotalSupply: 'ft_total_supply',
};

const nftViewMethods = {
  nftTokensForOwner: 'nft_tokens_for_owner',
  nftMintOne: 'nft_mint_one',
};

export const getCheddarBalance = async (accountId: string): Promise<bigint> => {
  return view(cheddarToken, tokenViewMethods.ftBalanceOf, {
    account_id: accountId,
  }).then(BigInt);
};

export const getTotalSupply = async (): Promise<bigint> => {
  return view(cheddarToken, tokenViewMethods.ftTotalSupply).then(BigInt);
};

export const getCheddarMetadata = async (): Promise<Metadata> => {
  return view(cheddarToken, tokenViewMethods.ftMetadata);
};

export const getNFTs = async (accountId: string): Promise<NFT[]> => {
  return view(cheddarNft, nftViewMethods.nftTokensForOwner, {
    account_id: accountId,
  });
};

export const buyNFT = async (
  wallet: Wallet,
  withCheddar: boolean,
  amount: string
): Promise<any> => {
  const tokenCheddarContractId = getConfig().contracts.cheddarToken;
  if (withCheddar) {
    return wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: tokenCheddarContractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'ft_transfer_call',
                args: {
                  receiver_id: cheddarNft,
                  amount,
                  msg: '',
                },
                gas: '300' + '0'.repeat(12),
                deposit: '1',
              },
            },
          ],
        },
        {
          receiverId: cheddarNft,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'nft_mint_one',
                args: { with_cheddar: true },
                gas: '300' + '0'.repeat(12),
                deposit: '1' + '0'.repeat(21),
              },
            },
          ],
        },
      ],
    });
  } else {
    return wallet.signAndSendTransaction({
      receiverId: cheddarNft,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'nft_mint_one',
            args: { with_cheddar: false },
            gas: '300' + '0'.repeat(12),
            deposit: amount,
          },
        },
      ],
    });
  }
};

export const getCheddarNFTBuyPrice = (
  accountId: string,
  withCheddar: boolean
): Promise<string> => {
  return view(cheddarNft, 'total_cost', {
    num: 1,
    minter: accountId,
    with_cheddar: withCheddar,
  });
};
