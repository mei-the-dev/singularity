import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import BlackholeBoard from './BlackholeBoard';

expect.extend({ toHaveNoViolations });

test('BlackholeBoard has no obvious accessibility violations', async () => {
  const { container } = render(<BlackholeBoard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});