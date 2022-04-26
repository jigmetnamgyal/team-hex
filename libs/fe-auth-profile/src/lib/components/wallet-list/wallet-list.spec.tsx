import { render } from '@testing-library/react';

import WalletList from './wallet-list';

describe('WalletList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WalletList />);
    expect(baseElement).toBeTruthy();
  });
});
