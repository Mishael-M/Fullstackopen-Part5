import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorState, setErrorState] = useState(null);

  const [user, setUser] = useState(null);

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
        try {
          const blogs = await blogService.getAll();
          setBlogs(blogs.sort((a, b) => b.likes - a.likes));
        } catch (e) {
          setUser(null);
        }
      })();
    }
  }, [user]);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

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
  };

  const blogFormRef = useRef();

  const blogForm = () => (
    <Togglable buttonLabel='Create New Blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div>
      {user === null ? (
        <LoginForm
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
          {blogForm()}
          <div>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                blogs={blogs}
                setBlogs={setBlogs}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
