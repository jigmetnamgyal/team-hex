import './mobile-nav-item.module.scss';
import { Flex, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { NavigationItem } from '../../models';

/* eslint-disable-next-line */
export interface MobileNavItemProps {
  navItem: NavigationItem;
}

export function MobileNavItem({ navItem }: MobileNavItemProps) {
  const { label, href } = navItem;
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none'
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
      </Flex>
    </Stack>
  );
}

export default MobileNavItem;
