import { render } from '@testing-library/react';

import DesktopNav from './desktop-nav';

describe('DesktopNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DesktopNav navigationItems={[]}/>);
    expect(baseElement).toBeTruthy();
  });
});
