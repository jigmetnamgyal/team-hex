import './mobile-nav.module.scss';
import { Stack, useColorModeValue } from '@chakra-ui/react';
import { NavigationItems } from '../../models';
import MobileNavItem from '../mobile-nav-item/mobile-nav-item';

/* eslint-disable-next-line */
export interface MobileNavProps {
  navigationItems: NavigationItems;
}

export function MobileNav({ navigationItems }: MobileNavProps) {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {navigationItems.map((navItem) => (
        <MobileNavItem key={navItem.label} navItem={navItem} />
      ))}
    </Stack>
  );
}

export default MobileNav;
