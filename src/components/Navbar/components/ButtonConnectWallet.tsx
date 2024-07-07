import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { YellowButton } from './YellowButton';
import { yton } from '@/contracts/contractUtils';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';
import Link from 'next/link';

interface Props {
  cheddarBalanceData: bigint | null | undefined;
}

export function ButtonConnectWallet({ cheddarBalanceData }: Props) {
  const walletSelector = useWalletSelector();

  function smartTrim(string: string, maxLength: number) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return (
      string.substring(0, midpoint - lstrip) +
      '...' +
      string.substring(midpoint + rstrip)
    );
  }

  const handleOnClick = async () => {
    if (
      walletSelector.selector.isSignedIn() &&
      walletSelector.selector.wallet
    ) {
      const wallet = await walletSelector.selector.wallet();
      wallet.signOut();
    } else {
      walletSelector.modal.show();
    }
  };
  return (
    <>
      {walletSelector.selector.isSignedIn() ? (
        <Menu>
          <MenuButton
            colorScheme="yellow"
            bgColor="yellowCheddar"
            border="1px solid #3334"
            as={Button}
            borderRadius="full"
            rightIcon={<ChevronDownIcon />}
          >
            <Text mr="5px" display="inline-block">
              {cheddarBalanceData ? yton(`${cheddarBalanceData}`) : 0}
            </Text>
            <RenderCheddarIcon />
          </MenuButton>
          <MenuList
            minWidth="auto"
            p="0"
            borderRadius="full"
            bg="yellowCheddar"
          >
            <MenuItem>
              <Link
                href={`https://nearblocks.io/address/${walletSelector.accountId}`}
                target="_blank"
              >
                {smartTrim(walletSelector.accountId ?? '', 12)}
              </Link>
            </MenuItem>
            <MenuItem onClick={handleOnClick}>Log out</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <YellowButton onClick={handleOnClick}>Login</YellowButton>
      )}
    </>
  );
}
