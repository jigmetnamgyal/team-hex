import './layout.module.scss';
import {
  Box,
  Button,
  Collapse,
  Flex,
  IconButton,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import Link from 'next/link';
import { GiHamburgerMenu as HamburgerIcon } from 'react-icons/gi';
import { IoMdClose as CloseIcon } from 'react-icons/io';
import { ReactNode } from 'react';
import DesktopNav from '../desktop-nav/desktop-nav';
import { NavigationItems } from '../../models';
import MobileNav from '../mobile-nav/mobile-nav';


/* eslint-disable-next-line */
export interface LayoutProps {
  children: ReactNode;
  navigationItems: NavigationItems;
}

export function Layout({children, navigationItems}: LayoutProps) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon size={3} /> : <HamburgerIcon size={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}>
            Logo
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav navigationItems={navigationItems}/>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}>
            Sign In
          </Button>
          <Link href='/'>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            _hover={{
              bg: 'pink.300'
            }}>
            Sign Up
          </Button>
          </Link>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navigationItems={navigationItems} />
      </Collapse>
      {children}
    </Box>
  );
}
const NAV_ITEMS: NavigationItems= [
  {
    label: 'Inspiration',
    href: '#'
  },
  {
    label: 'Find Work',
    href: '#'
  },
  {
    label: 'Learn Design',
    href: '#'
  },
  {
    label: 'Hire Designers',
    href: '#'
  }
];

export default Layout;
