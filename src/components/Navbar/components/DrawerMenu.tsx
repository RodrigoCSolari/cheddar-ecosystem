import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { RenderCheddarIcon } from '@/components/RenderCheddarIcon';
import { SocialMedia } from '@/components/SocialMediaContainer';
import { yton } from '@/contracts/contractUtils';
import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContextProvider';

interface Props {
  onOpenVideoModal: () => void;
  cheddarTotalSupply: bigint | undefined;
  isLoadingCheddarTotalSupply: boolean;
}

export function DrawerMenu({
  onOpenVideoModal,
  cheddarTotalSupply,
  isLoadingCheddarTotalSupply,
}: Props) {
  const { onOpenScoreboard } = useContext(GameContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Menu"
        border="1px solid #3334"
        colorScheme="yellow"
        bg="yellowCheddar"
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
            _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap="0.5rem" px="0">
            <Button colorScheme="blue" onClick={onOpenVideoModal}>
              🎶
            </Button>
            <Button onClick={onOpenScoreboard}>Scoreboard</Button>
          </DrawerBody>

          <DrawerFooter
            flexDirection="column"
            borderTopWidth="1px"
            justifyContent="space-around"
          >
            <SocialMedia />
            <Text display="flex" justifyContent="space-between" w="100%">
              <Text as="i">
                Total supply:{' '}
                {isLoadingCheddarTotalSupply
                  ? 'Loading'
                  : new Intl.NumberFormat('de-DE', {
                      maximumFractionDigits: 0,
                    }).format(yton(cheddarTotalSupply!))}{' '}
                <RenderCheddarIcon />
              </Text>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
