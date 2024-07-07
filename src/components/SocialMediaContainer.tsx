import { Box, Img, Link } from '@chakra-ui/react';

export const SocialMedia = () => {
  return (
    <Box display="flex" justifyContent="center" mt="20px">
      <Link
        p="16px 24px"
        display="flex"
        href="https://t.me/cheddarfarm"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/telegram.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        p="16px 24px"
        display="flex"
        href="https://discord.com/invite/G9PTbmPUwe"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/discord.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        p="16px 24px"
        display="flex"
        href="https://twitter.com/CheddarFi"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/twitter.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>

      <Link
        p="16px 24px"
        display="flex"
        href="https://cheddarfarm.gitbook.io/docs"
        target="_blank"
        _hover={{ bg: 'yellowCheddar' }}
        _active={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
        _focus={{ textDecoration: 'none', boxShadow: '0 0 0 0 #0000' }}
      >
        <Box minW="30px" ml="5px">
          <Img src={'/assets/gitbook.svg'} alt="" width="24px" height="24px" />
        </Box>
      </Link>
    </Box>
  );
};
