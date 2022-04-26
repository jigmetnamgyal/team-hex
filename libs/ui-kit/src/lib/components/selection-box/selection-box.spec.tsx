import { render } from '@testing-library/react';

import SelectionBox from './selection-box';

describe('SelectionBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectionBox />);
    expect(baseElement).toBeTruthy();
  });
});
