import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders Pura Bhakti Archive link', () => {
  const { getAllByText } = render(<App />);
  const elements = getAllByText(/pure bhakti/i);
  elements.forEach((element) => expect(element).toBeInTheDocument());
});
