export interface NavigationItem {
  label: string;
  href: string;
  value?: string;
  show?: boolean;
}

export type NavigationItems = NavigationItem[];
