import { render } from '@testing-library/react';

import ProfileContainer from './profile-container';

describe('ProfileContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileContainer />);
    expect(baseElement).toBeTruthy();
  });
});
