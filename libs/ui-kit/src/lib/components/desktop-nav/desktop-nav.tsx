import './desktop-nav.module.scss';
import { Box, Link, Popover, PopoverTrigger, Stack, useColorModeValue } from '@chakra-ui/react';
import { NavigationItems } from '../../models';

/* eslint-disable-next-line */
export interface DesktopNavProps {
  navigationItems: NavigationItems;
}

export function DesktopNav({ navigationItems }: DesktopNavProps) {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  return (
    <Stack direction={'row'} spacing={4}>
      {navigationItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>
          </Popover>
        </Box>
      ))}
    </Stack>
  );
}

export default DesktopNav;
