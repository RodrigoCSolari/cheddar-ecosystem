import { Button as ButtonChakra } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof ButtonChakra>;

export function YellowButton(props: Props) {
  return (
    <ButtonChakra
      border="1px solid #FFF8"
      colorScheme="yellow"
      borderRadius="full"
      bg="yellowCheddar"
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </ButtonChakra>
  );
}
