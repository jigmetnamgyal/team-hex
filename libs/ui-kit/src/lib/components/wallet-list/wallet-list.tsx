import { Text, Button, Center } from '@chakra-ui/react';
import './wallet-list.module.scss';

/* eslint-disable-next-line */
export interface WalletListProps {}

export function WalletList(props: WalletListProps) {
  return (
    <Center p={8}>
      <Button
        w={'full'}
        maxW={'md'}
        variant={'outline'}
        >
        <Center>
          <Text>Sign in with Google</Text>
        </Center>
      </Button>
    </Center>
  );
}

export default WalletList;
