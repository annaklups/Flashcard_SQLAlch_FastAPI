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
  const [loggedInUserId, setLoggedInUserId] = useState(null);
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
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });
  const [passwordStatus, setPasswordStatus] = useState('');
  const [deleteUserForm, setDeleteUserForm] = useState({
    old_password1: '',
    old_password2: '',
  });
  const [deleteUserStatus, setDeleteUserStatus] = useState('');
  const [learningCard, setLearningCard] = useState(null);
  const [learningAnswer, setLearningAnswer] = useState('');
  const [learningStatus, setLearningStatus] = useState('');
  const [learningSessionStarted, setLearningSessionStarted] = useState(false);
  const [learningSessionCompleted, setLearningSessionCompleted] = useState(false);
  const [sessionFlashAmount, setSessionFlashAmount] = useState(20);
  const [sessionNewFlashAmount, setSessionNewFlashAmount] = useState(5);
  const [sessionCardNumber, setSessionCardNumber] = useState(1);

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

      const userFlashAmount = Number(responseBody.flash_amount ?? settingsForm.flash_amount ?? 20);
      const userNewFlashAmount = Number(responseBody.new_flash_amount ?? settingsForm.new_flash_amount ?? 5);

      setLoggedInUser(responseBody.username);
      setLoggedInUserId(responseBody.user_id);
      setSessionFlashAmount(userFlashAmount);
      setSessionNewFlashAmount(userNewFlashAmount);
      setSettingsForm((currentForm) => ({
        ...currentForm,
        flash_amount: userFlashAmount,
        new_flash_amount: userNewFlashAmount,
      }));
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
      setSessionFlashAmount(Number(settingsForm.flash_amount));
      setSessionNewFlashAmount(Number(settingsForm.new_flash_amount));
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

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus('');

    if (passwordForm.new_password1 !== passwordForm.new_password2) {
      setPasswordStatus('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/user/update_pass', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to change password.');
      }

      setPasswordStatus('Password changed successfully.');
      setPasswordForm({ old_password: '', new_password1: '', new_password2: '' });
    } catch (error) {
      setPasswordStatus(error.message);
    }
  };

  const handleDeleteUserChange = (event) => {
    const { name, value } = event.target;
    setDeleteUserForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleDeleteUserSubmit = async (event) => {
    event.preventDefault();
    setDeleteUserStatus('');

    try {
      const response = await fetch('http://localhost:8000/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(deleteUserForm),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to delete user.');
      }

      localStorage.removeItem('access_token');
      setLoggedInUser('');
      setLoginStatus('');
      setPage('menu');
    } catch (error) {
      setDeleteUserStatus(error.message);
    }
  };

  const loadLearningCard = async (isNewCard = true) => {
    setLearningStatus('');
    setLearningCard(null);
    setLearningAnswer('');
    setLearningSessionStarted(true);

    try {
      const response = await fetch(`http://localhost:8000/learning/?is_new=${isNewCard}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to load a flashcard.');
      }

      setLearningCard(responseBody);
    } catch (error) {
      setLearningStatus(error.message);
    }
  };

  const handleLearningAnswerSubmit = async (event) => {
    event.preventDefault();
    setLearningStatus('');

    try {
      const response = await fetch('http://localhost:8000/learning/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          flash_num: learningCard.flash_num,
          pol: learningCard.pol,
          answer: learningAnswer,
          user_num: loggedInUserId,
        }),
      });
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.detail || 'Unable to check the answer.');
      }

      const isFinalCard = sessionCardNumber >= sessionFlashAmount;

      if (isFinalCard) {
        setLearningSessionStarted(false);
        setLearningSessionCompleted(true);
        setSessionCardNumber(sessionFlashAmount);
        setLearningCard(null);
        setLearningAnswer('');
        setLearningStatus('');
        return;
      }

      setLearningStatus(
        responseBody.wage_change === -1
          ? 'Correct answer.'
          : `Incorrect answer. Correct translation: ${responseBody.translate}`,
      );
      setLearningCard(null);
      setLearningAnswer('');
    } catch (error) {
      setLearningStatus(error.message);
    }
  };

  const handleLearningSessionStart = () => {
    setLearningSessionCompleted(false);
    setSessionCardNumber(1);
    setLearningStatus('');
    setLearningAnswer('');
    setLearningSessionStarted(true);
    loadLearningCard(1 <= sessionNewFlashAmount);
  };

  const handleNextLearningCard = () => {
    const nextCardNumber = sessionCardNumber + 1;

    if (nextCardNumber > sessionFlashAmount) {
      setLearningSessionStarted(false);
      setLearningSessionCompleted(true);
      setLearningCard(null);
      setLearningAnswer('');
      setLearningStatus('');
      setSessionCardNumber(sessionFlashAmount);
      return;
    }

    setSessionCardNumber(nextCardNumber);
    loadLearningCard(nextCardNumber <= sessionNewFlashAmount);
  };

  const handleLearningSessionRestart = () => {
    setLearningSessionCompleted(false);
    setLearningSessionStarted(false);
    setSessionCardNumber(1);
    setLearningStatus('');
    setLearningCard(null);
    setLearningAnswer('');
    setPage('learning');
    setTimeout(() => handleLearningSessionStart(), 0);
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
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    setPasswordStatus('');
                    setPage('password');
                  }}
                >
                  Change password
                </button>
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    setDeleteUserStatus('');
                    setPage('delete-user');
                  }}
                >
                  Delete user
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
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    setLearningStatus('');
                    setLearningCard(null);
                    setLearningAnswer('');
                    setLearningSessionStarted(false);
                    setSessionCardNumber(1);
                    setPage('learning');
                  }}
                >
                  Start learning
                </button>
                <button
                  className="Menu-button"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    setLoggedInUser('');
                    setLoggedInUserId(null);
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
        ) : page === 'learning' ? (
          <>
            <h1>Learning</h1>
            {!learningSessionStarted && !learningSessionCompleted && !learningCard && !learningStatus && (
              <button className="Menu-button" type="button" onClick={handleLearningSessionStart}>
                Start session
              </button>
            )}
            {learningSessionCompleted && (
              <>
                <p>Session completed</p>
                <p>Do you want to start next session?</p>
                <button className="Menu-button" type="button" onClick={handleLearningSessionRestart}>
                  Yes
                </button>
                <button
                  className="Back-button"
                  type="button"
                  onClick={() => {
                    setLearningSessionCompleted(false);
                    setLearningSessionStarted(false);
                    setSessionCardNumber(1);
                    setPage('menu');
                  }}
                >
                  No
                </button>
              </>
            )}
            {learningSessionStarted && !learningSessionCompleted && (
              <p>Card {sessionCardNumber} / {sessionFlashAmount}</p>
            )}
            {learningCard && (
              <form
                className="Learning-form"
                aria-label="Learning form"
                onSubmit={handleLearningAnswerSubmit}
              >
                <p>{learningCard.pol}</p>
                <label>
                  Translation
                  <input
                    name="answer"
                    type="text"
                    value={learningAnswer}
                    onChange={(event) => setLearningAnswer(event.target.value)}
                    required
                  />
                </label>
                <button className="Menu-button" type="submit">
                  Check answer
                </button>
              </form>
            )}
            {!learningCard && learningSessionStarted && !learningStatus && (
              <p>Loading flashcard...</p>
            )}
            {learningStatus && <p role="status">{learningStatus}</p>}
            {!learningCard && learningStatus && !learningSessionCompleted && (
              <button className="Menu-button" type="button" onClick={handleNextLearningCard}>
                Next card
              </button>
            )}
            <button
              className="Back-button"
              type="button"
              onClick={() => {
                setLearningSessionStarted(false);
                setSessionCardNumber(1);
                setPage('menu');
              }}
            >
              Back
            </button>
          </>
        ) : page === 'delete-user' ? (
          <>
            <h1>Delete user</h1>
            <form
              className="Password-form"
              aria-label="Delete user form"
              onSubmit={handleDeleteUserSubmit}
            >
              <label>
                Current password
                <input
                  name="old_password1"
                  type="password"
                  value={deleteUserForm.old_password1}
                  onChange={handleDeleteUserChange}
                  required
                />
              </label>
              <label>
                Confirm current password
                <input
                  name="old_password2"
                  type="password"
                  value={deleteUserForm.old_password2}
                  onChange={handleDeleteUserChange}
                  required
                />
              </label>
              <button className="Menu-button Password-submit" type="submit">
                Delete user
              </button>
            </form>
            {deleteUserStatus && <p role="status">{deleteUserStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
            >
              Back
            </button>
          </>
        ) : page === 'password' ? (
          <>
            <h1>Change password</h1>
            <form
              className="Password-form"
              aria-label="Change password form"
              onSubmit={handlePasswordSubmit}
            >
              <label>
                Current password
                <input
                  name="old_password"
                  type="password"
                  required
                  value={passwordForm.old_password}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                New password
                <input
                  name="new_password1"
                  type="password"
                  pattern="[A-Za-z0-9]+"
                  required
                  value={passwordForm.new_password1}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                Confirm new password
                <input
                  name="new_password2"
                  type="password"
                  pattern="[A-Za-z0-9]+"
                  required
                  value={passwordForm.new_password2}
                  onChange={handlePasswordChange}
                />
              </label>
              <button
                className="Menu-button Password-submit"
                type="submit"
              >
                Save password
              </button>
            </form>
            {passwordStatus && <p role="status">{passwordStatus}</p>}
            <button
              className="Back-button"
              type="button"
              onClick={() => setPage('menu')}
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
