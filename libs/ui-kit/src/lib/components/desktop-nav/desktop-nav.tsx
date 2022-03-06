import './desktop-nav.module.scss';
import Link from 'next/link';
import { Box, Link as ChakraLink, Popover, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { NavigationItems } from '../../models';
import React from 'react';
import HexWrapperLink from '../hex-wrapper-link/hex-wrapper-link';

/* eslint-disable-next-line */
export interface DesktopNavProps {
  navigationItems: NavigationItems;
}

const MintCheckLink = React.forwardRef((props: any, ref) => (
  <ChakraLink href={props.href} ref={ref} {...props}>
    {props.label}
  </ChakraLink>
))

export function DesktopNav({ navigationItems }: DesktopNavProps) {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  return (
    <Stack direction={'row'} spacing={4}>
      {navigationItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link passHref href={navItem.href}>
                <HexWrapperLink
                  p={2}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor
                  }}
                  label={navItem.label}
                />
              </Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
}

export default DesktopNav;
