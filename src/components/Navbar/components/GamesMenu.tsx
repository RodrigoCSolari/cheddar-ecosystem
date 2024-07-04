import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Img,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import checkersIcon from '../../../assets/checkers-icon.png';
import gamepadIcon from '../../../assets/gamepad-icon.svg';
import cheddarIcon from '../../../assets/cheddar-icon.svg';

export default function GamesMenu() {
  return (
    <Menu>
      <MenuButton
        bgColor="white"
        border="1px solid #3334"
        as={Button}
        borderRadius="full"
        rightIcon={<ChevronDownIcon />}
      >
        Play
      </MenuButton>
      <MenuList minWidth="auto">
        <MenuItem
          as={Link}
          href="https://draw.cheddar.farm"
          target="_blank"
          _hover={{ bg: 'yellowCheddar' }}
          _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        >
          Draw
          <Text fontSize="1.2em" ml="8px">
            🎨
          </Text>
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://vps179324.iceservers.net/"
          target="_blank"
          _hover={{ bg: 'yellowCheddar' }}
          _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        >
          CoinFlip
          <Box minW="30px" ml="8px">
            <Img src={cheddarIcon} alt="" width="30px" height="30px" />
          </Box>
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://checkers.cheddar.farm/"
          target="_blank"
          _hover={{ bg: 'yellowCheddar' }}
          _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        >
          Checkers
          <Box minW="30px" ml="10px">
            <Img
              src={'assets/checkers-icon.png'}
              alt=""
              width="24px"
              height="24px"
            />
          </Box>
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://nearhub.club/cdcUv8P/cheddar-farm"
          target="_blank"
          _hover={{ bg: 'yellowCheddar' }}
          _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
          _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        >
          VrFarm
          <Box minW="30px" ml="10px">
            <Img src={gamepadIcon} alt="" width="24px" height="24px" />
          </Box>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
