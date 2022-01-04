import React, { useState } from 'react';
import blogService from '../services/blogs';
const Blog = ({ blog, user, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

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

  const increaseLike = async () => {
    const newLikes = likes + 1;
    const updatedBlog = {
      user: user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    const response = await blogService.update(blog.id, updatedBlog);
    await setLikes(response.likes);
    const blogIndex = blogs.findIndex((obj) => obj.id === blog.id);
    blogs[blogIndex].likes = newLikes;
    await setBlogs(blogs);
    const newBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    await setBlogs(newBlogs);
  };

  const deleteBlog = async () => {
    console.log('user', user.username, 'blog user', blog);
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}`)) {
      const response = await blogService.delete(blog.id);
      console.log(response);
      setBlogs(blogs.filter((blog) => blog.id !== response.id));
    }
  };

  const showBlog = () => (
    <>
      <p>{blog.url}</p>
      <p>
        Likes {likes} <button onClick={increaseLike}>Like</button>
      </p>
      <p>{user.name}</p>
      <button onClick={deleteBlog}>Delete</button>
      {/* {blog.user.id === user.id ? <button>Delete</button> : null} */}
    </>
  );
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      {visible ? (
        <>
          <button onClick={toggleVisibility}>Hide</button>
          {showBlog()}
        </>
      ) : (
        <button onClick={toggleVisibility}>View</button>
      )}
    </div>
  );
};

export default Blog;
