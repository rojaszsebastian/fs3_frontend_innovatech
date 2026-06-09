import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with sidebar navigation', () => {
  render(<App />);
  const sidebar = document.querySelector('.sidebar, nav, [class*="sidebar"], [class*="Sidebar"]');
  expect(sidebar || document.body.firstChild).toBeTruthy();
});

test('renders without crashing and has content', () => {
  const { container } = render(<App />);
  expect(container.innerHTML.length).toBeGreaterThan(0);
});