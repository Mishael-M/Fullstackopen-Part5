import React, { useState } from 'react';
import blogService from '../services/blogs';
const Blog = ({ blog, user, blogs, setBlogs, updateLikes }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 5,
  };

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      const response = await blogService.delete(blog.id);
      setBlogs(blogs.filter((blog) => blog.id !== response.id));
    }
  };

  const showBlog = () => (
    <>
      <p>{blog.url}</p>
      <p>
        Likes {blog.likes}{' '}
        <button onClick={updateLikes} className='likeButton'>
          Like
        </button>
      </p>
      <p>{user.name}</p>
      {blog.user.username === user.username ? (
        <button onClick={deleteBlog}>Delete</button>
      ) : null}
    </>
  );

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}{' '}
      {visible ? (
        <>
          <button onClick={toggleVisibility} className='togglableContent'>
            Hide
          </button>
          {showBlog()}
        </>
      ) : (
        <button onClick={toggleVisibility}>View</button>
      )}
    </div>
  );
};

export default Blog;
