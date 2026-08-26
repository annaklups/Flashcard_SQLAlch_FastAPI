import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const [createUserForm, setCreateUserForm] = useState({
    login: '',
    password: '',
    flash_amount: 20,
    new_flash_amount: 5,
  });
  const [createUserStatus, setCreateUserStatus] = useState('');
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loggedInUser, setLoggedInUser] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [settingsForm, setSettingsForm] = useState({
    flash_amount: 20,
    new_flash_amount: 5,
  });
  const [settingsStatus, setSettingsStatus] = useState('');
  const [flashcardForm, setFlashcardForm] = useState({
    pol: '',
    translate: '',
    topic: '',
  });
  const [flashcardStatus, setFlashcardStatus] = useState('');

  useEffect(() => {
    if (loginStatus !== 'Succesful log in') {
      return undefined;
    }

    const redirectTimer = setTimeout(() => setPage('menu'), 3000);
    return () => clearTimeout(redirectTimer);
  }, [loginStatus]);

  const handleCreateUserChange = (event) => {
    const { name, value } = event.target;
    setCreateUserForm((currentForm) => ({
      ...currentForm,
      [name]: name.includes('amount') ? Number(value) : value,
    }));
  };

  const handleCreateUserSubmit = async (event) => {
    event.preventDefault();
    setCreateUserStatus('');

    try {
      const response = await fetch('http://localhost:8000/user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserForm),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to create user.');
      }

      setCreateUserStatus('User created successfully.');
    } catch (error) {
      setCreateUserStatus(error.message);
    }
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginStatus('');

    try {
      const requestBody = new URLSearchParams({
        username: loginForm.login,
        password: loginForm.password,
      });
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody.toString(),
      });
      const responseBody = await response.json();

      if (response.status !== 200) {
        throw new Error(responseBody.detail || 'Unable to log in.');
      }

      setLoggedInUser(responseBody.username);
      localStorage.setItem('access_token', responseBody.access_token);
      setLoginStatus('Succesful log in');
    } catch (error) {
      setLoginStatus(error.message);
    }
  };

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettingsForm((currentForm) => ({
      ...currentForm,
      [name]: Number(value),
    }));
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setSettingsStatus('');

    try {
      const response = await fetch('http://localhost:8000/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(settingsForm),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to change settings.');
      }

      setSettingsStatus('Settings changed successfully.');
    } catch (error) {
      setSettingsStatus(error.message);
    }
  };

  const handleFlashcardChange = (event) => {
    const { name, value } = event.target;
    setFlashcardForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleFlashcardSubmit = async (event) => {
    event.preventDefault();
    setFlashcardStatus('');

    try {
      const response = await fetch('http://localhost:8000/flashcard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(flashcardForm),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to add flashcard.');
      }

      setFlashcardStatus('Flashcard added successfully.');
      setFlashcardForm({ pol: '', translate: '', topic: '' });
    } catch (error) {
      setFlashcardStatus(error.message);
    }
  };

  return (
    <div className="App">
      {loggedInUser && (
        <div className="Login-status">
          Logged in as '{loggedInUser}'
        </div>
      )}
      <header className="App-header">
        {page === 'home' ? (
          <>
            <h1>Flashcards language learning app</h1>
            <button
              className="Start-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Start
            </button>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <p className="App-testing-app">Testing APP</p>
          </>
        ) : page === 'menu' ? (
          <>
            <h1>Menu</h1>
            <button
              className="Menu-button"
              type="button"
              onClick={() => {
                setCreateUserStatus('');
                setPage('create-user');
              }}
            >
              Create user
            </button>
            <button
              className="Menu-button"
              type="button"
              onClick={() => setPage('login')}
            >
              Log in
            </button>
            {loggedInUser && (
              <>
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    setSettingsStatus('');
                    setPage('settings');
                  }}
                >
                  Change settings
                </button>
                <button className="Menu-button" type="button">
                  Change password
                </button>
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    setFlashcardStatus('');
                    setPage('add-flashcard');
                  }}
                >
                  Add new flashcard
                </button>
                <button className="Menu-button" type="button">
                  Start learning
                </button>
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    setLoggedInUser('');
                    setLoginStatus('');
                  }}
                >
                  Log out
                </button>
              </>
            )}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('home')}
            >
              Back
            </button>
          </>
        ) : page === 'settings' ? (
          <>
            <h1>Change settings</h1>
            <form
              className="Settings-form"
              aria-label="Change settings form"
              onSubmit={handleSettingsSubmit}
            >
              <label>
                Flashcards amount
                <input
                  name="flash_amount"
                  type="number"
                  min="1"
                  required
                  value={settingsForm.flash_amount}
                  onChange={handleSettingsChange}
                />
              </label>
              <label>
                New flashcards amount
                <input
                  name="new_flash_amount"
                  type="number"
                  min="0"
                  required
                  value={settingsForm.new_flash_amount}
                  onChange={handleSettingsChange}
                />
              </label>
              <button
                className="Menu-button Settings-submit"
                type="submit"
              >
                Save settings
              </button>
            </form>
            {settingsStatus && <p role="status">{settingsStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Back
            </button>
          </>
        ) : page === 'add-flashcard' ? (
          <>
            <h1>Add new flashcard</h1>
            <form
              className="Flashcard-form"
              aria-label="Add new flashcard form"
              onSubmit={handleFlashcardSubmit}
            >
              <label>
                Word
                <input
                  name="pol"
                  type="text"
                  required
                  value={flashcardForm.pol}
                  onChange={handleFlashcardChange}
                />
              </label>
              <label>
                Translation
                <input
                  name="translate"
                  type="text"
                  required
                  value={flashcardForm.translate}
                  onChange={handleFlashcardChange}
                />
              </label>
              <label>
                Topic
                <input
                  name="topic"
                  type="text"
                  required
                  value={flashcardForm.topic}
                  onChange={handleFlashcardChange}
                />
              </label>
              <button
                className="Menu-button Flashcard-submit"
                type="submit"
              >
                Add flashcard
              </button>
            </form>
            {flashcardStatus && <p role="status">{flashcardStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Back
            </button>
          </>
        ) : page === 'create-user' ? (
          <>
            <h1>Create user</h1>
            <form
              className="Create-user-form"
              aria-label="Create user form"
              onSubmit={handleCreateUserSubmit}
            >
              <label>
                Login
                <input
                  name="login"
                  type="text"
                  pattern="[A-Za-z0-9]+"
                  required
                  value={createUserForm.login}
                  onChange={handleCreateUserChange}
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  pattern="[A-Za-z0-9]+"
                  required
                  value={createUserForm.password}
                  onChange={handleCreateUserChange}
                />
              </label>
              <label>
                Flashcards amount
                <input
                  name="flash_amount"
                  type="number"
                  min="1"
                  required
                  value={createUserForm.flash_amount}
                  onChange={handleCreateUserChange}
                />
              </label>
              <label>
                New flashcards amount
                <input
                  name="new_flash_amount"
                  type="number"
                  min="0"
                  required
                  value={createUserForm.new_flash_amount}
                  onChange={handleCreateUserChange}
                />
              </label>
              <button
                className="Menu-button Create-user-submit"
                type="submit"
              >
                Create user
              </button>
            </form>
            {createUserStatus && <p role="status">{createUserStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <h1>Log in</h1>
            <form
              className="Login-form"
              aria-label="Log in form"
              onSubmit={handleLoginSubmit}
            >
              <label>
                Login
                <input
                  name="login"
                  type="text"
                  required
                  value={loginForm.login}
                  onChange={handleLoginChange}
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
              </label>
              <button
                className="Menu-button Login-submit"
                type="submit"
              >
                Log in
              </button>
            </form>
            {loginStatus && <p role="status">{loginStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Back
            </button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
