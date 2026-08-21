import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('Start button opens the Menu page', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));

  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Create user' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));

  expect(
    screen.getByRole('heading', { name: 'Flashcards language learning app' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
});

test('Log in button opens the Log in page', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

  expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  expect(screen.getByRole('form', { name: 'Log in form' })).toBeInTheDocument();
  expect(screen.getByLabelText('Login')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
});

test('Create user submits the required user data', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Create user' }));
  fireEvent.change(screen.getByLabelText('Login'), {
    target: { value: 'newuser' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Create user form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: 'newuser',
      password: 'password123',
      flash_amount: 20,
      new_flash_amount: 5,
    }),
  });

  global.fetch = originalFetch;
});
