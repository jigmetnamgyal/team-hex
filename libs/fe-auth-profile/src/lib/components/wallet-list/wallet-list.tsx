import './wallet-list.module.scss';
import { MetaMaskIcon, SelectionBox } from '@team-hex/ui-kit';

/* eslint-disable-next-line */
export interface WalletListProps {}

export function WalletList(props: WalletListProps) {
  return (
    <>
      <SelectionBox leftIcon={<MetaMaskIcon />} label='Connect With MetaMask' />
      <SelectionBox leftIcon={<MetaMaskIcon />} label='Connect With MetaMask' />
    </>
  );
}

export default WalletList;
