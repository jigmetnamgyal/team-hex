export interface NavigationItem {
  label: string;
  href: string;
  value?: string;
  show?: boolean;
}

export enum ToastConfigs {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export type NavigationItems = NavigationItem[];
