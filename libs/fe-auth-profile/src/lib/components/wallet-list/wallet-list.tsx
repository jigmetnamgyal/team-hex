import './wallet-list.module.scss';
import { SelectionBox } from '@team-hex/ui-kit';
import { Connector, useConnect } from 'wagmi';
import { WALLET_LIST_CONSTANTS, WalletIdEnum } from '../../constants';

/* eslint-disable-next-line */
export interface WalletListProps {
}

export function WalletList(props: WalletListProps) {
  const [{ data, error }, connect] = useConnect();
  const onConnect = async (connector: Connector<any, any>) => {
    const {data: accountData} = await connect(connector);
    // TODO: hit SF when Will's PR gets merged.
    console.log(accountData);
  };
  return (
    <>
      {data.connectors.map((connector) => (
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
