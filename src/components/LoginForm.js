import React, { useState } from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import Notification from './Notification';
import PropTypes from 'prop-types';

const LoginForm = ({
  setUser,
  errorMessage,
  setErrorMessage,
  errorState,
  setErrorState,
  setBlogs,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      setBlogs(response.sort((a, b) => b.likes - a.likes));
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
            id='username'
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            id='password'
            type='password'
            value={password}
            name='current-password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='login-button'>
          Login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  setErrorState: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
};

export default LoginForm;
