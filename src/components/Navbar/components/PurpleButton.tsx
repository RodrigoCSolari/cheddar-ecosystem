import { Button as ButtonChakra } from '@chakra-ui/react';

type Props = React.ComponentProps<typeof ButtonChakra>;

export function PurpleButton(props: Props) {
  return (
    <ButtonChakra
      border="1px solid #FFF8"
      colorScheme="purple"
      borderRadius="full"
      bg="purpleCheddar"
      size={props.size}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </ButtonChakra>
  );
}
