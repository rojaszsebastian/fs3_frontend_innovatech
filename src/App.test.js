import { render } from '@testing-library/react';
import App from './App';

test('renders dashboard without crashing', () => {
  render(<App />);
});