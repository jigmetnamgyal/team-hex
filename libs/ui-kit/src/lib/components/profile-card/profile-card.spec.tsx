import { render } from '@testing-library/react';

import ProfileCard from './profile-card';

describe('ProfileCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileCard />);
    expect(baseElement).toBeTruthy();
  });
});
