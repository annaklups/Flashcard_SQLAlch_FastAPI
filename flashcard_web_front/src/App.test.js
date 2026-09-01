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
  expect(screen.queryByRole('button', { name: 'Delete user' })).not.toBeInTheDocument();
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
    json: async () => ({
      username: 'newuser',
      access_token: 'token',
      flash_amount: 3,
      new_flash_amount: 1,
    }),
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
  expect(screen.getByRole('button', { name: 'Delete user' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add new flashcard' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Start learning' })).toBeInTheDocument();
  expect(localStorage.getItem('access_token')).toBe('token');

  fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));
  expect(screen.getByRole('heading', { name: 'Learning' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Start session' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Start session' }));
  expect(screen.getByText('Card 1 / 3')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Change settings' }));
  expect(screen.getByRole('heading', { name: 'Change settings' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Flashcards amount'), {
    target: { value: '30' },
  });
  fireEvent.change(screen.getByLabelText('New flashcards amount'), {
    target: { value: '10' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Change settings form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
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

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(4));
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

  fireEvent.click(screen.getByRole('button', { name: 'Change password' }));
  expect(screen.getByRole('heading', { name: 'Change password' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Current password'), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText('New password'), {
    target: { value: 'newpassword123' },
  });
  fireEvent.change(screen.getByLabelText('Confirm new password'), {
    target: { value: 'newpassword123' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Change password form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(5));
  expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:8000/user/update_pass', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
    body: JSON.stringify({
      old_password: 'password123',
      new_password1: 'newpassword123',
      new_password2: 'newpassword123',
    }),
  });
  expect(
    await screen.findByText('Password changed successfully.'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Delete user' }));
  expect(screen.getByRole('heading', { name: 'Delete user' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Current password'), {
    target: { value: 'password123' },
  });
  fireEvent.change(screen.getByLabelText('Confirm current password'), {
    target: { value: 'password123' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Delete user form' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(6));
  expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:8000/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
    body: JSON.stringify({ old_password1: 'password123', old_password2: 'password123' }),
  });
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument());
  expect(screen.queryByText("Logged in as 'newuser'")).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Delete user' })).not.toBeInTheDocument();
  expect(localStorage.getItem('access_token')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
  expect(screen.queryByText('Succesful log in')).not.toBeInTheDocument();

  global.fetch = originalFetch;
});

test('shows session completion prompt and lets the user start a new session or go back to menu', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn((url, options) => {
    if (url === 'http://localhost:8000/login') {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: async () => ({
          username: 'newuser',
          access_token: 'token',
          user_id: 1,
          flash_amount: 3,
          new_flash_amount: 2,
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/?is_new=true') {
      const callCount = global.fetch.mock.calls.filter(
        ([requestedUrl]) => requestedUrl === 'http://localhost:8000/learning/?is_new=true',
      ).length;

      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: callCount,
          pol: `word${callCount}`,
          translate: `translation${callCount}`,
          topic: 'greetings',
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/?is_new=false') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: 3,
          pol: 'word3',
          translate: 'translation3',
          topic: 'greetings',
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/answer') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: 1,
          pol: 'word1',
          translate: 'translation1',
          wage_change: -1,
        }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    });
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

  await waitFor(() => expect(screen.getByText("Logged in as 'newuser'")).toBeInTheDocument());
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start session' }));

  await waitFor(() => expect(screen.getByText('word1')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'translation1' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Learning form' }));

  await waitFor(() => expect(screen.getByText('Correct answer.')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Next card' }));

  await waitFor(() => expect(screen.getByText('word2')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'translation2' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Learning form' }));

  await waitFor(() => expect(screen.getByText('Correct answer.')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Next card' }));

  await waitFor(() => expect(screen.getByText('word3')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/learning/?is_new=false', {
    headers: { Authorization: 'Bearer token' },
  });

  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'translation3' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Learning form' }));

  await waitFor(() => expect(screen.getByText('Session completed')).toBeInTheDocument());
  expect(screen.getByText('Do you want to start next session?')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'No' }));
  expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument();

  global.fetch = originalFetch;
});

test('learning session starts with new cards and then switches to old cards', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn((url, options) => {
    if (url === 'http://localhost:8000/login') {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: async () => ({
          username: 'newuser',
          access_token: 'token',
          user_id: 1,
          flash_amount: 3,
          new_flash_amount: 2,
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/?is_new=true') {
      const callCount = global.fetch.mock.calls.filter(
        ([requestedUrl]) => requestedUrl === 'http://localhost:8000/learning/?is_new=true',
      ).length;

      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: callCount,
          pol: `word${callCount}`,
          translate: `translation${callCount}`,
          topic: 'greetings',
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/?is_new=false') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: 3,
          pol: 'word3',
          translate: 'translation3',
          topic: 'greetings',
        }),
      });
    }

    if (url === 'http://localhost:8000/learning/answer') {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          flash_num: 1,
          pol: 'word1',
          translate: 'translation1',
          wage_change: -1,
        }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({}),
    });
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

  await waitFor(() => expect(screen.getByText("Logged in as 'newuser'")).toBeInTheDocument());
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  fireEvent.click(screen.getByRole('button', { name: 'Start learning' }));
  fireEvent.click(screen.getByRole('button', { name: 'Start session' }));

  await waitFor(() => expect(screen.getByText('word1')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/learning/?is_new=true', {
    headers: { Authorization: 'Bearer token' },
  });

  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'translation1' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Learning form' }));

  await waitFor(() => expect(screen.getByText('Correct answer.')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Next card' }));

  await waitFor(() => expect(screen.getByText('word2')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/learning/?is_new=true', {
    headers: { Authorization: 'Bearer token' },
  });

  fireEvent.change(screen.getByLabelText('Translation'), {
    target: { value: 'translation2' },
  });
  fireEvent.submit(screen.getByRole('form', { name: 'Learning form' }));

  await waitFor(() => expect(screen.getByText('Correct answer.')).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: 'Next card' }));

  await waitFor(() => expect(screen.getByText('word3')).toBeInTheDocument());
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/learning/?is_new=false', {
    headers: { Authorization: 'Bearer token' },
  });

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
