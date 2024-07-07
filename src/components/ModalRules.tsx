import { getConfig } from '@/configs/config';
import { ModalContainer } from './ModalContainer';
import { ListItem, OrderedList, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRules({ isOpen, onClose }: Props) {
  const { buyCheddarInRefUrl, nadaBotUrl } = getConfig().networkData;
  return (
    <ModalContainer title={'Rules'} isOpen={isOpen} onClose={onClose}>
      <OrderedList>
        <ListItem>
          A lil NEAR and a Wallet 2 Be human via{' '}
          <Link
            href={nadaBotUrl}
            style={{ textDecoration: 'underline' }}
            target="_blank"
          >
            Nadabot
          </Link>
        </ListItem>
        <ListItem>
          Hold 555 🧀 to play, get it on{' '}
          <Link
            href={buyCheddarInRefUrl}
            style={{ textDecoration: 'underline' }}
            target="_blank"
          >
            Ref
          </Link>
        </ListItem>
        <ListItem>Click or Tap to Start</ListItem>
        <ListItem>Navigate with Arrows or Tap</ListItem>
        <ListItem>Collect Cheddar🧀</ListItem>
        <ListItem>Battle Cartel to protect your Bag</ListItem>
        <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
      </OrderedList>
    </ModalContainer>
  );
}
