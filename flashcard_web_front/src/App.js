import './App.css';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const [createUserForm, setCreateUserForm] = useState({
    login: '',
    password: '',
    flash_amount: 20,
    new_flash_amount: 5,
  });
  const [createUserStatus, setCreateUserStatus] = useState('');

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

  return (
    <div className="App">
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
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('home')}
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
            <form className="Login-form" aria-label="Log in form">
              <label>
                Login
                <input name="login" type="text" required />
              </label>
              <label>
                Password
                <input name="password" type="password" required />
              </label>
              <button
                className="Menu-button Login-submit"
                type="submit"
              >
                Log in
              </button>
            </form>
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
