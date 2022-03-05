import './wallet-list.module.scss';
import { MetaMaskIcon, SelectionBox } from '@team-hex/ui-kit';
import { useConnect } from 'wagmi';
import { WALLET_LIST_CONSTANTS, WalletIdEnum } from '../../constants';
import { Button } from '@chakra-ui/react';

/* eslint-disable-next-line */
export interface WalletListProps {}

export function WalletList(props: WalletListProps) {
  const [{ data, error }, connect] = useConnect();
  return (
    <>
      {data.connectors.map((connector) => (
        <SelectionBox
          onButtonClick={() => connect(connector)}
          key={connector.id}
          label={WALLET_LIST_CONSTANTS[connector.id]?.prompt}
          leftIcon={WALLET_LIST_CONSTANTS[connector.id as WalletIdEnum]?.icon}/>
      ))}
    </>
  );
}

export default WalletList;
