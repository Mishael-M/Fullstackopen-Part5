import React from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import Notification from './Notification';

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  setUser,
  errorMessage,
  setErrorMessage,
  errorState,
  setErrorState,
  setBlogs,
}) => {
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setErrorMessage('');
      setErrorState(null);
      const response = await blogService.getAll();
      setBlogs(response);
    } catch (exception) {
      setErrorMessage('Wrong Username or Password');
      setErrorState(true);
      setTimeout(() => {
        setErrorMessage(null);
        setErrorState(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Log in to Application</h2>
      <Notification message={errorMessage} error={errorState} />
      <form onSubmit={handleLogin}>
        <div>
          Username:
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type='password'
            value={password}
            name='current-password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
