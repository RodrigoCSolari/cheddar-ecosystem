export interface Config {
  networkData: {
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
    buyCheddarInRefUrl: string;
    nadaBotUrl: string;
    nftImageBaseUrl: string;
  };
  contracts: {
    cheddarNft: string;
    cheddarToken: string;
    nearSocial: string;
  };
  socialKeys: {
    ecosystem: string;
    mazeVersion: string;
  };
  backendBaseUrl: string;
}

export const getConfig = (): Config => {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';
  switch (network) {
    case 'mainnet':
      return {
        networkData: {
          networkId: 'mainnet',
          nodeUrl: 'https://rpc.mainnet.near.org',
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org',
          explorerUrl: 'https://explorer.mainnet.near.org',
          buyCheddarInRefUrl:
            'https://app.ref.finance/#near|token.cheddar.near',
          nadaBotUrl: 'https://app.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          cheddarNft: 'nft.cheddar.near',
          cheddarToken: 'token.cheddar.near',
          nearSocial: 'social.near',
        },
        socialKeys: {
          ecosystem: 'cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3002/',
      };
    case 'testnet':
      return {
        networkData: {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.near.org',
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
          buyCheddarInRefUrl:
            'https://testnet.ref.finance/#near|token.cheddar.testnet',
          nadaBotUrl: 'https://testnet.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          cheddarNft: 'nft.cheddar.testnet',
          cheddarToken: 'token-v3.cheddar.testnet',
          nearSocial: 'v1.social08.testnet',
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3001/',
      };
    case 'local':
      return {
        networkData: {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.near.org',
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
          buyCheddarInRefUrl:
            'https://testnet.ref.finance/#near|token.cheddar.testnet',
          nadaBotUrl: 'https://testnet.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          cheddarNft: 'nft.cheddar.testnet',
          cheddarToken: 'token-v3.cheddar.testnet',
          nearSocial: 'v1.social08.testnet',
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'http://localhost:3001/',
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.js.`
      );
  }
};
