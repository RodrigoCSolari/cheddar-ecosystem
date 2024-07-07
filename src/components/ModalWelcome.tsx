import { HStack, Image, Text } from '@chakra-ui/react';
import { ModalContainer } from './ModalContainer';
import { useEffect, useState } from 'react';

export default function ModalWelcome() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const welcomeModalWasShown = localStorage.getItem('welcomeModalWasShown');
    if (welcomeModalWasShown === null) {
      localStorage.setItem('welcomeModalWasShown', 'true');
      setShowWelcomeModal(true);
    }
  }, []);

  return (
    <ModalContainer
      isOpen={showWelcomeModal}
      onClose={() => setShowWelcomeModal(false)}
      title=""
      hideButtons
      bgColor="#8542eb"
      border="10px solid white"
      color={'white'}
      fontSize="16px"
      fontWeight="600"
    >
      <Image
        src="assets/cheddar-logo.png"
        alt="cheddar logo with text"
        mb="30px"
      />
      <Text>
        More than a loyalty token, it&apos;s a freedom movement. We empower
        communities to farm, connect, and grow, through a fun Web3 experience.
        Cheddar brings good vibes and breaks down barriers
      </Text>
      <HStack justifyContent="space-between">
        <Text alignSelf="start">- join the movement!</Text>
        <Image src="assets/cheddar-mouse.png" alt="cheddar mouse" w="120px" />
      </HStack>
    </ModalContainer>
  );
}
