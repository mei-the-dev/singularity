import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import BlackholeBackground from './BlackholeBackground';

test('renders BlackholeBackground', () => {
  render(<BlackholeBackground />);
  const el = screen.getByTestId('blackhole-bg');
  expect(el).toBeInTheDocument();
});