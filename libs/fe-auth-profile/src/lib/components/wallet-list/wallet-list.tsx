import './wallet-list.module.scss';
import { SelectionBox } from '@team-hex/ui-kit';
import { Connector, useConnect, useSignMessage } from 'wagmi';
import { WALLET_LIST_CONSTANTS, WalletIdEnum } from '../../constants';
import axios from 'axios';

/* eslint-disable-next-line */
export interface WalletListProps {
  onConnect: (connector: Connector<any, any>) => void;
  connectors: Connector<any, any>[];
}

export function WalletList({onConnect, connectors}: WalletListProps) {
  return (
    <>
      {connectors.map((connector) => (
        <SelectionBox
          onButtonClick={() => onConnect(connector)}
          key={connector.id}
          label={WALLET_LIST_CONSTANTS[connector.id]?.prompt}
          leftIcon={WALLET_LIST_CONSTANTS[connector.id as WalletIdEnum]?.icon} />
      ))}
    </>
  );
}

export default WalletList;
