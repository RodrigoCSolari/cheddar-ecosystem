import { Button as ButtonChakra } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof ButtonChakra>;

export function WhiteButton(props: Props) {
  return (
    <ButtonChakra
      border="1px solid #3334"
      colorScheme="yellow"
      borderRadius="full"
      bg="white"
      size={props.size}
      onClick={props.onClick}
      _hover={{ bg: 'yellowCheddar' }}
    >
      {props.children}
    </ButtonChakra>
  );
}
