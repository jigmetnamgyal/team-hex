import { render } from '@testing-library/react';

import MobileNavItem from './mobile-nav-item';

describe('MobileNavItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MobileNavItem />);
    expect(baseElement).toBeTruthy();
  });
});
