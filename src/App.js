import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Login from './components/Login';
import Notification from './components/Notification';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      (async () => {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      })();
    }
  }, [user]);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    };

    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));
    setErrorMessage(
      `A New Blog: ${returnedBlog.title} by ${returnedBlog.author} has been added!`
    );
    setErrorState(false);
    setTimeout(() => {
      setErrorMessage(null);
      setErrorState(null);
    }, 5000);
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  return (
    <div>
      {user === null ? (
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          errorMessage={errorMessage}
          errorState={errorState}
          setErrorMessage={setErrorMessage}
          setErrorState={setErrorState}
          setUser={setUser}
          setBlogs={setBlogs}
        />
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} is logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
          <Notification message={errorMessage} error={errorState} />
          <h2>Create New Blog</h2>
          <form onSubmit={addBlog}>
            <div>
              Title:
              <input
                type='text'
                value={blogTitle}
                name='Title'
                onChange={({ target }) => setBlogTitle(target.value)}
              />
            </div>
            <div>
              Author:
              <input
                type='text'
                value={blogAuthor}
                name='Author'
                onChange={({ target }) => setBlogAuthor(target.value)}
              />
            </div>
            <div>
              Url:
              <input
                type='text'
                value={blogUrl}
                name='Url'
                onChange={({ target }) => setBlogUrl(target.value)}
              />
            </div>
            <button type='submit'>Create</button>
          </form>
          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
