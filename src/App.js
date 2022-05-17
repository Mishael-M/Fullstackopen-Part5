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
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
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
    window.localStorage.removeItem('loggedBlogappUser');
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

  const updateLikesOf = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };
    await blogService.update(blog.id, changedBlog);
    await setBlogs(blogs.map((blog) => (blog.id === id ? changedBlog : blog)));
    const updatedBlogs = await blogService.getAll();
    const newBlogs = [...updatedBlogs].sort((a, b) => b.likes - a.likes);
    await setBlogs(newBlogs);
  };

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
            <button onClick={handleLogout} id='logout-button'>
              Logout
            </button>
          </p>
          <Notification message={errorMessage} error={errorState} />
          {blogForm()}
          <div>
            {blogs.map((blog) => (
              <Blog
                errorMessage={errorMessage}
                errorState={errorState}
                setErrorMessage={setErrorMessage}
                setErrorState={setErrorState}
                key={blog.id}
                blog={blog}
                user={user}
                blogs={blogs}
                setBlogs={setBlogs}
                updateLikes={() => updateLikesOf(blog.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
