import { render, screen } from '@testing-library/react';
import App from '../../client/src/App';

describe('App Component', () => {
  test('renders the dashboard', () => {
    render(<App />);
    const dashboardElement = screen.getByText(/dashboard/i);
    expect(dashboardElement).toBeInTheDocument();
  });
});