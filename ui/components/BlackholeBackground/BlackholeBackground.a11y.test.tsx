import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import BlackholeBackground from './BlackholeBackground';

expect.extend({ toHaveNoViolations });

test('BlackholeBackground has no obvious accessibility violations', async () => {
  const { container } = render(<BlackholeBackground />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});