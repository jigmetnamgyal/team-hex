import { MetaMaskIcon } from '@team-hex/ui-kit';
import { WalletConnectConfigurations } from '../models/wallet-connect.';

export enum WalletIdEnum {
  MetaMask = 'injected',
  WalletConnect = 'walletConnect',
  Coinbase = 'walletLink'
}
export const WALLET_LIST_CONSTANTS: WalletConnectConfigurations = {
  [WalletIdEnum.MetaMask]: {
    icon: <MetaMaskIcon />,
    label: 'MetaMask',
    prompt: 'Connect With MetaMask'
  },
  [WalletIdEnum.WalletConnect]: {
    label: 'WalletConnect',
    prompt: 'Connect With WalletConnect'
  },
  [WalletIdEnum.Coinbase]: {
    label: 'Coinbase',
    prompt: 'Connect With Coinbase'
  }
}
