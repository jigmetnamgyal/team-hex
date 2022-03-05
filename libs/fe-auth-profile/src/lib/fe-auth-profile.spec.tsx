import { render } from '@testing-library/react';

import FeAuthProfile from './fe-auth-profile';

describe('FeAuthProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeAuthProfile />);
    expect(baseElement).toBeTruthy();
  });
});
