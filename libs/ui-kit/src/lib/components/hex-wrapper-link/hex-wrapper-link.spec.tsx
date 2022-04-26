import { render } from '@testing-library/react';

import HexWrapperLink from './hex-wrapper-link';

describe('HexWrapperLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HexWrapperLink />);
    expect(baseElement).toBeTruthy();
  });
});
