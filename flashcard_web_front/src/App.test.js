import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  expect(screen.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Change settings' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Change password' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Add new flashcard' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Start learning' })).not.toBeInTheDocument();

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

test('Log in submits credentials and shows the logged-in user', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    ok: true,
    json: async () => ({ username: 'newuser', access_token: 'token' }),
  });

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  fireEvent.change(screen.getByLabelText('Login'), {
    target: { value: 'newuser' },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Log in form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'username=newuser&password=password123',
  });
  expect(
    await screen.findByText("Logged in as 'newuser'"),
  ).toBeInTheDocument();
  expect(screen.getByText('Succesful log in')).toBeInTheDocument();

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Change settings' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Change password' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add new flashcard' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Start learning' })).toBeInTheDocument();
  expect(localStorage.getItem('access_token')).toBe('token');

  fireEvent.click(screen.getByRole('button', { name: 'Change settings' }));
  expect(screen.getByRole('heading', { name: 'Change settings' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Flashcards amount'), {
    target: { value: '30' },
  });
  fireEvent.change(screen.getByLabelText('New flashcards amount'), {
    target: { value: '10' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Change settings form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:8000/user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
    body: JSON.stringify({ flash_amount: 30, new_flash_amount: 10 }),
  });
  expect(
    await screen.findByText('Settings changed successfully.'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Add new flashcard' }));
  expect(screen.getByRole('heading', { name: 'Add new flashcard' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Word'), {
    target: { value: 'hello' },
  });
  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'czesc' },
  });
  fireEvent.change(screen.getByLabelText('Topic'), {
    target: { value: 'greetings' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Add new flashcard form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
  expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:8000/flashcard/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
    body: JSON.stringify({ pol: 'hello', translate: 'czesc', topic: 'greetings' }),
  });
  expect(
    await screen.findByText('Flashcard added successfully.'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Log out' }));
  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(localStorage.getItem('access_token')).toBeNull();
  await waitFor(() => expect(
    screen.queryByRole('button', { name: 'Log out' }),
  ).not.toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  expect(screen.queryByText('Succesful log in')).not.toBeInTheDocument();

  global.fetch = originalFetch;
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
