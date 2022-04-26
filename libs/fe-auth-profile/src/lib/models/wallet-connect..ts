export interface WalletConnectConfiguration {
  prompt: string;
  label?: string;
  icon?: JSX.Element;
}

export type WalletConnectConfigurations = Record<string, WalletConnectConfiguration>;
